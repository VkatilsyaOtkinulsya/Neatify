<script setup lang="ts">
import { useBoardDetail } from '@/api/queries/useBoard';
import type { Workspace } from '@/features/workspace/types/workspace.types';
import { computed, inject, type Ref } from 'vue';
import { useRoute } from 'vue-router';

interface BreadCrumbItem {
  name: string;
  title: string;
  path?: string;
  disabled?: boolean;
  query?: any;
}

const route = useRoute();

const workspaceId = computed(() => route.params.workspaceId as string);
const projectId = computed(() => route.params.projectId as string);

const { data: project } = useBoardDetail(workspaceId.value, projectId.value);

const workspace = inject<Ref<Workspace | undefined>>('workspace');



const breadcrumbs = computed(() => {
  const crumbs: BreadCrumbItem[] = [];


  if (route.params.workspaceId  && workspace?.value) {
    crumbs.push({
      name: 'workspace',
      title: (workspace.value.title as string) || 'Workspace',
      path: `/spaces/${route.params.workspaceId}/projects`,
      disabled: false,
    });
  }

  if (route.params.projectId  && project.value) {
      
      crumbs.push({
        name: 'project',
        title: (route.query.title as string) || 'Workspace',
        path: `/spaces/${route.params.workspaceId}/${route.params.projectId}/tasks`,
        disabled: false,
      });
  
  };

  if (route.meta?.crumb) {
    crumbs.push({
      name: route.meta.crumb as string,
      title: (route.meta.title as string) || (route.meta.crumb as string),
      disabled: true,
    });
  }
  return crumbs;
});
</script>

<template>
  <nav aria-label="Breadcrumb" class="breadcrumbs">
    <ol class="breadcrumbs__list">
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        class="breadcrumbs__item"
        :class="{
          'breadcrumb-item--disabled': crumb.disabled,
          'breadcrumb-item--active': index === breadcrumbs.length - 1,
        }"
      >
        <router-link
          v-if="crumb.path && index < breadcrumbs.length - 1 && !crumb.disabled"
          :to="crumb.path"
          class="breadcrumb-link""
        >
          {{ crumb.title }}
        </router-link>

        <span
          v-else
          class="breadcrumb-current"
          :class="{ 'breadcrumb-current--disabled': crumb.disabled }"
        >
          {{ crumb.title }}
        </span>

        <span
          v-if="index < breadcrumbs.length - 1"
          class="breadcrumb-separator"
          :class="{ 'breadcrumb-separator--disabled': crumb.disabled }"
        >
          >
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  margin-bottom: 1rem;
}

.breadcrumbs__list {
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  gap: 0.25rem;
}

.breadcrumb-item {
  display: flex;
  justify-items: center;
  transition: all 0.2s ease;
}

.breadcrumb-item--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.breadcrumb-item--active {
  font-weight: 600;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
  padding: 0.25rem 0;
  border-radius: 4px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.breadcrumb-link:hover {
  background-color: #f8f9fa;
  text-decoration: underline;
  border-color: #e9ecef;
}

.breadcrumb-link:active {
  background-color: #e9ecef;
  transform: translateY(1px);
}

.breadcrumb-current {
  color: #6c757d;
  padding: 0.25rem 0;
  font-weight: 500;
  border-radius: 4px;
  border: 1px solid transparent;
}

.breadcrumb-current--disabled {
  color: #495057;
  background-color: #f8f9fa;
  border-color: #e9ecef;
  cursor: not-allowed;
  opacity: 0.7;
}

.breadcrumb-separator {
  color: #6c757d;
  margin: 0 0.25rem;
  opacity: 0.6;
}

.breadcrumb-separator--disabled {
  opacity: 0.4;
}

/* Темная тема */
@media (prefers-color-scheme: dark) {
  .breadcrumb-link {
    color: #4dabf7;
  }

  .breadcrumb-link:hover {
    background-color: #343a40;
    border-color: #495057;
  }

  .breadcrumb-current {
    color: #adb5bd;
  }

  .breadcrumb-current--disabled {
    color: #ced4da;
    background-color: #495057;
    border-color: #6c757d;
  }

  .breadcrumb-separator {
    color: #adb5bd;
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .breadcrumb-list {
    font-size: 0.875rem;
  }

  .breadcrumb-link,
  .breadcrumb-current {
    padding: 0.125rem 0;
  }

  .breadcrumb-separator {
    margin: 0 0.25rem;
  }
}
</style>
