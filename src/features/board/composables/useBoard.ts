import {
  useBoardDetail,
  useCreateBoard,
  useCreateColumn,
  useMoveColumn,
} from '@/api/queries/useBoard';
import { useBoardTasks, useMoveTask } from '@/api/queries/useTasks';
import { computed, ref } from 'vue';

export function useBoard(workspaceId: string, boardId: string) {
  const draggedTaskId = ref<string | null>(null);

  const { data: board, isLoading: isLoadingBoard, isError } = useBoardDetail(workspaceId, boardId);

  const {
    data: tasksData,
    isLoading: isLoadingTasks,
    isError: isErrorTasks,
  } = useBoardTasks(boardId);

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
    title: computed(() => board.value?.title),
    board,
    draggedTaskId,

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
