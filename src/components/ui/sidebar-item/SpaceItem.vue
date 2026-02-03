<script setup lang="ts">
import Tooltip from '@/components/ui/tooltip/Tooltip.vue';

interface Props {
  style?: string;
  workspace: {
    id: string;
    name: string;
  };
  isOpened: boolean;
  index?: number;
}

withDefaults(defineProps<Props>(), {
  isOpened: false,
});
</script>

<template>
  <a
    :href="'/space/' + workspace.id + '/projects'"
    class="nav-item"
    aria-describedby="link-tooltip"
    tabindex="0"
  >
    <div class="icon-wrapper">
      <slot name="icon"></slot>
    </div>
    <p v-if="isOpened">
      <slot name="label"></slot>
    </p>
    <Tooltip
      id="link-tooltip"
      :text="workspace.name"
      role="tooltip"
      position="right"
      :custom-position="{ left: isOpened ? '50%' : '210%' }"
    >
    </Tooltip>
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
    font-weight: 500;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;
    margin: 0;
    flex-shrink: 0;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      color: #fff;
    }
  }
}

.leftside-bar--collapsed {
  .nav-item {
    justify-content: center;
    &:hover .tooltip {
      opacity: 1;
    }
  }
}
</style>
