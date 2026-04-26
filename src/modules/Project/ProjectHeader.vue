<script setup lang="ts">
import { useProjectDetails } from '@/api/queries/useProject';
import Button from '@/components/ui/button/Button.vue';
import Popover from '@/components/ui/popover/Popover.vue';
import PopoverContent from '@/components/ui/popover/PopoverContent.vue';
import PopoverTrigger from '@/components/ui/popover/PopoverTrigger.vue';
import PermissionGuard from '@/shared/permissions/PermissionGuard.vue';
import type { IBoardMemberSafe } from '@/shared/types/user.types';
import { Bolt, Info } from 'lucide-vue-next';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

type Administration = 'owner' | 'admin';

const props = defineProps<{ users: IBoardMemberSafe[] }>();

const emit = defineEmits<{
  'delete-project': [id: string];
}>();

const route = useRoute();
const projectId = route.params.projectId as string;
const workspaceId = route.params.workspaceId as string;

const isActive = (name: string) => route.name === name;

const links = [
  { name: 'review', label: 'Обзор' },
  { name: 'board', label: 'Доска' },
  { name: 'table', label: 'Список' },
] as const;

const { data: projectData } = useProjectDetails(workspaceId, projectId);

const isAdmin = (role: string): role is Administration => {
  return role === 'owner' || role === 'admin';
};

const adminstration = computed(() => {
  return props.users
    .filter((u) => isAdmin(u.role))
    .map((u) => ({
      name: u.profile.displayName,
      role: u.role,
    }));
});
</script>

<template>
  <div>
    <div
      class="w-full flex items-center justify-between pl-5 pr-8 shrink-0 backdrop-blur-xs max-h-12"
    >
      <nav class="flex pl-5">
        <ol class="flex gap-3.5 items-center">
          <li
            v-for="link in links"
            :key="link.name"
            class="nav-item"
            :class="{ active: isActive(link.name) }"
          >
            <router-link
              class="nav-btn nav-link"
              :to="{
                name: link.name,
                params: {
                  workspaceId: route.params.workspaceId,
                  projectId: route.params.projectId,
                },
              }"
            >
              {{ link.label }}
            </router-link>
          </li>
        </ol>
      </nav>

      <div class="flex gap-3 items-center">
        <popover>
          <popover-trigger as-child class="cursor-pointer">
            <Button variant="outline"><Info /></Button>
          </popover-trigger>
          <popover-content class="w-80">
            <div class="grid gap-4">
              <div class="space-y-2">
                <h4 class="font-medium leading-none">Администраторы доски</h4>
                <p v-for="a in adminstration" class="text-sm text-muted-foreground">
                  {{ a.name }} - {{ a.role }}
                </p>
              </div>
              <div class="space-y-2">
                <h4 class="font-medium leading-none">Описание</h4>
                <p class="text-sm text-muted-foreground">
                  {{ projectData?.description }}
                </p>
              </div>
            </div>
          </popover-content>
        </popover>

        <PermissionGuard :require="'manage_workspace'">
          <div class="settings" :class="{ active: isActive('settings') }">
            <router-link
              class="nav-link"
              :to="{
                name: 'settings',
                params: {
                  workspaceId: route.params.workspaceId,
                  projectId: route.params.projectId,
                },
              }"
            >
              <Bolt />
            </router-link>
          </div>
        </PermissionGuard>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-item {
  width: 100%;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0;

  background-color: rgba($color: #fff, $alpha: 0.7);
  border-radius: 0.5rem;
  cursor: pointer;

  opacity: 0.5;
}

.nav-item {
  width: 100%;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0;

  background-color: rgba($color: #fff, $alpha: 0.7);
  border-radius: 0.5rem;
  cursor: pointer;

  opacity: 0.5;

  .active {
    opacity: 100;
    color: #11429d;
    background-color: rgba(162, 223, 255, 0.8);
    pointer-events: auto;
  }
}

.nav-item.active {
  opacity: 100;
  color: #11429d;
  background-color: rgba(162, 223, 255, 0.8);
  pointer-events: auto;
}

.nav-btn {
  width: 5rem;
  display: flex;
  justify-content: center;
  padding: 6px 0;
  text-decoration: none;
}

.settings {
  width: 2rem;
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
}
</style>
