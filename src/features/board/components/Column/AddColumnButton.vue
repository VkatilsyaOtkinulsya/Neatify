<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue';

const emit = defineEmits<{
  create: [title: string];
}>();

const isEditing = ref(false);
const columnTitle = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

const startCreating = async () => {
  isEditing.value = true;
  await nextTick();
  inputRef.value?.focus();
};

const handleCreate = () => {
  if (columnTitle.value.trim()) {
    emit('create', columnTitle.value.trim());
    resetForm();
  }
};

const handleClickOutside = () => {
  if (columnTitle.value.trim()) {
    handleCreate();
  } else {
    resetForm();
  }
};

const resetForm = () => {
  isEditing.value = false;
  columnTitle.value = '';
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleCreate();
  } else if (e.key === 'Escape') {
    resetForm();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div v-if="!isEditing" class="w-68 px-1.5">
    <button type="button" class="add-column" @click.stop="startCreating">[ + ]</button>
  </div>

  <div v-else class="column" v-click-outside="handleClickOutside">
    <div class="column-header">
      <input
        ref="inputRef"
        v-model="columnTitle"
        type="text"
        placeholder="Название колонки"
        class="column-title-input"
        @keydown="handleKeydown"
      />
      <div class="form-actions">
        <button @click="handleCreate" :disabled="!columnTitle.trim()" class="btn-create">
          Добавить
        </button>
        <button @click="resetForm" class="btn-cancel">Отмена</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.column {
  display: flex;
  flex-direction: column;
  min-width: 17rem;
  height: 262.5px;
  border: 1px solid #333333;
  border-radius: 0.5rem;
  padding: 0 6px;
  box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.15);

  .column-header {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    height: 40px;
    padding-top: 8px;
    padding-left: 12px;
    box-shadow: 0px -12px 6px -11px rgba(0, 0, 0, 0.1) inset;
  }

  .column-content {
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 12px;
  }
}
.add-column {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 17rem;
  height: 70px;
  border: 1px solid #7c7c7c;
  border-radius: 0.5rem;
  padding: 0px 15px;
  font-size: 1.8rem;
  color: #5e5e5e;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2) inset;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
}
</style>
