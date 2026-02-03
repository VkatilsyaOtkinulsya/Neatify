import type { Task } from '../types/task.types';

export function useTasks() {
  const createTask = (data: Partial<Task>) => {
    if (!data) return;

    const task = {
      title: data.title,
      description: data?.description,
      creator: data.boardId,
    };
    return task;
  };

  return {
    createTask,
  };
}
