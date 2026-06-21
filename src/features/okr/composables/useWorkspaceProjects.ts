import { computed, type Ref } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { boardKeys } from '@/api/queries/useProject';
import type { Board } from '@/features/board/types/board.types';

export function useWorkspaceProjects(workspaceId: Ref<string>) {
  const queryClient = useQueryClient();

  const projects = computed(() => {
    const boards = queryClient.getQueryData<Board[]>(boardKeys.byWorkspace(workspaceId.value));

    if (!boards) return [];

    return boards.map((board) => ({
      id: board.id,
      title: board.title,
    }));
  });

  return {
    projects,
  };
}
