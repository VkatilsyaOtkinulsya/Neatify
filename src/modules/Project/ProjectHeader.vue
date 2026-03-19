<script setup lang="ts">
import { useProjectDetail } from '@/api/queries/useProject';
import Button from '@/components/ui/button/Button.vue';
import Popover from '@/components/ui/popover/Popover.vue';
import PopoverContent from '@/components/ui/popover/PopoverContent.vue';
import PopoverTrigger from '@/components/ui/popover/PopoverTrigger.vue';
import type { IBoardMemberWithProfile } from '@/shared/types/user.types';
import { Bolt, Info, UserRoundPlus } from 'lucide-vue-next';
import { useRoute } from 'vue-router';

defineProps<{ users: IBoardMemberWithProfile[] }>();

const route = useRoute();
const projectId = route.params.projectId as string;
const workspaceId = route.params.workspaceId as string;

const isActive = (name: string) => route.name === name;

const links = [
  { name: 'review', label: 'Обзор' },
  { name: 'board', label: 'Доска' },
  { name: 'table', label: 'Список' },
] as const;

const { data: projectData } = useProjectDetail(workspaceId, projectId);
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
        <div class="users">
          <div v-for="user in users" :key="user.userId">{{ user.profile?.displayName }}</div>
        </div>
        <popover>
          <popover-trigger as-child class="cursor-pointer">
            <Button variant="outline"><Info /></Button>
          </popover-trigger>
          <popover-content class="w-80">
            <div class="grid gap-4">
              <div class="space-y-2">
                <h4 class="font-medium leading-none">Администраторы доски</h4>
                <p class="text-sm text-muted-foreground">Иван Романов</p>
                <p class="text-sm text-muted-foreground">{{ projectData?.ownerId }}</p>
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
        <Popover>
          <PopoverTrigger as-child class="cursor-pointer">
            <Button variant="outline"><Bolt /></Button>
          </PopoverTrigger>
          <PopoverContent class="">
            <div class="flex flex-col gap-2">
              <div class="font-bold">Настройки</div>
              <Button variant="outline" class="flex space-y-2">
                <user-round-plus class="m-0" />
                <p class="font-medium leading-none">Добавить участника</p>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-item {
  width: 100%;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 6px 0;
  background-color: rgba($color: #fff, $alpha: 0.7);
  border-radius: 0.5rem;
  cursor: pointer;

  opacity: 0.5;
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
  cursor: pointer;
}
</style>
