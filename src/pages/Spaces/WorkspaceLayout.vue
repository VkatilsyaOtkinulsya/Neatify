<script setup lang="ts">
import { computed, provide } from 'vue';
import { useRoute } from 'vue-router';
import { SpaceIcon } from '@/components/icons/index';
import { useWorkspace } from '@/api/queries/useWorkspace';
import Loader from '@/components/ui/loader/Loader.vue';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue';

const route = useRoute();
const workspaceId = computed(() => route.params.workspaceId as string);

const { data: workspace, isLoading } = useWorkspace(workspaceId);

provide('workspace', workspace);
</script>

<!-- это ХЕДЕР-->
<template>
  <div class="workspace-wrapper">
    <div v-if="isLoading">
      <Loader color="#fff" />
    </div>
    <div v-else class="workspace-container">
      <div class="header__nav-list">
        <div class="nav-item">
          <SpaceIcon class="mr-1" :color="'#000'" :size="18" />
          <Breadcrumb />
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss">
.workspace-wrapper {
  width: 100%;
  height: 100vh;
  background-color: #f1ffef;
  box-sizing: border-box;
}
.workspace-container {
  height: 100%;
}
.header__nav-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  padding: 1.875rem 1.875rem 0;
  gap: 12px;
  margin-bottom: 1.25rem;
  box-sizing: border-box;

  .nav-item {
    display: flex;
    align-items: center;

    svg {
      color: #000;
    }

    a {
      color: #000;
      font-size: 1rem;
      font-weight: 500;
      font-family: 'Roboto', sans-serif;
      line-height: 21px;
      text-wrap: nowrap;
    }
  }
}
</style>
