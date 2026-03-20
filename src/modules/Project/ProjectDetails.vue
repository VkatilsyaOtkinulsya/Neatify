<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ProjectHeader from './ProjectHeader.vue';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useProject } from '@/features/project/composables/useProject';
import { useUsersStore } from '@/shared/stores/users.store';
import { handleApiError } from '@/shared/lib/utils/error-handler';

const route = useRoute();
const projectId = computed(() => route.params.projectId as string);
const workspaceId = computed(() => route.params.workspaceId as string);

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);

const { deleteProject, isDeletePending } = useProject(workspaceId);

const isDeleteDialogOpen = ref(false);

const confirmDelete = () => {
  deleteProject(projectId.value);
  isDeleteDialogOpen.value = false;
};

const handleDelete = () => {
  isDeleteDialogOpen.value = true;
};

watch(
  projectId,
  async (id) => {
    if (!id) return;

    try {
      await usersStore.getProjectUsers(id);
    } catch (err) {
      handleApiError(err); // ЭТО ФУНКЦИЯ НЕ ДЛЯ БИЗНЕС-КОМПОНЕНТА, НАДО ДЕЛАТЬ STORE НАД PROJECT ... ПО КРАСОТЕ
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="h-full">
    <ProjectHeader :users="users" @delete-project="handleDelete" />
    <router-view />
  </div>

  <AlertDialog :open="isDeleteDialogOpen" @update:open="isDeleteDialogOpen = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Удалить проект?</AlertDialogTitle>
        <AlertDialogDescription>
          Это действие нельзя отменить. Проект будет удален навсегда.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>Отмена</AlertDialogCancel>
        <AlertDialogAction
          @click="confirmDelete"
          :disabled="isDeletePending"
          class="bg-red-600 hover:bg-red-700"
        >
          Удалить
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style lang="scss" scoped></style>
