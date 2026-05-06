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
import Loader from '@/components/ui/loader/Loader.vue';
import { Trash2 } from 'lucide-vue-next';

import { useBoardData } from '@/features/board/composables/useBoard';
import { computed, defineAsyncComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUsersStore } from '@/stores/users.store';
import { storeToRefs } from 'pinia';
import { useTaskModal } from '@/features/board/composables/useTaskModal';
import { useBoardTasks } from '@/features/board/composables/useBoardTasks';
import { useTableFilters } from './useTableFilters';
import TableFilters from './TableFilters.vue';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const deletingTaskId = ref<string | null>(null);
const isDeleteDialogOpen = ref(false);

const openDeleteDialog = (id: string) => {
  deletingTaskId.value = id;
  isDeleteDialogOpen.value = true;
};

const confirmDelete = () => {
  if (!deletingTaskId.value) return;

  deleteTask(deletingTaskId.value);

  isDeleteDialogOpen.value = false;
  deletingTaskId.value = null;
};

const TaskFormModal = defineAsyncComponent(
  () => import('@/features/task/components/TaskModal/TaskModal.vue')
);

const route = useRoute();
const boardId = route.params.projectId as string;
const workspaceId = route.params.workspaceId as string;

const showCompletedTasks = ref<boolean>(false);

const { project, tasksData, isLoadingBoard, isLoadingTasks, isError } = useBoardData(
  workspaceId,
  boardId
);
const { create, update, deleteTask, isPending } = useBoardTasks(boardId);

const { showModal, currentColumnId, editingTask, openCreate, openEdit, close } = useTaskModal();

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);

const tasksByColumn = computed(() => tasksData.value?.tasksByColumn ?? {});

const { searchQueryRaw, selectedTags, availableTags, toggleTag, applyFilters } =
  useTableFilters(tasksByColumn);

const tasksByColumnTitle = computed(() => {
  if (!project.value?.columns || !tasksData.value?.tasksByColumn) return [];

  return project.value.columns.map((column) => {
    let tasks = tasksByColumn.value[column._id] ?? [];

    if (!showCompletedTasks.value) {
      tasks = tasks.filter((task) => task.completedAt === null);
    }

    return { id: column._id, title: column.title, tasks };
  });
});

const filteredColumns = computed(() => {
  return applyFilters(tasksByColumnTitle.value);
});

const usersMap = computed(() => {
  const map: Record<string, string> = {};

  users.value.forEach((u) => {
    map[u.userId] = u.profile.displayName;
  });

  return map;
});
</script>

<template>
  <div class="table-wrapper">
    <div v-if="isLoadingBoard || isLoadingTasks" class="board-loader">
      <Loader color="#4A5568" />
    </div>

    <div v-else-if="isError">Error loading board</div>

    <div class="table-container">
      <div class="w-full">
        <input v-model="showCompletedTasks" type="checkbox" name="showCompleted" id="" />
        <label for="showCompleted">Показать выполненные задачи</label>
      </div>

      <TableFilters
        :search-query="searchQueryRaw"
        :selected-tags="selectedTags"
        :available-tags="availableTags"
        @update:search-query="searchQueryRaw = $event"
        @toggle-tag="toggleTag"
      />

      <Table v-if="project" class="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead class="w-[40%]">Название</TableHead>
            <TableHead class="w-30">Приоритет</TableHead>
            <TableHead class="w-[60%]">Описание</TableHead>
            <TableHead class="w-25">Статус</TableHead>
            <TableHead class="w-75">Теги</TableHead>
            <TableHead class="w-40">Исполнители</TableHead>
            <TableHead class="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-for="column in filteredColumns" :key="column.id">
            <TableRow>
              <TableCell colspan="7" class="font-bold bg-muted">
                {{ column.title }} ({{ column.tasks.length }} задач)
              </TableCell>
            </TableRow>
            <TableRow
              v-for="task in column.tasks"
              :key="task.id"
              @click="openEdit(task)"
              class="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <TableCell class="p-1 font-medium whitespace-normal wrap-break-word">
                {{ task.title }}
              </TableCell>
              <TableCell class="font-medium">{{ task.priority }}</TableCell>
              <TableCell class="p-1 max-h-20 whitespace-normal wrap-break-word">{{
                task.description
              }}</TableCell>
              <TableCell>
                <p :class="{ 'text-green-500': task.completedAt !== null }">
                  {{ task.completedAt === null ? task.status : 'Выполнено' }}
                </p>
              </TableCell>
              <TableCell class="flex-wrap">
                <Badge v-for="b in task.tags" :key="b.title" :color="b.color" class="mr-1">{{
                  b.title
                }}</Badge>
              </TableCell>

              <TableCell>
                <div v-for="id in task.assignees" class="flex gap-3">
                  {{ usersMap[id] }}
                </div>
              </TableCell>

              <TableCell @click.stop="openDeleteDialog(task.id)">
                <Trash2 />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                colspan="7"
                class="bg-muted text-center cursor-pointer text-muted-foreground hover:text-foreground"
                @click="openCreate(column.id)"
              >
                {{ isPending ? 'Создается...' : '+ Добавить задачу' }}
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <Teleport to="body">
      <TaskFormModal
        :is-visible="showModal"
        :column-id="currentColumnId"
        :task-data="editingTask"
        @create="(data) => create(data, close)"
        @update="({ id, data }) => update(id, data, close)"
        @close="showModal = false"
      />
    </Teleport>
  </div>

  <AlertDialog :open="isDeleteDialogOpen" @update:open="isDeleteDialogOpen = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Удалить задачу?</AlertDialogTitle>
        <AlertDialogDescription>
          Это действие нельзя отменить. Задача будет удалена навсегда.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>Отмена</AlertDialogCancel>
        <AlertDialogAction @click="confirmDelete" class="bg-red-600 hover:bg-red-700">
          Удалить
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style lang="scss" scoped>
.table-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-direction: column;
  height: calc(100% - 7.625rem);
  padding: 0.75rem;
  overflow: hidden;
  box-sizing: border-box;

  .table-container {
    flex: 1;
    width: 100%;
    overflow-y: auto;

    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 transparent;
  }

  .table-container::-webkit-scrollbar {
    width: 6px;
  }

  /* Webkit */

  .table-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .table-container::-webkit-scrollbar-thumb {
    background-color: #d1d5db; // мягкий серый
    border-radius: 999px;
  }

  .table-container::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
  }
}
</style>
