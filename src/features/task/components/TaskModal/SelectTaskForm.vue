<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  modelValue: string | number | null;
  items: readonly string[];
  itemValues?: readonly (string | number)[];
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const open = ref(false);
const root = ref<HTMLElement>();

const selectedLabel = computed(() => props.items.find((i) => i === props.modelValue));

const toggle = () => (open.value = !open.value);

const select = (val: any) => {
  emit('update:modelValue', val);
  open.value = false;
};

const onClickOutside = (e: MouseEvent) => {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false;
};

onMounted(() => document.addEventListener('click', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside));

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') open.value = false;
};
</script>

<template>
  <div ref="root" class="relative w-full">
    <!-- Trigger -->
    <button
      @click="toggle"
      @keydown="onKey"
      class="flex items-center justify-between w-full h-9 px-2 text-sm border rounded-md shadow-sm border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <span class="flex-1 truncate text-left">
        {{ selectedLabel || placeholder }}
      </span>
      <ChevronDown class="w-4 h-4 opacity-50" />
    </button>

    <!-- Dropdown -->
    <transition name="fade-scale">
      <div v-if="open" class="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
        <ul class="max-h-60 overflow-auto p-1 text-sm">
          <li
            v-for="item in items"
            :key="item"
            @click="select(item)"
            :class="[
              'cursor-pointer rounded px-2 py-1.5',
              modelValue === item ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
            ]"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.15s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
