import {
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
  type CreateTaskPayload,
} from '@/api/queries/useTasks';
import type { TaskPayloadBase } from '@/features/task/types/task.types';
import { showNotification } from '@/shared/lib/utils/error-handler';

export function useBoardTasks(boardId: string) {
  const { mutate: createTask, isPending } = useCreateTask(boardId);
  const updateTask = useUpdateTask(boardId);
  const { mutate: deleteTaskFn, isPending: isPendingDelete } = useDeleteTask(boardId);

  const create = (data: CreateTaskPayload, onSuccess: () => void) => {
    createTask(
      { ...data, boardId },
      {
        onSuccess,
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || error?.message || 'Ошибка создания задачи';

          showNotification(message, 'error');
        },
      }
    );
  };

  const update = (id: string, data: TaskPayloadBase, onSuccess: () => void) => {
    updateTask.mutate(
      { id, data },
      {
        onSuccess,
        onError: () => showNotification('Ошибка обновления задачи', 'error'),
      }
    );
  };

  const deleteTask = (id: string) => {
    deleteTaskFn(id, {
      onSuccess: () => showNotification('Задача удалена', 'success'),
      onError: () => showNotification('Ошибка обновления задачи', 'error'),
    });
  };

  return { create, update, deleteTask, isPending, isPendingDelete };
}
