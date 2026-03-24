import { useCreateTask } from '@/api/queries/useTasks';
import type { Task } from '../types/task.types';

export function useTasks(boardId: string) {
  const { mutate: createTaskFn, isPending, error } = useCreateTask(boardId);

  const createTask = (data: Partial<Task>) => {
    if (!data) return;

    createTaskFn(data);
  };

  return {
    createTask,
    isPending,
    error,
  };
}
