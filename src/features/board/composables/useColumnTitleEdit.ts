export const useColumn = () => {};
import { ref, nextTick, watch, type Ref } from 'vue';
import type { BoardColumn } from '../types/board.types';

export function useColumnTitleEdit(
  column: () => BoardColumn,
  inputRef: Ref<HTMLInputElement | null>,
  onUpdate: (payload: { columnId: string; data: Partial<BoardColumn> }) => void
) {
  const isEditingColumnTitle = ref(false);
  const editedColumnTitle = ref('');

  watch(
    () => column().title,
    (v) => {
      if (!isEditingColumnTitle.value) {
        editedColumnTitle.value = v;
      }
    },
    { immediate: true }
  );

  const startEditColumnTitle = async () => {
    isEditingColumnTitle.value = true;

    await nextTick();
    requestAnimationFrame(() => {
      inputRef.value?.focus();
      inputRef.value?.select();
    });
  };

  const finishEditColumnTitle = () => {
    if (!isEditingColumnTitle.value) return;

    isEditingColumnTitle.value = false;

    const newTitle = editedColumnTitle.value.trim();
    const oldTitle = column().title;

    if (!newTitle || newTitle === oldTitle) {
      editedColumnTitle.value = oldTitle;
      return;
    }

    onUpdate({
      columnId: column()._id,
      data: { title: newTitle },
    });
  };

  const cancelEdit = () => {
    editedColumnTitle.value = column().title;
    inputRef.value?.blur();
  };

  const handleEnter = () => {
    inputRef.value?.blur();
  };

  return {
    inputRef,
    isEditingColumnTitle,
    editedColumnTitle,
    startEditColumnTitle,
    finishEditColumnTitle,
    cancelEdit,
    handleEnter,
  };
}
