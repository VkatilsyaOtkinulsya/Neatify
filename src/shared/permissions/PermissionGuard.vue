<script setup lang="ts">
import { computed, inject } from 'vue';
import type { Permission } from './usePermissions';
import { PERMISSIONS_KEY } from './permissionsKey';

const props = withDefaults(
  defineProps<{
    require: Permission | Permission[];
    mode?: 'any' | 'all';
    fallback?: boolean;
  }>(),
  { mode: 'any', fallback: false }
);

const permissionsCtx = inject(PERMISSIONS_KEY);

if (!permissionsCtx) {
  throw new Error('PERMISSIONS_KEY not provided');
}

const allowed = computed(() => {
  const perms = Array.isArray(props.require) ? props.require : [props.require];

  const userPerms = permissionsCtx.permissions.value;
  return props.mode === 'all'
    ? perms.every((p) => userPerms.includes(p))
    : perms.some((p) => userPerms.includes(p));
});
</script>

<template>
  <slot v-if="allowed" />
  <slot v-else-if="fallback" name="fallback" />
</template>
