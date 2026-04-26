import { defineStore } from 'pinia';
import { handleApiError, showNotification } from '@/shared/lib/utils/error-handler';
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
      try {
        await BoardService.addMember(projectId, payload);
        await this.getProjectUsers(projectId);
        showNotification('Участник добавлен', 'success');
      } catch (err) {
        handleApiError(err, { context: 'Не удалось добавить участника' });
      }
    },

    async removeMember(projectId: string, userId: string) {
      try {
        await BoardService.removeMember(projectId, userId);
        await this.getProjectUsers(projectId);
        showNotification('Участник удален', 'success');
      } catch (err) {
        handleApiError(err, { context: 'Не удалось удалить участника' });
      }
    },
  },
});
