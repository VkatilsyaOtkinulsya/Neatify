<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { useBoardDragStore } from '../../boardDrag.store';
import TaskCard from '@/features/task/components/TaskCard.vue';
import type { Task, TaskCardData } from '@/features/task/types/task.types';
import type { BoardColumn } from '../../types/board.types';
import Input from '@/components/ui/input/Input.vue';
import ColumnActionsMenu from './ColumnActionsMenu.vue';
import { useColumnTitleEdit } from '../../composables/useColumnTitleEdit';
import { PERMISSIONS_KEY } from '@/shared/permissions/permissionsKey';
import PermissionGuard from '@/shared/permissions/PermissionGuard.vue';
import ColumnSettingsDialog from './ColumnSettingsDialog.vue';

type UpdateColumnPayload = {
  columnId: string;
  data: Partial<BoardColumn>;
};

const props = defineProps<{
  column: BoardColumn;
  color: string;
  tasks: Task[];
}>();

const emits = defineEmits<{
  'task-drop': [
    payload: {
      taskId: string;
      fromColumnId: string;
      toColumnId: string;
      beforeTaskId?: string;
      afterTaskId?: string;
    },
  ];
  'update-column': [payload: UpdateColumnPayload];
  'delete-column': [];
  'move-column-left': [columnId: string];
  'move-column-right': [columnId: string];
  'edit-task': [taskData: Task];
}>();

const dragStore = useBoardDragStore();
const inputRef = ref<HTMLInputElement | null>(null);
const hoverIndex = ref<number | null>(null);
const isColumnSettingsDialogOpen = ref(false);

const {
  isEditingColumnTitle,
  editedColumnTitle,
  startEditColumnTitle,
  finishEditColumnTitle,
  cancelEdit,
  handleEnter,
} = useColumnTitleEdit(
  () => props.column,
  inputRef,
  (payload) => emits('update-column', payload)
);

const orderedTasks = computed(() => {
  const tasks = props.tasks;
  if (!tasks.length) return tasks;

  return props.tasks.sort((a, b) => a.position - b.position);
});

const isEmpty = computed(() => orderedTasks.value.length === 0);

const getTaskNeighbors = (index: number) => {
  const tasks = orderedTasks.value;

  return {
    afterTaskId: tasks[index - 1]?.id,
    beforeTaskId: tasks[index]?.id,
  };
};

const handleDragOverZone = (event: DragEvent, index: number) => {
  if (!dragStore.isTaskDragging) return;
  event.preventDefault();
  hoverIndex.value = index;
};

const handleDragLeaveZone = () => {
  hoverIndex.value = null;
};

const handleDrop = (index: number) => {
  const drag = dragStore.dragState;
  if (!drag || drag.type !== 'task') return;

  const { beforeTaskId, afterTaskId } = getTaskNeighbors(index);
  emits('task-drop', {
    taskId: drag.taskId,
    fromColumnId: drag.fromColumnId,
    toColumnId: props.column._id,
    beforeTaskId,
    afterTaskId,
  });

  hoverIndex.value = null;
  dragStore.clear();
};

// ---------- column move ----------

const handleMoveLeft = () => {
  emits('move-column-left', props.column._id);
};

const handleMoveRight = () => {
  emits('move-column-right', props.column._id);
};

const taskCardData = (task: Task): TaskCardData => ({
  ...task,
  checklist: task.checklist.length
    ? {
        total: task.checklist.length,
        completed: task.checklist.filter((t) => t.isCompleted).length,
      }
    : null,
  attachment: task.attachments.length,
});

const columnSettings = ref({
  taskLimit: props.column.taskLimit,
  color: props.column.color,
});

const saveColumnSettings = () => {
  if (columnSettings.value.taskLimit === 0) columnSettings.value.taskLimit = null;

  isColumnSettingsDialogOpen.value = false;
};

const permissionsCtx = inject(PERMISSIONS_KEY)!;

const canUpdateColumn = computed(() => permissionsCtx.can('update_column'));
const canDeleteColumn = computed(() => permissionsCtx.can('delete_task'));
</script>

<template>
  <div class="column-container">
    <div class="column" :style="{ backgroundColor: color }">
      <div class="flex justify-between h-10 px-2 pt-2">
        <p
          v-if="!isEditingColumnTitle"
          @mousedown.stop
          @click.stop="startEditColumnTitle"
          class="pl-3 pt-1.5 text-sm cursor-text"
        >
          {{ editedColumnTitle }}
          <span class="opacity-0 group-hover:opacity-100 transition"> ✏️ </span>
        </p>
        <Input
          v-else
          ref="inputRef"
          v-model="editedColumnTitle"
          :placeholder="editedColumnTitle"
          @blur="finishEditColumnTitle"
          @keydown.enter.prevent="handleEnter"
          @keydown.esc="cancelEdit"
        />
        <PermissionGuard :require="'update_column'">
          <div class="rounded-2xl hover:bg-amber-500">
            <span aria-label="Изменить карточку">
              <ColumnActionsMenu
                :canUpdate="canUpdateColumn"
                :canDelete="canDeleteColumn"
                @delete="emits('delete-column')"
                @update="emits('update-column', $event)"
                @open-settings="isColumnSettingsDialogOpen = true"
                @move-left="handleMoveLeft"
                @move-right="handleMoveRight"
              />
            </span>
          </div>
        </PermissionGuard>
      </div>
      <div class="column-content">
        <div class="tasks-list" ref="listRef">
          <div
            class="drop-zone"
            :class="{ active: hoverIndex === 0, 'is-empty': isEmpty }"
            @dragover="(e: DragEvent) => handleDragOverZone(e, 0)"
            @dragleave="handleDragLeaveZone"
            @drop="() => handleDrop(0)"
          />

          <template v-for="(task, index) in orderedTasks" :key="task.id + task.dueDate">
            <TaskCard
              data-task-item
              :task="taskCardData(task)"
              @drag-start="dragStore.startTaskDrag(task.id, props.column._id)"
              @drag-end="dragStore.clear"
              @click="emits('edit-task', task)"
              @edit-task="emits('edit-task', task)"
            >
              <template #editable_title>
                {{ task.title }}
              </template>
            </TaskCard>

            <div
              class="drop-zone"
              :class="{ active: hoverIndex === index + 1 }"
              @dragover="(e) => handleDragOverZone(e, index + 1)"
              @dragleave="handleDragLeaveZone"
              @drop="() => handleDrop(index + 1)"
            />
          </template>
        </div>
      </div>
      <div class="add-task">
        <slot name="add-task-button"></slot>
      </div>
    </div>
  </div>

  <ColumnSettingsDialog
    v-model:isOpen="isColumnSettingsDialogOpen"
    v-model="columnSettings"
    @save="saveColumnSettings"
  />
</template>

<style lang="scss" scoped>
.column-container {
  min-height: 100%;
  padding: 0 6px;
}

.column {
  display: flex;
  flex-direction: column;
  min-width: 17rem;
  height: 100%;
  max-height: 100%;
  flex-shrink: 0;
  border: 1px solid #333333;
  border-radius: 0.75rem;
  box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  .column-content {
    flex: 1 1 auto;
    padding: 0.25rem 0.25rem 0;

    .tasks-list {
      display: flex;
      flex-direction: column;
      padding: 0 0.25rem;
      overflow-y: auto;
    }

    .drop-zone {
      height: 8px;
      transition:
        height 0.3s ease,
        background-color 0.15s ease;
      pointer-events: auto;
    }

    .drop-zone.active {
      height: 40px;
      background-color: rgba(59, 130, 246, 0.15);
      border-radius: 4px;
    }

    .drop-zone.is-empty {
      flex-grow: 1;
      min-height: 5rem;
    }
  }

  .add-task {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px 10px;
  }
}
</style>
