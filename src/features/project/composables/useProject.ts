import { useCreateProject, useDeleteProject } from '@/api/queries/useProject';
import type { MaybeRef } from 'vue';

export function useProject(workspaceId: MaybeRef<string>) {
  const createMutation = useCreateProject();
  const deleteMutation = useDeleteProject(workspaceId);

  return {
    createProject: createMutation.mutate,
    deleteProject: deleteMutation.mutate,

    isCreatePending: createMutation.isPending,
    isDeletePending: deleteMutation.isPending,
  };
}
