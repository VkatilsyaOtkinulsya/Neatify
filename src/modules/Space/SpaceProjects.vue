<script setup lang="ts">
import ProjectItemIcon from '@/components/icons/ProjectItemIcon.vue';
import Loader from '@/components/ui/loader/Loader.vue';
import AddProjectModal from '@/components/ui/modal/AddProjectModal.vue';
import EditableTitle from '@/components/ui/title/EditableTitle.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useWorkspaceBoards } from '@/api/queries/useProject';

const route = useRoute();
const workspaceId = computed(() => route.params.workspaceId as string);

const { data: boards, isLoading: isLoadingBoards } = useWorkspaceBoards(workspaceId);
</script>

<template>
  <div class="projects-wrapper">
    <div class="projects-wrapper__title">
      <EditableTitle />
    </div>
    <Loader v-if="isLoadingBoards" color="#fff" />
    <div v-else-if="boards" class="projects-list">
      <template v-for="(project, index) in boards" :key="'project-' + index">
        <router-link
          :to="{
            name: 'review',
            params: { workspaceId: workspaceId, projectId: project.id },
          }"
        >
          <div class="project-item__link">
            <div class="icon-wrapper">
              <ProjectItemIcon />
            </div>

            {{ project.title }}
          </div>
          <div v-if="index < boards.length - 1" class="separator"></div>
        </router-link>
      </template>
    </div>
    <div v-if="!boards && !isLoadingBoards" class="projects-list_empty">
      <p>Пространство пустое</p>
    </div>
    <div class="projects-list_add-project">
      <AddProjectModal />
    </div>
  </div>
</template>

<style scoped lang="scss">
.projects-wrapper {
  display: block;
  width: 50%;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  padding: 16px 0 10px 10px;
  margin-left: 50px;
  border-radius: 10px;
  background-color: #fff;
  box-sizing: border-box;

  .projects-wrapper__title {
    display: flex;
    font-family: 'Roboto', sans-serif;
    font-size: 1.375rem;
    margin-left: 15px;
  }

  .projects-list {
    display: flex;
    flex-direction: column;
    padding: 8px 10px 10px 20px;

    a {
      text-decoration: none;
      color: #111012;
    }

    .project-item__link {
      display: flex;
      align-items: center;
      font-family: 'Roboto', sans-serif;
      font-weight: 400;
      font-size: 1rem;
      line-height: 2rem;
      margin-left: 10px;
      padding: 10px 14px;
      cursor: pointer;

      &:hover {
        box-shadow: 0px 5px 16px 2px rgba(53, 77, 96, 0.15);
        border-radius: 6px;
      }

      .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
      }

      a {
        display: block;
        justify-self: self-start;
        color: #111012;
      }
    }

    .separator {
      height: 1px;
      background-color: #ccc;
      margin: 0 26px;
      box-sizing: border-box;
    }
  }

  .projects-list_add-project {
    display: flex;
    justify-content: center;
    height: 40px;
    padding: 0 20px 0 20px;
    cursor: pointer;

    .add-project__button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      height: auto;
      background-color: rgba(17, 16, 18, 0.05);
      padding: 10px;
      border-radius: 6px;
      border: none;
      transition: ease-in;
      transition-duration: 0.2s;

      &:hover {
        background-color: rgba(17, 16, 18, 0.1);
      }

      .btn-text {
        font-size: 14px;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        color: #111012bf;
      }
    }
  }
}
</style>
