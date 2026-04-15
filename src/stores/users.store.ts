import { defineStore } from 'pinia';
import { handleApiError } from '@/shared/lib/utils/error-handler';
import type { IBoardMemberSafe } from '@/shared/types/user.types';
import { BoardService } from '@/api/services/board.service';
import { normalizeUser } from '@/shared/lib/utils/normalizeUser';
import type { AddMemberPayload } from '@/features/board/types/board.types';

interface ProjectUsersState {
  users: IBoardMemberSafe[];
}

export const useUsersStore = defineStore('project users', {
  state: (): ProjectUsersState => ({
    users: [] as IBoardMemberSafe[],
  }),

  getters: {
    getUser: (state) => (userId: string) => state.users.find((u) => u.userId === userId),
  },

  actions: {
    async getProjectUsers(projectId: string) {
      try {
        const data = await BoardService.getProjectUsers(projectId);
        this.users = data.map(normalizeUser);
      } catch (err) {
        handleApiError(err, { context: 'Не удалось загрузить данные пространств' });
      }
    },

    async addMember(projectId: string, payload: AddMemberPayload) {
      await BoardService.addMember(projectId, payload);
      await this.getProjectUsers(projectId);
    },

    async removeMember(projectId: string, userId: string): Promise<void> {
      await BoardService.removeMember(projectId, userId);
      await this.getProjectUsers(projectId);
    },
  },
});
