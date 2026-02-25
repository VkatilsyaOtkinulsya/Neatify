<script setup lang="ts">
import { computed } from 'vue';
import Select from '@/components/ui/select/Select.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import TagInput from '@/components/ui/TagInput/TagInput.vue';
import ChecklistEditor from './ChecklistEditor.vue';
import DateRangePicker from './DateRangePicker.vue';
import AssigneeSelector from './AssigneeSelector.vue';
import { TaskStatusEnum, type Tag, type TaskStatus } from '@/features/task/types/task.types';
import Input from '@/components/ui/input/Input.vue';

interface ChecklistItem {
  text: string;
  isCompleted: boolean;
  position: number;
}

interface FormData {
  title: string;
  description: string;
  priorityLabel: string;
  status: TaskStatus;
  assignees: string[];
  tags: Tag[];
  checklist: ChecklistItem[];
  startDate?: Date;
  dueDate?: Date;
}

interface Props {
  modelValue: FormData;
  priorityLabels: readonly string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: FormData): void;
}>();

const statusOptions = [
  { value: TaskStatusEnum.ACTIVE, label: 'Активная' },
  { value: TaskStatusEnum.BLOCKED, label: 'Заблокирована' },
  { value: TaskStatusEnum.ARCHIVED, label: 'Архивная' },
] as const;

const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
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
  get: () => props.modelValue.status,
  set: (value) => updateField('status', value),
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
  <div class="space-y-4">
    <!-- Title -->
    <div>
      <Input
        v-model="title"
        type="text"
        placeholder="Название "
        class="modal-input focus:outline-none focus:ring-2 focus:ring-ring"
        required
      />
    </div>

    <!-- Description -->
    <div>
      <Textarea
        v-model="description"
        placeholder="Описание"
        class="modal-input focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>

    <!-- Priority -->
    <div class="space-y-1">
      <p class="text-sm text-muted-foreground">Приоритет</p>
      <Select
        v-model="priority"
        :items="priorityLabels"
        class="w-full"
        placeholder="Выберите приоритет..."
      />
    </div>

    <!-- Status -->
    <div class="space-y-1">
      <p class="text-sm text-muted-foreground">Статус</p>
      <Select
        v-model="status"
        :items="statusOptions.map((opt) => opt.label)"
        :item-values="statusOptions.map((opt) => opt.value)"
        class="w-full"
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

<style scoped lang="scss">
.modal-input {
  margin-bottom: 15px;
}
</style>
