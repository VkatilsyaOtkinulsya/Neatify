import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { BoardService } from '../services/board.service';
import type { Board, ProjectDetails } from '@/features/board/types/board.types';
import { computed, toValue, unref, type MaybeRef, type MaybeRefOrGetter, type Ref } from 'vue';
import { handleApiError, showNotification } from '@/shared/lib/utils/error-handler';
import router from '@/router';

export const boardKeys = {
  all: ['boards'] as const,
  byWorkspace: (workspaceId: string) => ['boards', 'workspace', workspaceId] as const,
  detail: (boardId: MaybeRef<string>) => ['board', boardId] as const,
};

export const boardQuery = (projectId: string) => ({
  queryKey: boardKeys.detail(projectId),
  queryFn: () => BoardService.getById(projectId),
});

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

export function useProjectDetails(
  workspaceId: MaybeRefOrGetter<string>,
  boardId: MaybeRefOrGetter<string>
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: computed(() => boardKeys.detail(toValue(boardId))),
    queryFn: () => BoardService.getById(toValue(boardId)),
    initialData: () => {
      const boards = queryClient.getQueryData<Board[]>(boardKeys.byWorkspace(toValue(workspaceId)));
      return boards?.find((b) => b.id === toValue(boardId)) as ProjectDetails;
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(boardKeys.byWorkspace(toValue(workspaceId)))?.dataUpdatedAt,
    staleTime: 30 * 1000,
    enabled: computed(() => !!toValue(boardId)),
  });
}

export function useCreateProject() {
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
          id: `temp-${Date.now()}`,
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

export function useDeleteProject(workspaceId: MaybeRef<string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => BoardService.delete(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(unref(workspaceId)) });
      showNotification('Проект удален', 'success');

      router.push(`/spaces/${unref(workspaceId)}/projects`);
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
}

//  обновление
