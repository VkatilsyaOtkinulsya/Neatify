<script setup lang="ts">
import { ref } from 'vue';

export type Tag = { label: string; color: string };

const props = defineProps<{
  modelValue: Tag[];
}>();

const emit = defineEmits(['update:modelValue']);

const text = ref('');
const color = ref('#3b82f6');

const add = () => {
  if (!text.value.trim()) return;

  emit('update:modelValue', [
    ...props.modelValue,
    { label: text.value.trim(), color: color.value },
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
        {{ tag.label }}
        <button @click="remove(i)" class="opacity-70 hover:opacity-100">✕</button>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex gap-2">
      <input
        v-model="text"
        @keydown.enter.prevent="add"
        placeholder="Добавить тег..."
        class="h-10 w-100 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
      />

      <input
        type="color"
        v-model="color"
        class="h-10 w-10 cursor-pointer rounded-full border p-1"
      />

      <button
        @click="add"
        class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:scale-105 active:scale-95 transition"
      >
        +
      </button>
    </div>
  </div>
</template>
