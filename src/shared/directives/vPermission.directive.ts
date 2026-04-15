import type { Directive } from 'vue';
import type { Permission } from '../permissions/usePermissions';

export type PermissionBinding = {
  perm: Permission | Permission[];
  userPerms: Permission[];
  mode?: 'any' | 'all';
};

/**
 * v-permission="'delete_project'"
 * v-permission="['create_task', 'update_task']"
 * v-permission="{ perms: ['delete_project'], mode: 'all' }"
 *
 * Принимает userPermissions через provide/inject или через пропс проекта
 */

function isAllowed(value: PermissionBinding): boolean {
  const required = Array.isArray(value.perm) ? value.perm : [value.perm];

  return value.mode === 'all'
    ? required.every((p) => value.userPerms.includes(p))
    : required.some((p) => value.userPerms.includes(p));
}

export const vPermission: Directive<HTMLElement, PermissionBinding> = {
  mounted(el, binding) {
    if (!isAllowed(binding.value)) el.remove();
  },
  updated(el, binding) {
    if (!isAllowed(binding.value)) el.remove();
  },
};
