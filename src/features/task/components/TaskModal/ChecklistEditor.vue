<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import type { ChecklistItem } from '../../types/task.types';
import Input from '@/components/ui/input/Input.vue';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';

interface ListItem {
  text: string;
  isCompleted?: boolean;
  completedAt?: Date | null;
  position: number;
}

const props = defineProps<{
  modelValue: ChecklistItem[] | [];
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: Omit<ChecklistItem, '_id'>[]): void;
}>();

const isEditingChecklist = ref(false);
const selectedTask = ref<string | null>(null);

const itemData = ref<ListItem>({
  text: '',
  isCompleted: false,
  completedAt: null,
  position: props.modelValue.length,
});

const addChecklistItem = () => {
  if (!itemData.value.text.trim()) return;

  const newItem = {
    text: itemData.value.text.trim(),
    isCompleted: itemData.value.isCompleted ?? false,
    completedAt: itemData.value.isCompleted ? new Date() : null,
    position: props.modelValue.length,
  };

  emits('update:modelValue', [...props.modelValue, newItem]);

  itemData.value = {
    text: '',
    isCompleted: false,
    completedAt: null,
    position: props.modelValue.length,
  };
};

const startCreating = () => {
  isEditingChecklist.value = true;
};

const editTask = (taskId: string) => {
  selectedTask.value = taskId;
};

const cancelCreating = () => {
  isEditingChecklist.value = false;
  itemData.value = {
    text: '',
    isCompleted: false,
    completedAt: null,
    position: 0,
  };
};

const removeChecklistItem = (taskId: string) => {
  emits(
    'update:modelValue',
    props.modelValue.filter((item) => item._id !== taskId)
  );
};

const isEmptyChecklist = computed(() => !props.modelValue.length);
</script>

<template>
  <div class="w-full">
    <div v-if="!isEmptyChecklist" class="flex flex-col gap-2">
      <p>Чек-лист</p>

      <div
        v-for="item in modelValue"
        :key="item._id"
        class="flex items-center gap-2 rounded-md bg-secondary px-2 py-1 text-sm"
      >
        <input type="checkbox" :checked="item.isCompleted" />
        {{ item.text }}
        <button
          @click="editTask(item._id)"
          class="text-muted-foreground hover:text-foreground"
          :disabled="!!selectedTask"
        >
          edit
        </button>
        <button
          @click="removeChecklistItem(item._id)"
          class="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
    </div>

    <div v-if="isEditingChecklist" class="flex flex-col gap-2">
      <div class="checklist-item">
        <Checkbox v-model="itemData.isCompleted" />

        <Input
          @keydown.esc="cancelCreating"
          @keydown.enter.prevent="addChecklistItem"
          v-model="itemData.text"
        />

        <button @click="cancelCreating" class="text-muted-foreground hover:text-foreground">
          ✕
        </button>
      </div>
    </div>

    <Button
      v-if="isEmptyChecklist || !isEditingChecklist"
      variant="outline"
      :class="'w-70 justify-start text-left font-normal'"
      @click="startCreating"
    >
      <Plus class="mr-2 h-4 w-4" />
      {{ props.modelValue.length ? 'Добавить элемент' : 'Добавить чек-лист' }}
    </Button>
  </div>
</template>
