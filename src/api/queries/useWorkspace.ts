import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { WorkpacesService } from '../services/spaces.service';
import type { Workspace } from '@/features/workspace/types/workspace.types';
import { computed, type Ref } from 'vue';

export const workspaceKeys = {
  all: ['workspaces'] as const,
  detail: (id: string) => ['workspaces', id] as const,
};

export function useUserWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.all,
    queryFn: () => WorkpacesService.getUserWorkspaces(),
    staleTime: 60 * 60 * 1000,
    gcTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useWorkspace(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => workspaceKeys.detail(id.value)),
    queryFn: () => WorkpacesService.getWorkspace(id.value),
    staleTime: 10 * 60 * 1000,
    enabled: computed(() => !!id.value),
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Workspace>) => WorkpacesService.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

// удаление

// добавление участника
