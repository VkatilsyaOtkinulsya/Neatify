import type { ProjectDetails } from '@/features/board/types/board.types';
import { computed, unref, type MaybeRef } from 'vue';

export type Permission =
  | 'view_workspace'
  | 'update_workspace'
  | 'delete_workspace'
  | 'manage_workspace'
  | 'view_project'
  | 'update_project'
  | 'move_project'
  | 'delete_project'
  | 'manage_members'
  | 'create_column'
  | 'update_column'
  | 'delete_column'
  | 'create_task'
  | 'update_task'
  | 'delete_task'
  | 'move_task'
  | 'create_comment'
  | 'delete_comment';

export function usePermissions(
  project: MaybeRef<ProjectDetails | null | undefined>,
  userId: MaybeRef<string>
) {
  const permissions = computed<Permission[]>(() => {
    const p = unref(project);
    const uid = unref(userId);
    if (!p) return [];

    const member = p.members.find((m) => m.userId === uid);
    return (member?.permissions ?? []) as Permission[];
  });

  /** Есть ли конкретное право */
  const can = (permission: Permission): boolean => permissions.value.includes(permission);

  /** Есть ли хотя бы одно из прав */
  const canAny = (...perms: Permission[]): boolean =>
    perms.some((p) => permissions.value.includes(p));

  /** Есть ли все права из списка */
  const canAll = (...perms: Permission[]): boolean =>
    perms.every((p) => permissions.value.includes(p));

  return { can, canAny, canAll, permissions };
}
