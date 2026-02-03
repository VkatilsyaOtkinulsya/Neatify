<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { BadgeVariants } from '.';
import { reactiveOmit } from '@vueuse/core';
import { Primitive } from 'reka-ui';
import { cn } from '@/shared/lib/utils';
import { badgeVariants } from '.';

const props = defineProps<
  PrimitiveProps & {
    variant?: BadgeVariants['variant'];
    class?: HTMLAttributes['class'];
    color: string;
  }
>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
  <Primitive
    data-slot="badge"
    :class="cn(badgeVariants({ variant }), props.class)"
    :style="color ? { backgroundColor: color } : {}"
    v-bind="delegatedProps"
  >
    <slot />
  </Primitive>
</template>
