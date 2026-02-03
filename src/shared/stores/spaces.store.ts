import { defineStore } from 'pinia';
import { WorkpacesService } from '@/api/services/spaces.service';
import { handleApiError } from '@/shared/lib/utils/error-handler';
import type { Workspace } from '@/features/workspace/types/workspace.types';

interface WorkspaceState {
  spaces: Workspace[];
}

export const useWorkspaceStore = defineStore('workspaces', {
  state: (): WorkspaceState => ({
    spaces: [] as Workspace[],
  }),

  getters: {
    getWorkspace: (state) => (workspaceId: string) =>
      state.spaces.find((workspace) => workspace.id === workspaceId),
  },

  actions: {
    async loadSpaces() {
      try {
        this.spaces = await WorkpacesService.getUserWorkspaces();
      } catch (err) {
        handleApiError(err, { context: 'Не удалось загрузить данные пространств' });
      }
    },
  },
});
