<script setup lang="ts">
import type { OverviewStats } from '@/shared/types/review';

defineProps<OverviewStats>();
</script>

<template>
  <div class="overview">
    <p>Всего задач: {{ total }}</p>
    <p>Выполнено: {{ completed }}</p>
    <p>В прогрессе: {{ inProgress }}</p>
    <p>notStarted: {{ notStarted }}</p>
    <p>overdue: {{ overdue }}</p>
    <p>blocked: {{ blocked }}</p>
    <p>unassigned: {{ unassigned }}</p>
    <p>completionRate: {{ completionRate }}</p>
  </div>
</template>

<style lang="scss" scoped></style>
