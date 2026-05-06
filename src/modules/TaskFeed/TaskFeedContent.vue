<script setup lang="ts">
import { useUserAssignedTasks } from '@/api/queries/useTasks';
import { useRouter } from 'vue-router';
import { PRIORITY_REVERSE_MAP } from '@/features/task/variables/priority';
import { STATUS_REVERSE_MAP } from '@/features/task/variables/status';
import { TaskPriority } from '@/features/task/variables/priority.enum';
import Badge from '@/components/ui/badge/Badge.vue';

const router = useRouter();
const { data: tasks, isLoading } = useUserAssignedTasks();

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

  if (d.toDateString() === today.toDateString()) return 'Сегодня';
  if (d.toDateString() === tomorrow.toDateString()) return 'Завтра';

  return d.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
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
    <div v-if="isLoading" class="task-feed__loader">
      <Loader />
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
          <div class="task-feed__item-badges">
            <Badge
              :color="getPriorityColor(task.priority)"
              class="task-feed__badge"
            >
              {{ PRIORITY_REVERSE_MAP[task.priority] }}
            </Badge>
            <Badge color="#2196F3" class="task-feed__badge">
              {{ STATUS_REVERSE_MAP[task.status] }}
            </Badge>
          </div>

          <div v-if="task.dueDate" class="task-feed__item-date">
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
    padding: 0 20px;
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
