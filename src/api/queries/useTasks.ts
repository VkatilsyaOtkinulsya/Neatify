import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { TaskService } from '../services/task.service';
import type { ChecklistItemInput, Task, TaskPayloadBase } from '@/features/task/types/task.types';
import type { BoardTasksResponse } from '../types/api.types';
import { mergeTask } from '@/features/task/utils/mergeTask';

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
    structuralSharing: false,
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

export const useUpdateTask = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskPayloadBase }) =>
      TaskService.update(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.byBoard(boardId) });

      const previousData = queryClient.getQueryData<BoardTasksResponse>(taskKeys.byBoard(boardId));
      if (!previousData) return;

      const previousDataSnapshot = structuredClone(previousData);

      let targetColumnId: string | null = null;
      for (const [columnId, tasks] of Object.entries(previousData.tasksByColumn)) {
        if (tasks.some((task) => task.id === id)) {
          targetColumnId = columnId;
          break;
        }
      }

      if (!targetColumnId) return { previousData: previousDataSnapshot };

      const updatedColumnTasks = previousData.tasksByColumn[targetColumnId].map((task) => {
        if (task.id === id) {
          const updated = mergeTask(task, data);
          return updated;
        }

        return task;
      });

      queryClient.setQueryData<BoardTasksResponse>(taskKeys.byBoard(boardId), {
        ...previousData,
        tasksByColumn: {
          ...previousData.tasksByColumn,
          [targetColumnId]: updatedColumnTasks,
        },
      });

      return { previousData: previousDataSnapshot };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(boardId) });
    },

    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(taskKeys.byBoard(boardId), context.previousData);
      }
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
