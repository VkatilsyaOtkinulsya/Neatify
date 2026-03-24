<script setup lang="ts">
import { ref, onBeforeUnmount, nextTick, watch, computed, type Ref } from 'vue';

interface Props {
  id?: string;
  text: string;
  target: HTMLElement | null | Ref<HTMLElement | null>;
  position?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
});

const getEl = () => {
  return (props.target as any)?.value ?? props.target;
};

const visible = ref(false);
const x = ref(0);
const y = ref(0);

const updatePosition = async () => {
  if (!props.target) return;
  const el = getEl();

  await nextTick();

  const rect = el.getBoundingClientRect();

  switch (props.position) {
    case 'top':
      x.value = rect.left + rect.width / 2;
      y.value = rect.top - 8;
      break;
    case 'bottom':
      x.value = rect.left + rect.width / 2;
      y.value = rect.bottom + 8;
      break;
    case 'left':
      x.value = rect.left - 8;
      y.value = rect.top + rect.height / 2;
      break;
    case 'right':
      x.value = rect.right + 8;
      y.value = rect.top + rect.height / 2;
      break;
  }
};

const show = async () => {
  visible.value = true;
  await updatePosition();
};

const hide = () => {
  visible.value = false;
};

let cleanup: (() => void) | null = null;

const attach = () => {
  if (props.disabled) return null;
  const el = getEl();

  const onEnter = show;
  const onLeave = hide;
  const onMove = updatePosition;

  el.addEventListener('mouseenter', onEnter);
  el.addEventListener('mouseleave', onLeave);
  el.addEventListener('mousemove', onMove);

  cleanup = () => {
    el.removeEventListener('mouseenter', onEnter);
    el.removeEventListener('mouseleave', onLeave);
    el.removeEventListener('mousemove', onMove);
  };
};

const isActive = computed(() => !!props.target && !props.disabled);

watch(
  isActive,
  (active) => {
    cleanup?.();

    if (!active) {
      visible.value = false;
      return;
    }

    attach();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  cleanup?.();
});
</script>

<template>
  <Teleport to="body">
    <span
      v-if="visible"
      :id="id"
      class="tooltip"
      :style="{
        top: y + 'px',
        left: x + 'px',
        transform:
          position === 'top'
            ? 'translate(-50%, -100%)'
            : position === 'bottom'
              ? 'translate(-50%, 0)'
              : position === 'left'
                ? 'translate(-100%, -50%)'
                : 'translate(0, -50%)',
      }"
    >
      {{ text }}
    </span>
  </Teleport>
</template>

<style scoped>
.tooltip {
  position: fixed;
  background: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 9999;
  pointer-events: none;
}
</style>
