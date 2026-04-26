import { computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { HabitService } from '@/api/services/habits.service';
import type {
  CreateHabitDto,
  HabitLogRangeResponse,
  ToggleHabitDto,
  UpdateHabitDto,
} from '../types/habit.types';

export const habitKeys = {
  range: (from: string, to: string) => ['habit-logs', from, to] as const,
};

export function useHabitTracker(from: string, to: string) {
  const queryClient = useQueryClient();

  const invalidateRange = () =>
    queryClient.invalidateQueries({ queryKey: habitKeys.range(from, to) });

  const { data: rangeData, isLoading } = useQuery({
    queryKey: habitKeys.range(from, to),
    queryFn: () => HabitService.getRange(from, to),
  });

  const habits = computed(() => rangeData.value?.habits ?? []);
  const logs = computed(() => rangeData.value?.logs ?? []);

  const createHabit = useMutation({
    mutationFn: (dto: CreateHabitDto) => HabitService.create(dto),
    onSuccess: invalidateRange,
  });

  const updateHabit = useMutation({
    mutationFn: ({ habitId, dto }: { habitId: string; dto: UpdateHabitDto }) =>
      HabitService.update(habitId, dto),
    onSuccess: invalidateRange,
  });

  const deleteHabit = useMutation({
    mutationFn: (habitId: string) => HabitService.delete(habitId),
    onSuccess: invalidateRange,
  });

  const toggleHabit = useMutation({
    mutationFn: (dto: ToggleHabitDto) => HabitService.toggle(dto),
    onMutate: async (dto) => {
      await queryClient.cancelQueries({ queryKey: habitKeys.range(from, to) });

      const previous = queryClient.getQueryData(habitKeys.range(from, to));

      queryClient.setQueryData(
        habitKeys.range(from, to),
        (old: HabitLogRangeResponse | undefined) => {
          if (!old) return old;

          const existingLog = old.logs.find((log) => log.date === dto.date);

          const updatedLogs = existingLog
            ? old.logs.map((log) =>
                log.date !== dto.date
                  ? log
                  : {
                      ...log,
                      habits: dto.done
                        ? [...log.habits, { habitId: dto.habitId, done: true }]
                        : log.habits.filter((h) => h.habitId !== dto.habitId),
                    }
              )
            : // лога за эту дату нет — создаём новый
              [...old.logs, { date: dto.date, habits: [{ habitId: dto.habitId, done: dto.done }] }];

          return { ...old, logs: updatedLogs };
        }
      );

      return { previous };
    },

    onError: (_err, _dto, context) => {
      if (context?.previous) {
        queryClient.setQueryData(habitKeys.range(from, to), context.previous);
      }
    },
    onSuccess: invalidateRange,
  });

  return {
    habits,
    logs,
    isLoading,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
  };
}
