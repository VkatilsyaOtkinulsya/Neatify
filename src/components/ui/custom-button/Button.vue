<script setup lang="ts">
import { cn } from '@/shared/lib/utils';

const props = defineProps<{
  child?: string;
  variant?: string;
  disabled?: Boolean;
  onClick?: (e: Event) => void;
}>();

const buttonClasses = cn('button', `button--${props.variant}`, {
  'button--disabled': props.disabled,
});
</script>

<template>
  <button :class="[buttonClasses, $attrs.class]" type="button" @click="onClick" v-bind="$attrs">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &--primary {
    background-color: #3b82f6;
    color: white;
    border: 1px solid #3b82f6;

    &:hover {
      background-color: #2563eb;
    }
  }

  &--secondary {
    background-color: white;
    color: #3b82f6;
    border: 1px solid #e5e7eb;

    &:hover {
      background-color: #f9fafb;
    }
  }

  &--text {
    background-color: transparent;
    color: #3b82f6;
    border: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &--small {
    padding: 4px 8px;
    font-size: 12px;
  }

  &--medium {
    padding: 6px 12px;
    font-size: 14px;
  }

  &--large {
    padding: 8px 16px;
    font-size: 16px;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
