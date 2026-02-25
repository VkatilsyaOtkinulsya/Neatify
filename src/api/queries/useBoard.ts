import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { BoardService } from '../services/board.service';
import type { Board, BoardColumn } from '@/features/board/types/project.types';
import { computed, type Ref } from 'vue';

export const boardKeys = {
  all: ['boards'] as const,
  byWorkspace: (workspaceId: string) => ['boards', 'workspace', workspaceId] as const,
  detail: (boardId: string) => ['board', boardId] as const,
};

export function useWorkspaceBoards(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => boardKeys.byWorkspace(id.value)),
    queryFn: () => BoardService.getByWorkspace(id.value),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000,
    enabled: computed(() => !!id.value),
  });
}

export function useBoardDetail(workspaceId: string, boardId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: boardKeys.detail(boardId),
    queryFn: () => BoardService.getById(boardId),

    initialData: () => {
      const boards = queryClient.getQueryData<Board[]>(boardKeys.byWorkspace(workspaceId));
      return boards?.find((b) => b.id === boardId);
    },

    initialDataUpdatedAt: () =>
      queryClient.getQueryState(boardKeys.byWorkspace(workspaceId))?.dataUpdatedAt,

    staleTime: 30 * 1000,
    enabled: !!boardId,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: string; data: Partial<Board> }) =>
      BoardService.createInWorkspace(workspaceId, data),

    onMutate: async ({ workspaceId, data }) => {
      await queryClient.cancelQueries({ queryKey: boardKeys.byWorkspace(workspaceId) });

      const previousBoards = queryClient.getQueryData(boardKeys.byWorkspace(workspaceId));

      queryClient.setQueryData<Board[]>(boardKeys.byWorkspace(workspaceId), (old = []) => [
        ...old,
        {
          _id: `temp-${Date.now()}`,
          ...data,
          createdAt: new Date(),
        } as Board,
      ]);

      return { previousBoards };
    },

    onError: (_, { workspaceId }, context) => {
      queryClient.setQueryData(boardKeys.byWorkspace(workspaceId), context?.previousBoards);
    },

    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(workspaceId) });
    },
  });
}

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
//  обновление

//  удаление
