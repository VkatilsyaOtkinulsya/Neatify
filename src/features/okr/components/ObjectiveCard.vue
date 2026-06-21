<script setup lang="ts">
import type { Objective } from '@/features/okr/types/okr.types';
import KeyResultsList from './KeyResultsList.vue';
import { ChevronDown } from 'lucide-vue-next';

interface Props {
  objective: Objective;
  isExpanded?: boolean;
  workspaceId: string;
}

interface Emits {
  (e: 'toggle', objectiveId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleToggle = () => {
  emit('toggle', props.objective._id);
};
</script>

<template>
  <div class="objective-card">
    <div class="objective-header" @click="handleToggle">
      <div class="objective-content">
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
      <div class="chevron-icon" :class="{ expanded: isExpanded }">
        <ChevronDown :size="20" />
      </div>
    </div>

    <transition name="expand">
      <div v-if="isExpanded" class="key-results-section">
        <KeyResultsList
          :objective-id="objective._id"
          :key-results="objective.key_results"
          :workspace-id="workspaceId"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.objective-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .objective-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 20px;
    cursor: pointer;
    user-select: none;

    .objective-content {
      flex: 1;

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

    .chevron-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 12px;
      color: #666;
      transition: transform 0.2s ease;

      &.expanded {
        transform: rotate(180deg);
      }
    }
  }

  .key-results-section {
    padding: 0 20px 20px 20px;
    border-top: 1px solid #e0e0e0;
    padding-top: 16px;
  }
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}
</style>
