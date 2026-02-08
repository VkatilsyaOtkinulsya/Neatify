<script setup lang="ts">
import { computed, ref } from 'vue';
import type { BoardColumn as ColumnType } from '../types/project.types';
import { useBoardDragStore } from '../boardDrag.store';
import { useBoardScroll } from '../composables/useBoardScroll';

const props = defineProps<{
  columns: ColumnType[];
}>();

const emits = defineEmits<{
  'column-drop': [columnId: string, toIndex: number];
  'create-column': [];
}>();

const dragStore = useBoardDragStore();
const hoverIndex = ref<number | null>(null);

const { handleMouseMove, handleMouseUp, handleMouseDown } = useBoardScroll();

const orderedColumns = computed(() => [...props.columns].sort((a, b) => a.position - b.position));
// ---------- handlers ----------

const handleDragOverZone = (event: DragEvent, index: number) => {
  if (!dragStore.isColumnDragging) return;
  event.preventDefault();
  hoverIndex.value = index;
};

const handleDragLeaveZone = () => {
  hoverIndex.value = null;
};

const handleDrop = (index: number) => {
  const drag = dragStore.dragState;
  if (!drag || drag.type !== 'column') return;

  emits('column-drop', drag.columnId, index);

  hoverIndex.value = null;
  dragStore.clear();
};
</script>

<template>
  <div
    class="columns-container"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  >
    <div
      class="column-drop-zone"
      :class="{ active: hoverIndex === 0 }"
      @dragover="(e) => handleDragOverZone(e, 0)"
      @dragleave="handleDragLeaveZone"
      @drop="() => handleDrop(0)"
    />

    <template v-for="(column, index) in orderedColumns" :key="column._id">
      <slot name="column" :column="column" />

      <div
        class="column-drop-zone"
        :class="{ active: hoverIndex === index + 1 }"
        @dragover="(e) => handleDragOverZone(e, index + 1)"
        @dragleave="handleDragLeaveZone"
        @drop="() => handleDrop(index + 1)"
      />
    </template>

    <div class="add-column">
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
