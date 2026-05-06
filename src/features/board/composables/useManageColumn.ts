import type { BoardColumn } from '../types/board.types';

export function useManageColumn(columns: () => BoardColumn[]) {
  const handleMoveColumnLeft = (columnId: string, moveColumn: (payload: { columnId: string; position: number }) => void) => {
    const column = columns().find((col) => col._id === columnId);
    if (!column || column.position <= 0) return;

    moveColumn({ columnId, position: column.position - 1 });
  };

  const handleMoveColumnRight = (columnId: string, moveColumn: (payload: { columnId: string; position: number }) => void) => {
    const column = columns().find((col) => col._id === columnId);
    if (!column) return;

    const maxPosition = columns().length - 1;
    if (column.position >= maxPosition) return;

    moveColumn({ columnId, position: column.position + 1 });
  };

  return {
    handleMoveColumnLeft,
    handleMoveColumnRight,
  };
}
