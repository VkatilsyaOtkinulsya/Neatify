<script setup lang="ts">
import ProjectHeader from './ProjectHeader.vue';
import { handleApiError } from '@/shared/lib/utils/error-handler';
import { useUsersStore } from '@/shared/stores/users.store';
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const projectId = computed(() => route.params.projectId as string);

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);

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
    <ProjectHeader :users="users" />
    <router-view />
  </div>
</template>

<style lang="scss" scoped></style>
