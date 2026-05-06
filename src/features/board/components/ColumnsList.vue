<script setup lang="ts">
import { computed, ref } from 'vue';
import type { BoardColumn as ColumnType } from '../types/board.types';
import { useBoardDragStore } from '../boardDrag.store';
import { useBoardScroll } from '../composables/useBoardScroll';
import { PERMISSIONS_KEY } from '@/shared/permissions/permissionsKey';
import { inject } from 'vue';
import { useManageColumn } from '../composables/useManageColumn';
import { useMoveColumn } from '@/api/queries/useBoard';

const props = defineProps<{
  columns: ColumnType[];
  boardId: string;
}>();

const dragStore = useBoardDragStore();

const { handleMouseMove, handleMouseUp, handleMouseDown } = useBoardScroll();

const orderedColumns = computed(() => [...props.columns].sort((a, b) => a.position - b.position));

const { mutate: moveColumnMutation } = useMoveColumn(props.boardId);
const { handleMoveColumnLeft, handleMoveColumnRight } = useManageColumn(() => props.columns);

const permissionsCtx = inject(PERMISSIONS_KEY)!;
const canAddColumn = computed(() => permissionsCtx.can('update_task'));
</script>

<template>
  <div
    class="columns-container"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  >
    <template v-for="column in orderedColumns" :key="column._id">
      <slot
        name="column"
        :column="column"
        :on-move-left="() => handleMoveColumnLeft(column._id, moveColumnMutation)"
        :on-move-right="() => handleMoveColumnRight(column._id, moveColumnMutation)"
      />
    </template>

    <div v-if="canAddColumn" class="add-column">
      <slot name="add-column"> </slot>
    </div>
  </div>
</template>

<style scoped>
.columns-container {
  display: flex;
  overflow-x: auto;
  padding: 1rem;
  height: 100%;
}

.column-wrapper {
  position: relative;
  transition: all 0.2s;
}

.column-wrapper.dragging {
  opacity: 0.5;
}

.column-wrapper.drag-over {
  transform: translateX(10px);
}

.column-drag-handle {
  position: absolute;
  top: 8px;
  left: -24px;
  cursor: grab;
  opacity: 0.3;
  transition: opacity 0.2s;
  z-index: 10;
  color: #6b7280;
}

.column-wrapper:hover .column-drag-handle {
  opacity: 1;
}

.column-drag-handle:active {
  cursor: grabbing;
}
</style>
