<script setup lang="ts">
import Tooltip from '@/components/ui/tooltip/Tooltip.vue';
import { ref } from 'vue';

interface Props {
  href?: string;
  style?: string;
  label: string;
  tooltipText: string;
  isOpened: boolean;
}

const elRef = ref<HTMLElement | null>(null);

withDefaults(defineProps<Props>(), {
  isOpened: false,
});
</script>

<template>
  <a ref="elRef" :href="href" class="nav-item">
    <div class="icon-wrapper">
      <slot name="icon"></slot>
    </div>
    <p v-if="isOpened">{{ label }}</p>
    <Tooltip
      id="link-tooltip"
      :text="tooltipText"
      :target="elRef"
      position="right"
      :disabled="isOpened"
    />
  </a>
</template>

<style scoped lang="scss">
.nav-item {
  position: relative;
  gap: 6px;
  text-decoration: none;
  color: rgb(242, 242, 242);
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    background: #333333;
    border-radius: 6px;
  }

  p {
    font-size: 14px;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    color: rgb(153, 153, 153);
  }
}

.leftside-bar--collapsed {
  .nav-item {
    &:hover .tooltip {
      opacity: 1;
    }
  }
}
</style>
