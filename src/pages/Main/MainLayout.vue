<script setup lang="ts">
import LeftsideBar from '@/modules/LeftsideBar/LeftsideBar.vue';
import { ref, onMounted, computed } from 'vue';
import { handleApiError } from '@/shared/lib/utils/error-handler';
import { useWorkspaceStore } from '@/stores/spaces.store';

const showLoader = ref(false);

const displayName: string = JSON.parse(localStorage.getItem('userData') || '').profile.displayName;

const spaceStore = useWorkspaceStore();
const spaceList = computed(() =>
  spaceStore.spaces.map((space) => ({
    id: space.id,
    title: space.title,
    memberCount: space.members.length,
  }))
);

onMounted(async () => {
  try {
    await spaceStore.loadSpaces();
  } catch (err) {
    handleApiError(err);
  }
});
</script>

<template>
  <LeftsideBar :spaces="spaceList" :showLoader :displayName> </LeftsideBar>
  <div class="content-wrapper">
    <router-view />
  </div>
</template>

<style scoped lang="scss">
.content-wrapper {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
