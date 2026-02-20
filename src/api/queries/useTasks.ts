import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { TaskService } from '../services/task.service';
import type { Task } from '@/features/task/types/task.types';

export const taskKeys = {
  all: ['tasks'] as const,
  byBoard: (boardId?: string) => ['Board tasks', boardId] as const,
};

export function useBoardTasks(boardId: string) {
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
    mutationFn: (data: Partial<Task>): Promise<Task> => {
      if (data.boardId === undefined) {
        throw new Error('boardId is required to create a task');
      }

      return TaskService.createInBoard(data.boardId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(boardId) });
    },
  });
}

export function useDeleteTask(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => TaskService.delete(taskId, true).then(() => boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(boardId) });
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
