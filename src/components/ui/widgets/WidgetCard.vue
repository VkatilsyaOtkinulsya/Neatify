<script setup lang="ts">
import { X, Minus, Maximize2 } from 'lucide-vue-next';
import Button from '@/components/ui/button/Button.vue';

interface Props {
  title: string;
  isMinimized: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  remove: [];
  toggleMinimize: [];
}>();
</script>

<template>
  <div class="widget-card">
    <div class="widget-header">
      <h3 class="widget-title">{{ title }}</h3>
      <div class="widget-actions">
        <Button variant="ghost" size="icon" class="h-8 w-8" @click="emit('toggleMinimize')">
          <Minus v-if="!isMinimized" :size="16" />
          <Maximize2 v-else :size="16" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8 text-destructive"
          @click="emit('remove')"
        >
          <X :size="16" />
        </Button>
      </div>
    </div>
    <div class="widget-content-wrapper" :class="{ minimized: isMinimized }">
      <div class="widget-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.widget-card {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--card);
  box-shadow:
    0 2px 8px oklch(0 0 0 / 0.08),
    0 0 0 1px var(--border);
  width: fit-content;

  &:hover {
    box-shadow:
      0 6px 20px oklch(0 0 0 / 0.12),
      0 0 0 1px var(--border);
  }
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
  background: var(--muted) / 0.3;
  flex-shrink: 0;
}

.widget-title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0;
  color: var(--foreground);
  letter-spacing: -0.01em;
}

.widget-actions {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.widget-content-wrapper {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.2s ease-out;

  &.minimized {
    grid-template-rows: 0fr;
  }
}

.widget-content {
  padding: 1.5rem;
  width: 100%;
  min-height: 0;
}
</style>
