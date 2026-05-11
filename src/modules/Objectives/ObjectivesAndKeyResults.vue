<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useObjectives, useCreateObjective } from '@/api/queries/useObjectives';
import Loader from '@/components/ui/loader/Loader.vue';
import EditableTitle from '@/components/ui/title/EditableTitle.vue';
import ObjectiveModalForm from '@/features/okr/components/ObjectiveModalForm.vue';
import type { CreateObjectiveDto } from '@/features/okr/types/okr.types';

const route = useRoute();
const workspaceId = computed(() => route.params.workspaceId as string);

const { data, isLoading } = useObjectives(workspaceId);
const { mutate: createObjective, isPending: isCreatePending } = useCreateObjective(workspaceId);

const objectives = computed(() => data.value?.objectives || []);

const showDialog = ref(false);

const handleCreateObjective = (dto: CreateObjectiveDto) => {
  createObjective(dto, {
    onSuccess: () => {
      showDialog.value = false;
    },
  });
};
</script>

<template>
  <div class="objectives-wrapper">
    <div class="objectives-header">
      <div class="objectives-wrapper__title">
        <EditableTitle />
      </div>
      <ObjectiveModalForm
        v-model:open="showDialog"
        :is-pending="isCreatePending"
        @submit="handleCreateObjective"
      />
    </div>
    <Loader v-if="isLoading" color="#000" />
    <div v-else-if="objectives.length > 0" class="objectives-list">
      <div v-for="objective in objectives" :key="objective._id" class="objective-card">
        <h3>{{ objective.title }}</h3>
        <p v-if="objective.description" class="objective-description">{{ objective.description }}</p>
        <div class="objective-meta">
          <span class="status-badge" :class="`status-${objective.status}`">
            {{ objective.status === 'active' ? 'Активная' : objective.status === 'completed' ? 'Завершена' : 'Архивная' }}
          </span>
          <span class="period">
            {{ new Date(objective.period.start).toLocaleDateString('ru-RU') }} -
            {{ new Date(objective.period.end).toLocaleDateString('ru-RU') }}
          </span>
        </div>
        <div class="progress-section">
          <span class="progress-label">Прогресс: {{ Math.round(objective.progress * 100) }}%</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${objective.progress * 100}%` }"></div>
          </div>
        </div>
        <div v-if="objective.key_results.length > 0" class="key-results-count">
          {{ objective.key_results.length }} ключевых результатов
        </div>
      </div>
    </div>
    <div v-else class="objectives-list_empty">
      <p>Нет целей</p>
      <p class="empty-hint">Создайте первую цель для workspace</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.objectives-wrapper {
  display: block;
  width: 80%;
  max-width: 1200px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-left: 50px;
  border-radius: 10px;
  background-color: #fff;
  box-sizing: border-box;

  .objectives-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .objectives-wrapper__title {
    display: flex;
    font-family: 'Roboto', sans-serif;
    font-size: 1.375rem;
  }

  .objectives-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .objective-card {
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #fafafa;
      transition: box-shadow 0.2s ease;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      h3 {
        margin: 0 0 8px 0;
        font-size: 1.125rem;
        font-weight: 500;
        color: #111012;
      }

      .objective-description {
        margin: 0 0 12px 0;
        font-size: 0.875rem;
        color: #666;
        line-height: 1.5;
      }

      .objective-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        font-size: 0.875rem;

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 500;
          font-size: 0.75rem;

          &.status-active {
            background-color: #e3f2fd;
            color: #1976d2;
          }

          &.status-completed {
            background-color: #e8f5e9;
            color: #388e3c;
          }

          &.status-archived {
            background-color: #f5f5f5;
            color: #757575;
          }
        }

        .period {
          color: #666;
        }
      }

      .progress-section {
        margin-bottom: 12px;

        .progress-label {
          display: block;
          font-size: 0.875rem;
          color: #666;
          margin-bottom: 8px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background-color: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;

          .progress-fill {
            height: 100%;
            background-color: #4caf50;
            transition: width 0.3s ease;
          }
        }
      }

      .key-results-count {
        font-size: 0.875rem;
        color: #666;
        margin-top: 8px;
      }
    }
  }

  .objectives-list_empty {
    text-align: center;
    padding: 60px 20px;

    p {
      margin: 0;
      font-size: 1rem;
      color: #999;

      &.empty-hint {
        margin-top: 8px;
        font-size: 0.875rem;
        color: #bbb;
      }
    }
  }
}
</style>
