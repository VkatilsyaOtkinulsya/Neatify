<script setup lang="ts">
import { useVirtualList } from '@vueuse/core';
import { computed } from 'vue';

defineProps<{
  color: string;
}>();
</script>

<template>
  <div class="column-container">
    <div class="column">
      <div class="column-header" :style="[{ backgroundColor: color }]">
        <slot name="header"></slot>
      </div>
      <div class="column-content">
        <div class="tasks-list">
          <slot name="tasks-list"></slot>
        </div>
      </div>
      <div class="add-task">
        <slot name="add-task-button"></slot>
      </div>
    </div>
  </div>
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
  height: fit-content;
  max-height: 100%;
  flex-shrink: 0;
  border: 1px solid #333333;
  border-radius: 0.75rem;
  box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  .column-header {
    height: 40px;
    padding-top: 8px;
    padding-left: 12px;
    box-shadow: 0px -12px 6px -11px rgba(0, 0, 0, 0.1) inset;
  }

  .column-content {
    padding: 0.5rem 0.25rem 0;

    .tasks-list {
      display: flex;
      flex-direction: column;
      padding: 0 0.25rem;
      gap: 0.5rem;
    }
  }

  .add-task {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    margin-top: auto;
  }
}
</style>
