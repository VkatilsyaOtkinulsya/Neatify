<script setup lang="ts">
import { computed } from 'vue';
import SelectTaskForm from './SelectTaskForm.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import TagInput from '@/components/ui/TagInput/TagInput.vue';
import ChecklistEditor from './ChecklistEditor.vue';
import DateRangePicker from './DateRangePicker.vue';
import AssigneeSelector from './AssigneeSelector.vue';
import { type TaskFormData } from '@/features/task/types/task.types';
import Input from '@/components/ui/input/Input.vue';
import { statusLabels } from '../../variables/status';
import { priorityLabels } from '../../variables/priority';

interface Props {
  modelValue: TaskFormData;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: TaskFormData): void;
}>();

const updateField = <K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value,
  });
};

const title = computed({
  get: () => props.modelValue.title,
  set: (value) => updateField('title', value),
});

const description = computed({
  get: () => props.modelValue.description,
  set: (value) => updateField('description', value),
});

const priority = computed({
  get: () => props.modelValue.priorityLabel,
  set: (value) => updateField('priorityLabel', value),
});

const status = computed({
  get: () => props.modelValue.statusLabel,
  set: (value) => updateField('statusLabel', value),
});

const tags = computed({
  get: () => props.modelValue.tags,
  set: (value) => updateField('tags', value),
});

const checklist = computed({
  get: () => props.modelValue.checklist,
  set: (value) => updateField('checklist', value),
});

const assignees = computed({
  get: () => props.modelValue.assignees,
  set: (value) => updateField('assignees', value),
});

const dates = computed({
  get: () => ({
    startDate: props.modelValue.startDate,
    dueDate: props.modelValue.dueDate,
  }),
  set: (value: { startDate?: Date; dueDate?: Date }) => {
    emit('update:modelValue', {
      ...props.modelValue,
      startDate: value.startDate,
      dueDate: value.dueDate,
    });
  },
});
</script>

<template>
  <div class="space-y-4 p-0.5">
    <!-- Title -->
    <div>
      <Input
        v-model="title"
        type="text"
        placeholder="Название "
        class="modal-input w-[70%] focus:outline-none focus:ring-2 focus:ring-ring"
        required
      />
    </div>

    <!-- Description -->
    <div>
      <Textarea
        v-model="description"
        placeholder="Описание"
        class="modal-input w-[70%] focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>

    <!-- Priority -->
    <div class="space-y-1 w-[35%]">
      <p class="text-sm text-muted-foreground">Приоритет</p>
      <SelectTaskForm
        v-model="priority"
        :items="priorityLabels"
        class="flex-1"
        placeholder="Выберите приоритет..."
      />
    </div>

    <!-- Status -->
    <div class="space-y-1 w-[35%]">
      <p class="text-sm text-muted-foreground">Статус</p>
      <SelectTaskForm
        v-model="status"
        :items="statusLabels"
        class="flex-1"
        placeholder="Выберите статус..."
      />
    </div>

    <div class="space-y-1">
      <p class="text-sm text-muted-foreground">Исполнители</p>
      <AssigneeSelector v-model="assignees" />
    </div>

    <div class="space-y-1">
      <p class="text-sm text-muted-foreground">Даты</p>
      <DateRangePicker v-model="dates" />
    </div>

    <div class="space-y-1">
      <p class="text-sm text-muted-foreground">Чек-лист</p>
      <ChecklistEditor v-model="checklist" />
    </div>

    <!-- Tags -->
    <div class="space-y-1">
      <p class="text-sm text-muted-foreground">Теги</p>
      <TagInput v-model="tags" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
