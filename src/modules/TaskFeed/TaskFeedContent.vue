<script setup lang="ts">
import { useUserAssignedTasks } from '@/api/queries/useTasks';
import { useRouter } from 'vue-router';
import { PRIORITY_REVERSE_MAP } from '@/features/task/variables/priority';
import { STATUS_REVERSE_MAP } from '@/features/task/variables/status';
import { TaskPriority } from '@/features/task/variables/priority.enum';
import Loader from '@/components/ui/loader/Loader.vue';
import { ChevronDown, ChevronUp, ChevronsUp } from 'lucide-vue-next';

const router = useRouter();
const { data: tasks, isLoading } = useUserAssignedTasks();

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case TaskPriority.LOW:
      return ChevronDown;
    case TaskPriority.MEDIUM:
      return ChevronUp;
    case TaskPriority.HIGH:
    case TaskPriority.URGENT:
      return ChevronsUp;
    default:
      return null;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case TaskPriority.LOW:
      return '#4CAF50';
    case TaskPriority.MEDIUM:
      return '#FFC107';
    case TaskPriority.HIGH:
      return '#FF9800';
    case TaskPriority.URGENT:
      return '#F44336';
    default:
      return '#999';
  }
};

const formatDate = (date: Date | string | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const timeStr = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  if (d.toDateString() === today.toDateString()) return `Сегодня в ${timeStr}`;
  if (d.toDateString() === tomorrow.toDateString()) return `Завтра в ${timeStr}`;

  const dateStr = d.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
  return `${dateStr} в ${timeStr}`;
};

const isOverdueTask = (task: any) => {
  if (!task.dueDate) return false;
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
};

const navigateToTask = (task: any) => {
  router.push({
    name: 'board',
    params: {
      workspaceId: task.workspaceId,
      projectId: task.boardId,
    },
    query: { taskId: task.id },
  });
};
</script>

<template>
  <div class="task-feed">
    <div class="task-feed__header">
      <h2 class="task-feed__title">Мои задачи</h2>
    </div>

    <div v-if="isLoading" class="task-feed__loader">
      <Loader color="#000" />
    </div>

    <div v-else-if="!tasks || tasks.length === 0" class="task-feed__empty">
      <p>Нет назначенных задач</p>
    </div>

    <div v-else class="task-feed__list">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-feed__item"
        :class="{ 'task-feed__item--overdue': isOverdueTask(task) }"
        @click="navigateToTask(task)"
      >
        <div class="task-feed__item-header">
          <h3 class="task-feed__item-title">{{ task.title }}</h3>
          <span class="task-feed__item-project">{{ task.boardTitle || 'Проект' }}</span>
        </div>

        <div class="task-feed__item-meta">
          <div class="task-feed__item-info">
            <div class="task-feed__item-priority">
              <component
                :is="getPriorityIcon(task.priority)"
                class="task-feed__priority-icon"
                :style="{ color: getPriorityColor(task.priority) }"
              />
              <span
                class="task-feed__priority-text"
                :style="{ color: getPriorityColor(task.priority) }"
              >
                {{ PRIORITY_REVERSE_MAP[task.priority] }}
              </span>
            </div>
            <div class="task-feed__item-status">
              {{ STATUS_REVERSE_MAP[task.status] }}
            </div>
          </div>

          <div v-if="task.dueDate" class="task-feed__item-date">
            <span class="task-feed__date-label">Дедлайн:</span>
            {{ formatDate(task.dueDate) }}
          </div>
        </div>

        <div v-if="task.tags && task.tags.length > 0" class="task-feed__item-tags">
          <span
            v-for="tag in task.tags"
            :key="tag.title"
            class="task-feed__tag"
            :style="{ backgroundColor: tag.color }"
          >
            {{ tag.title }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.task-feed {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  align-self: flex-start;

  &__header {
    padding: 20px 20px 16px;
    border-bottom: 1px solid #e0e0e0;
  }

  &__title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }

  &__loader {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
  }

  &__empty {
    text-align: center;
    padding: 40px 20px;
    color: #999;
    font-size: 16px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    overflow-y: auto;
    flex: 1;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f5f5f5;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #d0d0d0;
      border-radius: 4px;

      &:hover {
        background: #b0b0b0;
      }
    }
  }

  &__item {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-color: #d0d0d0;
    }

    &--overdue {
      border-left: 4px solid #f44336;
    }
  }

  &__item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__item-title {
    margin: 0;
    font-size: 15px;
    font-weight: 500;
    color: #333;
    flex: 1;
    word-break: break-word;
  }

  &__item-project {
    font-size: 12px;
    color: #999;
    white-space: nowrap;
    padding: 4px 8px;
    background: #f5f5f5;
    border-radius: 4px;
  }

  &__item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  &__item-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__item-priority {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__priority-icon {
    width: 16px;
    height: 16px;
  }

  &__priority-text {
    font-size: 13px;
    font-weight: 500;
  }

  &__item-status {
    font-size: 13px;
    color: #666;
    padding: 4px 10px;
    background: #f0f0f0;
    border-radius: 4px;
  }

  &__item-badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__badge {
    font-size: 12px;
    padding: 4px 8px;
  }

  &__item-date {
    font-size: 12px;
    color: #666;
    white-space: nowrap;
  }

  &__date-label {
    font-weight: 500;
    color: #333;
  }

  &__item-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__tag {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 4px;
    color: white;
    white-space: nowrap;
  }
}
</style>
