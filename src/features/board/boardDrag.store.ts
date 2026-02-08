import { defineStore } from 'pinia';

type DragState =
  | {
      type: 'task';
      taskId: string;
      fromColumnId: string;
    }
  | {
      type: 'column';
      columnId: string;
    }
  | null;

export const useBoardDragStore = defineStore('board-drag', {
  state: () => ({
    dragState: null as DragState,
  }),

  getters: {
    isTaskDragging: (state) => state.dragState?.type === 'task',
    isColumnDragging: (state) => state.dragState?.type === 'column',
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

    // ---------- COLUMN ----------
    startColumnDrag(columnId: string) {
      this.dragState = {
        type: 'column',
        columnId,
      };
    },

    // ---------- COMMON ----------
    clear() {
      this.dragState = null;
    },
  },
});
