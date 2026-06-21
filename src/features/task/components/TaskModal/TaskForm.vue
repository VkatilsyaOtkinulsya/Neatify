<script setup lang="ts">
import { computed } from 'vue';
import SelectTaskForm from './SelectTaskForm.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import TagInput from '@/components/ui/TagInput/TagInput.vue';
import ChecklistEditor from './ChecklistEditor.vue';
import DateRangePicker from './DateRangePicker.vue';
import AssigneeSelector from './AssigneeSelector.vue';
import { type TaskEstimate, type TaskFormData } from '@/features/task/types/task.types';
import Input from '@/components/ui/input/Input.vue';
import { statusLabels } from '../../variables/status';
import { priorityLabels } from '../../variables/priority';

const estimateUnitLabels = ['часы', 'дни', 'очки'] as const;
const ESTIMATE_UNIT_MAP: Record<string, 'hours' | 'days' | 'points'> = {
  часы: 'hours',
  дни: 'days',
  очки: 'points',
};
const ESTIMATE_UNIT_REVERSE_MAP: Record<string, string> = {
  hours: 'часы',
  days: 'дни',
  points: 'очки',
};

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

const estimateUnitLabel = computed({
  get: () =>
    props.modelValue.estimate ? ESTIMATE_UNIT_REVERSE_MAP[props.modelValue.estimate.unit] ?? '' : '',
  set: (label: string) => {
    emit('update:modelValue', {
      ...props.modelValue,
      estimate: {
        value: props.modelValue.estimate?.value ?? 0,
        unit: ESTIMATE_UNIT_MAP[label] ?? 'hours',
      },
    });
  },
});

const estimateValue = computed({
  get: () => props.modelValue.estimate?.value,
  set: (val: number | undefined) => {
    emit('update:modelValue', {
      ...props.modelValue,
      estimate: {
        value: val ?? 0,
        unit: props.modelValue.estimate?.unit ?? 'hours',
      },
    });
  },
});
</script>

<template>
  <div class="space-y-4 p-0.5">
    <!-- Title -->
    <div class="space-y-1">
      <p class="text-sm font-medium">Название</p>
      <Input
        v-model="title"
        type="text"
        placeholder="Введите название..."
        class="modal-input w-full focus:outline-none focus:ring-2 focus:ring-ring"
        required
      />
    </div>

    <!-- Description -->
    <div class="space-y-1">
      <p class="text-sm font-medium">Описание</p>
      <Textarea
        v-model="description"
        placeholder="Введите описание..."
        class="modal-input w-full focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>

    <!-- Priority + Status -->
    <div class="flex gap-4">
      <div class="space-y-1 flex-1">
        <p class="text-sm font-medium">Приоритет</p>
        <SelectTaskForm
          v-model="priority"
          :items="priorityLabels"
          class="flex-1"
          placeholder="Выберите приоритет..."
        />
      </div>
      <div class="space-y-1 flex-1">
        <p class="text-sm font-medium">Статус</p>
        <SelectTaskForm
          v-model="status"
          :items="statusLabels"
          class="flex-1"
          placeholder="Выберите статус..."
        />
      </div>
    </div>

    <!-- Estimate + Dates -->
    <div class="flex gap-4">
      <div class="space-y-1 flex-1">
        <p class="text-sm font-medium">Оценка</p>
        <div class="flex gap-2">
          <Input
            v-model="estimateValue"
            type="number"
            placeholder="0"
            class="modal-input w-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
            min="0"
          />
          <SelectTaskForm
            v-model="estimateUnitLabel"
            :items="estimateUnitLabels"
            class="w-[120px]"
            placeholder="Единица..."
          />
        </div>
      </div>
      <div class="space-y-1 flex-1">
        <p class="text-sm font-medium">Даты</p>
        <DateRangePicker v-model="dates" />
      </div>
    </div>

    <!-- Assignees + Tags -->
    <div class="flex gap-4">
      <div class="space-y-1 flex-1">
        <p class="text-sm font-medium">Исполнители</p>
        <AssigneeSelector v-model="assignees" />
      </div>
      <div class="space-y-1 flex-1">
        <p class="text-sm font-medium">Теги</p>
        <TagInput v-model="tags" />
      </div>
    </div>

    <!-- Checklist -->
    <div class="space-y-1">
      <p class="text-sm font-medium">Чек-лист</p>
      <ChecklistEditor v-model="checklist" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
