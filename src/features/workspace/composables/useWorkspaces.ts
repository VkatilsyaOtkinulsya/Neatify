import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { WorkpacesService } from '@/api/services/spaces.service';
interface SpacesQueryProps {
  workspaceId: string;
}

export const useWorkspacesQuery = ({ workspaceId }: SpacesQueryProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['spaces'],
    queryFn: () => WorkpacesService.getUserWorkspaces(),
  });

  const workspace = computed(() => {
    if (!workspaceId) return;
    return data.value?.find((workspace) => workspace.id === workspaceId);
  });

  return {
    workspace,
    data,
    isLoading,
    error,
  };
};
