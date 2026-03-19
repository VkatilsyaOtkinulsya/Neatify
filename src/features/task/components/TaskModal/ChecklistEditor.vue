<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import type { ChecklistItem } from '../../types/task.types';
import Input from '@/components/ui/input/Input.vue';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';

// Внутренний тип — элемент может быть как с _id (при редактировании), так и без (при создании)
type AnyChecklistItem = ChecklistItem | Omit<ChecklistItem, '_id'>;

// Стабильный локальный идентификатор для работы внутри компонента
interface InternalItem {
  _localId: string;
  text: string;
  isCompleted: boolean;
  completedAt: Date | null;
  position: number;
  _id?: string; // сохраняем если пришёл с сервера
}

const props = defineProps<{
  modelValue: AnyChecklistItem[];
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: AnyChecklistItem[]): void;
}>();

// Конвертируем входящий массив во внутренний формат с локальными id
const toInternal = (items: AnyChecklistItem[]): InternalItem[] =>
  items.map((item, index) => ({
    _localId: '_id' in item && item._id ? item._id : `local-${index}-${Date.now()}`,
    text: item.text,
    isCompleted: item.isCompleted ?? false,
    completedAt: item.completedAt ?? null,
    position: item.position,
    _id: '_id' in item ? item._id : undefined,
  }));

// Конвертируем обратно для эмита — сохраняем _id если был
const toExternal = (items: InternalItem[]): AnyChecklistItem[] =>
  items.map(({ _localId, _id, ...rest }) => (_id ? { ...rest, _id } : rest));

const isEditingChecklist = ref(false);
const editingLocalId = ref<string | null>(null);
const editingText = ref('');

const newItemText = ref('');
const newItemCompleted = ref(false);

const startCreating = () => {
  isEditingChecklist.value = true;
  newItemText.value = '';
  newItemCompleted.value = false;
};

const cancelCreating = () => {
  isEditingChecklist.value = false;
  newItemText.value = '';
  newItemCompleted.value = false;
};

const addChecklistItem = () => {
  if (!newItemText.value.trim()) return;

  const newItem: AnyChecklistItem = {
    text: newItemText.value.trim(),
    isCompleted: newItemCompleted.value,
    completedAt: newItemCompleted.value ? new Date() : null,
    position: props.modelValue.length,
  };

  emits('update:modelValue', [...props.modelValue, newItem]);

  // Сбрасываем поле, но остаёмся в режиме добавления
  newItemText.value = '';
  newItemCompleted.value = false;
};

const startEditing = (item: InternalItem) => {
  editingLocalId.value = item._localId;
  editingText.value = item.text;
};

const finishEditing = (localId: string) => {
  if (!editingText.value.trim()) {
    cancelEditing();
    return;
  }

  const internal = toInternal(props.modelValue);
  const updated = internal.map((item) =>
    item._localId === localId ? { ...item, text: editingText.value.trim() } : item
  );

  emits('update:modelValue', toExternal(updated));
  editingLocalId.value = null;
  editingText.value = '';
};

const cancelEditing = () => {
  editingLocalId.value = null;
  editingText.value = '';
};

const toggleItem = (localId: string) => {
  const internal = toInternal(props.modelValue);
  const updated = internal.map((item) =>
    item._localId === localId
      ? {
          ...item,
          isCompleted: !item.isCompleted,
          completedAt: !item.isCompleted ? new Date() : null,
        }
      : item
  );
  emits('update:modelValue', toExternal(updated));
};

const removeItem = (localId: string) => {
  const internal = toInternal(props.modelValue);
  const filtered = internal
    .filter((item) => item._localId !== localId)
    .map((item, index) => ({ ...item, position: index })); // пересчитываем позиции

  emits('update:modelValue', toExternal(filtered));
};

const isEmptyChecklist = computed(() => !props.modelValue.length);
const internalItems = computed(() => toInternal(props.modelValue));
</script>

<template>
  <div class="w-full space-y-2">
    <!-- Список существующих элементов -->
    <div v-if="!isEmptyChecklist" class="flex flex-col gap-2">
      <div
        v-for="item in internalItems"
        :key="item._localId"
        class="flex items-center gap-2 rounded-md bg-secondary px-2 py-1 text-sm"
      >
        <Checkbox :model-value="item.isCompleted" @update:model-value="toggleItem(item._localId)" />

        <!-- Режим редактирования строки -->
        <Input
          v-if="editingLocalId === item._localId"
          :model-value="editingText"
          @update:model-value="editingText = $event as string"
          @keydown.enter.prevent="finishEditing(item._localId)"
          @keydown.esc="cancelEditing"
          @blur="finishEditing(item._localId)"
          class="flex-1"
          autofocus
        />
        <span
          v-else
          class="flex-1"
          :class="{ 'line-through text-muted-foreground': item.isCompleted }"
        >
          {{ item.text }}
        </span>

        <button
          v-if="editingLocalId !== item._localId"
          @click="startEditing(item)"
          class="text-muted-foreground hover:text-foreground"
        >
          ✎
        </button>
        <button
          @click="removeItem(item._localId)"
          class="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Форма добавления нового элемента -->
    <div v-if="isEditingChecklist" class="flex items-center gap-2">
      <Checkbox v-model="newItemCompleted" />
      <Input
        v-model="newItemText"
        placeholder="Текст пункта"
        class="flex-1"
        @keydown.enter.prevent="addChecklistItem"
        @keydown.esc="cancelCreating"
        autofocus
      />
      <button @click="cancelCreating" class="text-muted-foreground hover:text-foreground">✕</button>
    </div>

    <!-- Кнопка добавления -->
    <Button
      v-if="!isEditingChecklist"
      variant="outline"
      class="w-70 justify-start text-left font-normal"
      @click="startCreating"
    >
      <Plus class="mr-2 h-4 w-4" />
      {{ isEmptyChecklist ? 'Добавить чек-лист' : 'Добавить элемент' }}
    </Button>
  </div>
</template>
