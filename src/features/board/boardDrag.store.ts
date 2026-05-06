import { defineStore } from 'pinia';

type DragState =
  | {
      type: 'task';
      taskId: string;
      fromColumnId: string;
    }
  | null;

export const useBoardDragStore = defineStore('board-drag', {
  state: () => ({
    dragState: null as DragState,
  }),

  getters: {
    isTaskDragging: (state) => state.dragState?.type === 'task',
  },

  actions: {
    // ---------- TASK ----------
    startTaskDrag(taskId: string, fromColumnId: string) {
      this.dragState = {
        type: 'task',
        taskId,
        fromColumnId,
      };
    },

    // ---------- COMMON ----------
    clear() {
      this.dragState = null;
    },
  },
});
