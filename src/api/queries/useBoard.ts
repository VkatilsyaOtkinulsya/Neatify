import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { BoardService } from '../services/board.service';
import { boardKeys } from './useProject';
import type { Board, BoardColumn } from '@/features/board/types/project.types';

export function useCreateColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BoardColumn>) => BoardService.createBoardColumn(boardId, data),

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: boardKeys.detail(boardId) });

      const previousBoard = queryClient.getQueryData(boardKeys.detail(boardId));

      queryClient.setQueryData<Board>(boardKeys.detail(boardId), (old) => {
        if (!old) return old;

        return {
          ...old,
          columns: [
            ...old.columns,
            {
              _id: `temp-${Date.now()}`,
              ...data,
              createdAt: new Date(),
            } as BoardColumn,
          ],
        };
      });

      return { previousBoard };
    },

    onError: (_, __, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(boardKeys.detail(boardId), context.previousBoard);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
    },
  });
}

export function useMoveColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ columnId, position }: { columnId: string; position: number }) =>
      BoardService.moveColumn(boardId, columnId, { position }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
      await queryClient.refetchQueries({ queryKey: boardKeys.detail(boardId) });
    },
  });
}

export function useUpdateColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ columnId, data }: { columnId: string; data: Partial<BoardColumn> }) => {
      return BoardService.updateColumn(boardId, columnId, data);
    },

    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: boardKeys.detail(boardId) });
    },
  });
}
