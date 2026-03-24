<script setup lang="ts">
import type { TimingStats } from '@/shared/types/review';

const props = defineProps<TimingStats>();
</script>

<template>
  <div>
    <p>Среднеее время выполнения от createdAt: {{ avgLeadTime ?? '0' }}</p>
    <p>Среднеее время выполнения от startDate: {{ avgCycleTime ?? '0' }}</p>
    <p>% задач, завершённых вовремя: {{ onTimeRate }}</p>
  </div>
</template>

<style lang="scss" scoped></style>
