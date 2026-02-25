<script setup lang="ts">
import Badge from '@/components/ui/badge/Badge.vue';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useBoard } from '@/features/board/composables/useBoard';
import type { Task } from '@/features/task/types/task.types';
import { computed, defineAsyncComponent, ref } from 'vue';
import { useRoute } from 'vue-router';

const TaskFormModal = defineAsyncComponent(
  () => import('@/features/task/components/TaskModal/TaskFormModal.vue')
);

const route = useRoute();
const boardId = route.params.projectId as string;
const workspaceId = route.params.workspaceId as string;

const showModal = ref(false);
const currentColumnId = ref<string>('');

const { project, tasksData, isLoadingBoard, isLoadingTasks, isError, moveTask, moveColumn } =
  useBoard(workspaceId, boardId);

const openTaskModal = (columnId: string) => {
  currentColumnId.value = columnId;
  showModal.value = true;
};

const tasksByColumn = computed(() => tasksData.value?.tasksByColumn ?? {});
const tasksByColumnTitle = computed(() => {
  if (!project.value?.columns || !tasksData.value?.tasksByColumn) return {};

  const result: Record<string, Task[]> = {};

  project.value.columns.forEach((column) => {
    const colId = column._id;
    const colTasks = tasksByColumn.value[colId] || [];
    result[column.title] = colTasks;
  });

  return result;
});
</script>

<template>
  <Table v-if="project">
    <TableHeader>
      <TableRow>
        <TableHead class="w-25"> Название </TableHead>
        <TableHead class="w-5"> Статус </TableHead>
        <TableHead>Описание</TableHead>
        <TableHead>Приоритет</TableHead>
        <TableHead class=""> Теги </TableHead>
        <TableHead class=""> Исполнители </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-for="(tasks, colName) in tasksByColumnTitle" :key="`col-${colName}`">
        <TableRow>
          <TableCell colspan="6" class="font-bold bg-muted">
            {{ colName }} ({{ tasks.length }} задач)
          </TableCell>
        </TableRow>

        <TableRow v-for="task in tasks" :key="task.id" @click="openTaskModal">
          <TableCell class="font-medium">
            {{ task.title }}
          </TableCell>
          <TableCell>
            {{ task.status }}
          </TableCell>
          <TableCell class="overflow-hidden">{{ task.description }}</TableCell>
          <TableCell class="font-medium">{{ task.priority }}</TableCell>
          <TableCell class="flex flex-wrap gap-1">
            <Badge v-for="b in task.tags" :key="b.title" :color="b.color">{{ b.title }}</Badge>
          </TableCell>
          <TableCell>
            {{ task.assignees.length != 0 ? task.assignees : '' }}
          </TableCell>
        </TableRow>
      </template>
    </TableBody>
  </Table>

  <Teleport to="body">
    <TaskFormModal
      :is-visible="showModal"
      :column-id="currentColumnId"
      @close="showModal = false"
    />
  </Teleport>
</template>
