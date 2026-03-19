import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { TaskService } from '../services/task.service';
import type { ChecklistItemInput, Task, TaskPayloadBase } from '@/features/task/types/task.types';

export type CreateTaskPayload = Omit<Partial<Task>, 'checklist'> & {
  checklist?: ChecklistItemInput[];
};

export const taskKeys = {
  all: ['tasks'] as const,
  byBoard: (boardId?: string) => ['Board tasks', boardId] as const,
};

export function useProjectTasks(boardId: string) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: taskKeys.byBoard(boardId),
    queryFn: () => TaskService.getBoardTasks(boardId),
    staleTime: 60 * 1000,
  });

  return { data, isLoading, isError, refetch };
}

export function useCreateTask(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskPayload): Promise<Task> => {
      return TaskService.createInBoard(boardId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(boardId) });
    },
  });
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskPayloadBase }) =>
      TaskService.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export function useDeleteTask(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => TaskService.delete(taskId, true).then(() => boardId), // true, перманентное удаление
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(boardId) });
    },
  });
}

export function useCompleteTask(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => TaskService.complete(taskId),

    onMutate: async (taskId) => {
      await queryClient.cancelQueries({
        queryKey: taskKeys.byBoard(boardId),
      });

      const previousTasks = queryClient.getQueryData(taskKeys.byBoard(boardId));

      queryClient.setQueryData(taskKeys.byBoard(boardId), (old: any) => {
        if (!old) return old;

        const newTasksByColumn = Object.fromEntries(
          Object.entries(old.tasksByColumn).map(([columnId, tasks]: any) => [
            columnId,
            tasks.filter((t: any) => t.id !== taskId),
          ])
        );

        return {
          ...old,
          tasksByColumn: newTasksByColumn,
        };
      });

      return { previousTasks };
    },

    onError: (_err, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.byBoard(boardId), context.previousTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.byBoard(boardId),
      });
    },
  });
}

export function useMoveTask(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      taskId: string;
      fromColumnId: string;
      toColumnId: string;
      beforeTaskId?: string;
      afterTaskId?: string;
    }) => TaskService.moveTask(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(boardId) });
      await queryClient.refetchQueries({ queryKey: taskKeys.byBoard(boardId) });
    },
  });
}
