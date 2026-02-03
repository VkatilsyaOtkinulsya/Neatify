import { useBoardDetail, useCreateBoard, useCreateColumn } from '@/api/queries/useBoard';
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

  // Drag and Drop handlers
  const handleDragStart = (taskId: string, onDragStateChange?: (isDragging: boolean) => void) => {
    draggedTaskId.value = taskId;
    onDragStateChange?.(true);
  };

  const handleDragEnd = (onDragStateChange?: (isDragging: boolean) => void) => {
    draggedTaskId.value = null;
    onDragStateChange?.(false);
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (columnId: string, event: DragEvent) => {
    event.preventDefault();

    if (!draggedTaskId.value) return;

    const tasksInColumn = tasksData.value?.tasksByColumn[columnId] || [];
    const newPosition = tasksInColumn.length;

    moveTaskMutation({
      taskId: draggedTaskId.value,
      columnId,
      position: newPosition,
    });

    draggedTaskId.value = null;
  };

  const getTasksForColumn = (columnId: string) => {
    return tasksData.value?.tasksByColumn[columnId] || [];
  };

  return {
    title: computed(() => board.value?.title),
    board,
    draggedTaskId,

    createBoard,
    createBoardColumn,
    getTasksForColumn,

    isLoadingBoard,
    isError,

    tasksData,
    isLoadingTasks,
    isErrorTasks,

    // Drag and Drop
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
}
