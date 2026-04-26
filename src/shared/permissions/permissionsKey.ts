import type { InjectionKey, Ref } from 'vue';
import type { Permission } from './usePermissions';

export interface PermissionsContext {
  permissions: Readonly<Ref<Permission[]>>;
  can: (permission: Permission) => boolean;
  canAny: (...perms: Permission[]) => boolean;
  canAll: (...perms: Permission[]) => boolean;
}

export const PERMISSIONS_KEY: InjectionKey<PermissionsContext> = Symbol('permissions');
