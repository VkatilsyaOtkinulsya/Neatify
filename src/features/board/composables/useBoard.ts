import {
  useProjectDetail,
  useCreateBoard,
  useCreateColumn,
  useMoveColumn,
} from '@/api/queries/useProject';
import { useProjectTasks, useMoveTask } from '@/api/queries/useTasks';
import { computed } from 'vue';

export function useBoardData(workspaceId: string, boardId: string) {
  const {
    data: project,
    isLoading: isLoadingBoard,
    isError,
  } = useProjectDetail(workspaceId, boardId);
  const { data: tasksData, isLoading: isLoadingTasks } = useProjectTasks(boardId);

  return { project, tasksData, isLoadingBoard, isLoadingTasks, isError };
}

export function useBoardActions(boardId: string) {
  const { mutate: createBoardColumn } = useCreateColumn(boardId);
  const { mutate: moveTaskMutation } = useMoveTask(boardId);
  const { mutate: moveColumnMutation } = useMoveColumn(boardId);

  const moveTask = (payload: {
    taskId: string;
    fromColumnId: string;
    toColumnId: string;
    beforeTaskId?: string;
    afterTaskId?: string;
  }) => {
    moveTaskMutation(payload);
  };

  const moveColumn = ({ columnId, position }: { columnId: string; position: number }) => {
    moveColumnMutation({ columnId, position });
  };

  return {
    createBoardColumn,
    moveTask,
    moveColumn,
  };
}

export function useProject(workspaceId: string, boardId: string) {
  const {
    data: project,
    isLoading: isLoadingBoard,
    isError,
  } = useProjectDetail(workspaceId, boardId);

  const {
    data: tasksData,
    isLoading: isLoadingTasks,
    isError: isErrorTasks,
  } = useProjectTasks(boardId);

  const { mutate: createBoard } = useCreateBoard();
  const { mutate: createBoardColumn } = useCreateColumn(boardId);
  const { mutate: moveTaskMutation } = useMoveTask(boardId);
  const { mutate: moveColumnMutation } = useMoveColumn(boardId);

  const moveTask = (payload: {
    taskId: string;
    fromColumnId: string;
    toColumnId: string;
    beforeTaskId?: string;
    afterTaskId?: string;
  }) => {
    moveTaskMutation(payload);
  };

  const moveColumn = ({ columnId, position }: { columnId: string; position: number }) => {
    moveColumnMutation({ columnId, position });
  };

  return {
    title: computed(() => project.value?.title),
    project,

    createBoard,
    createBoardColumn,

    isLoadingBoard,
    isError,

    tasksData,
    isLoadingTasks,
    isErrorTasks,

    moveTask,
    moveColumn,
  };
}
