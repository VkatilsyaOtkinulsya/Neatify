import { computed, type Ref } from 'vue';
import type { HabitResponse } from '@/features/habit/types/habit.types';

type Log = {
  date: string;
  habits: {
    habitId: string;
    done: boolean;
  }[];
};

export function useHabitMatrix(
  habits: Ref<HabitResponse[]>,
  logs: Ref<Log[]>,
  from: string,
  to: string
) {
  const dates = computed(() => {
    const result: string[] = [];

    const start = new Date(from);
    const end = new Date(to);

    const current = new Date(start);

    while (current <= end) {
      result.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }

    return result;
  });

  const logMap = computed(() => {
    const map = new Map<string, Log>();

    for (const log of logs.value) {
      map.set(log.date, log);
    }

    return map;
  });

  const matrix = computed(() => {
    return dates.value.map((date) => {
      const log = logMap.value.get(date);

      return {
        date,
        habits: habits.value.map((habit) => {
          const done = log?.habits.find((h) => h.habitId === habit.id)?.done ?? false;

          return {
            habitId: habit.id,
            done,
          };
        }),
      };
    });
  });

  return {
    dates,
    matrix,
  };
}
