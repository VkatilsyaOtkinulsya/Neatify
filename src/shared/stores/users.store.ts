import { defineStore } from 'pinia';
import { handleApiError } from '@/shared/lib/utils/error-handler';
import type { IBoardMemberSafe } from '../types/user.types';
import { BoardService } from '@/api/services/board.service';
import { normalizeUser } from '../lib/utils/normalizeUser';

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
  },
});
