<script setup lang="ts">
import { computed } from 'vue';
import { Slider } from '@/components/ui/slider';

const props = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    step?: number;
    direction?: 'increase' | 'decrease';
    modelValue?: { start: number; target: number };
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    direction: 'increase',
    modelValue: () => ({ start: 20, target: 75 }),
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: { start: number; target: number }];
}>();

const isDecrease = computed(() => props.direction === 'decrease');

const startValue = computed({
  get: () => [props.modelValue.start],
  set: (val: number[]) => {
    emit('update:modelValue', { ...props.modelValue, start: val[0] });
  },
});

const targetValue = computed({
  get: () => [props.modelValue.target],
  set: (val: number[]) => {
    emit('update:modelValue', { ...props.modelValue, target: val[0] });
  },
});
</script>

<template>
  <div class="w-full space-y-3">
    <!-- Start -->
    <div class="space-y-1.5">
      <div class="flex justify-between text-xs text-muted-foreground">
        <span class="font-medium uppercase tracking-wide">Start</span>
        <span class="font-semibold text-foreground">{{ modelValue.start }}</span>
      </div>
      <Slider v-model="startValue" :min="min" :max="max" :step="step" class="w-full" />
    </div>

    <!-- Target -->
    <div class="space-y-1.5">
      <div class="flex justify-between text-xs text-muted-foreground">
        <span class="font-medium uppercase tracking-wide">Target</span>
        <span class="font-semibold text-foreground">{{ modelValue.target }}</span>
      </div>
      <Slider v-model="targetValue" :min="min" :max="max" :step="step" class="w-full" />
    </div>

    <!-- Подсказка при decrease -->
    <p v-if="isDecrease" class="text-xs text-muted-foreground">
      Уменьшение: start ({{ modelValue.start }}) должен быть больше target ({{ modelValue.target }})
    </p>
  </div>
</template>
