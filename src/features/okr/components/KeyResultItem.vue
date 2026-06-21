<script setup lang="ts">
import type { KeyResult } from '@/features/okr/types/okr.types';
import { KR_STATUS_LABELS, KR_STATUS_COLORS } from '@/features/okr/types/okr.types';
import { computed } from 'vue';
import { Edit, Trash2 } from 'lucide-vue-next';

interface Props {
  keyResult: KeyResult;
}

interface Emits {
  (e: 'edit', keyResult: KeyResult): void;
  (e: 'delete', krId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const statusLabel = computed(() => KR_STATUS_LABELS[props.keyResult.status]);
const statusColor = computed(() => KR_STATUS_COLORS[props.keyResult.status]);

const metricDisplay = computed(() => {
  const metric = props.keyResult.metric;
  if (!metric) return null;

  if (metric.type === 'number') {
    const unit = metric.unit || '';
    return `${metric.start} → ${metric.current} / ${metric.target} ${unit}`.trim();
  }

  if (metric.type === 'boolean') {
    return metric.current ? 'Выполнено' : 'Не выполнено';
  }

  return null;
});

const weightPercent = computed(() => Math.round(props.keyResult.weight * 100));
const metricProgressPercent = computed(() => Math.round(props.keyResult.metric_progress * 100));
</script>

<template>
  <div class="key-result-item" :style="{ borderLeftColor: statusColor }">
    <div class="kr-header">
      <h4 class="kr-title">{{ keyResult.title }}</h4>
      <div class="kr-header-actions">
        <span class="status-badge" :style="{ backgroundColor: statusColor }">
          {{ statusLabel }}
        </span>
        <div class="action-buttons">
          <button class="action-btn" @click="emit('edit', keyResult)" title="Редактировать">
            <Edit :size="16" />
          </button>
          <button class="action-btn delete" @click="emit('delete', keyResult._id)" title="Удалить">
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </div>

    <div class="kr-details">
      <div v-if="keyResult.metric" class="kr-metric">
        <span class="metric-label">Метрика:</span>
        <span class="metric-value">{{ metricDisplay }}</span>
        <div v-if="keyResult.metric.type === 'number'" class="metric-progress-bar">
          <div class="metric-progress-fill" :style="{ width: `${metricProgressPercent}%` }"></div>
        </div>
      </div>

      <div class="kr-meta">
        <span class="kr-weight">Вес: {{ weightPercent }}%</span>
        <span v-if="keyResult.projects.length > 0" class="kr-projects">
          Проекты:
          <span v-for="project in keyResult.projects" :key="project.id" class="project-chip">
            {{ project.title }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.key-result-item {
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-radius: 6px;
  border-left: 4px solid;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  .kr-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    .kr-title {
      margin: 0;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #111012;
      flex: 1;
    }

    .kr-header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: 12px;
    }

    .status-badge {
      padding: 3px 10px;
      border-radius: 10px;
      font-size: 0.6875rem;
      font-weight: 500;
      color: #fff;
      white-space: nowrap;
    }

    .action-buttons {
      display: flex;
      gap: 4px;

      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        background: transparent;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        color: #666;
        transition: all 0.2s ease;

        &:hover {
          background-color: #e0e0e0;
          color: #111012;
        }

        &.delete:hover {
          background-color: #ffebee;
          color: #f44336;
        }
      }
    }
  }

  .kr-details {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .kr-metric {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .metric-label {
        font-size: 0.75rem;
        color: #666;
        font-weight: 500;
      }

      .metric-value {
        font-size: 0.8125rem;
        color: #111012;
      }

      .metric-progress-bar {
        width: 100%;
        height: 6px;
        background-color: #e0e0e0;
        border-radius: 3px;
        overflow: hidden;
        margin-top: 4px;

        .metric-progress-fill {
          height: 100%;
          background-color: #4caf50;
          transition: width 0.3s ease;
        }
      }
    }

    .kr-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 0.75rem;
      color: #666;

      .kr-weight {
        font-weight: 500;
      }

      .kr-projects {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;

        .project-chip {
          padding: 2px 8px;
          background-color: #e3f2fd;
          color: #1976d2;
          border-radius: 8px;
          font-size: 0.6875rem;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
