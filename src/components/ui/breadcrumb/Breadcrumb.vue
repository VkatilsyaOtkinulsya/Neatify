<script setup lang="ts">
import { useProjectDetails } from '@/api/queries/useProject';
import type { Workspace } from '@/features/workspace/types/workspace.types';
import { computed, inject, type Ref } from 'vue';
import { useRoute } from 'vue-router';

interface BreadCrumbItem {
  name: string;
  title: string;
  path?: string;
  disabled?: boolean;
}

const route = useRoute();

const workspaceId = computed(() => route.params.workspaceId as string);
const projectId = computed(() => route.params.projectId as string);

// Передаём Ref, чтобы хук реактивно перезапрашивал при смене параметров
const { data: project } = useProjectDetails(workspaceId, projectId);

const workspace = inject<Ref<Workspace | undefined>>('workspace');

// Страницы навигации проекта, которые не нужно дублировать в крошках
const projectNavPages = ['review', 'board', 'table'];

const breadcrumbs = computed(() => {
  const crumbs: BreadCrumbItem[] = [];

  if (route.params.workspaceId && workspace?.value) {
    crumbs.push({
      name: 'workspace',
      title: workspace.value.title || 'Workspace',
      path: `/spaces/${route.params.workspaceId}/projects`,
    });
  }

  if (route.params.projectId && project.value) {
    crumbs.push({
      name: 'project',
      title: project.value.title || 'Project',
      path: `/spaces/${route.params.workspaceId}/${route.params.projectId}`,
    });
  }

  // Добавляем крошку только если это не навигационная страница проекта
  if (route.meta?.crumb && !projectNavPages.includes(route.name as string)) {
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
          class="breadcrumb-link"
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
.breadcrumbs {
  display: flex;
}

.breadcrumbs__list {
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  gap: 0.25rem;
}

.breadcrumbs__item {
  display: flex;
  align-items: center;
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
  color: inherit;
  text-decoration: none;
  padding: 0.25rem 0;
  border-radius: 4px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.breadcrumb-link:hover {
  text-decoration: none;
  background-color: transparent;
  color: #007bff;
}

.breadcrumb-link:hover {
  text-decoration: none;
  background-color: #fff;
}

.breadcrumb-link:active {
  opacity: 0.8;
}
PS > npm run build .breadcrumb-current {
  color: #636d75;
  padding: 0.25rem 0;
  font-weight: 500;
  border-radius: 4px;
  border: 1px solid transparent;
}

.breadcrumb-current--disabled {
  color: #636d75;
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
    color: inherit;
  }

  .breadcrumb-current {
    color: #6d7277;
  }

  .breadcrumb-current--disabled {
    color: #6d7277;
  }

  .breadcrumb-separator {
    color: #adb5bd;
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .breadcrumbs__list {
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
