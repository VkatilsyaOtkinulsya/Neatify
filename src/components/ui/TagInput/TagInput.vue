<script setup lang="ts">
import { ref } from 'vue';
import type { Tag } from '@/features/task/types/task.types';

const props = defineProps<{
  modelValue: Tag[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Tag[]): void;
}>();

const text = ref('');
const color = ref('#3b82f6');

const add = () => {
  if (!text.value.trim()) return;

  emit('update:modelValue', [
    ...props.modelValue,
    { title: text.value.trim(), color: color.value },
  ]);

  text.value = '';
};

const remove = (i: number) => {
  emit(
    'update:modelValue',
    props.modelValue.filter((_, index) => index !== i)
  );
};
</script>

<template>
  <div class="space-y-2">
    <!-- Tags -->
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(tag, i) in modelValue"
        :key="i"
        class="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-white"
        :style="{ background: tag.color }"
      >
        {{ tag.title }}
        <button @click="remove(i)" class="opacity-70 hover:opacity-100">✕</button>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex w-[60%] gap-2">
      <input
        v-model="text"
        @keydown.enter.prevent="add"
        placeholder="Добавить тег..."
        class="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <input type="color" v-model="color" class="h-9 w-9 cursor-pointer rounded-md border p-1" />

      <button
        @click="add"
        class="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
      >
        +
      </button>
    </div>
  </div>
</template>
