import type { NavigationGuard } from 'vue-router';
import type { Permission } from './usePermissions';
import { useAuthStore } from '@/stores/auth.store';
import { useQueryClient } from '@tanstack/vue-query';
import { boardQuery } from '@/api/queries/useProject';
import type { ProjectDetails } from '@/features/board/types/board.types';

export function requirePermission(...required: Permission[]): NavigationGuard {
  return async (to) => {
    const queryClient = useQueryClient();
    const authStore = useAuthStore();

    const { projectId } = to.params as Record<string, string>;

    const project = await queryClient.ensureQueryData<ProjectDetails>(boardQuery(projectId));
    const member = project.members.find((m) => m.userId === authStore.userInfo?.id);
    const perms = (member?.permissions ?? []) as Permission[];

    const allowed = required.every((p) => perms.includes(p));
    return allowed ? true : { name: 'forbidden' };
  };
}
