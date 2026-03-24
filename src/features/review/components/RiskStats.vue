<script setup lang="ts">
import type { RiskStats } from '@/shared/types/review';

const props = defineProps<RiskStats>();
</script>

<template>
  <div>
    <p>Высокий приоритет просрочено: {{ highPriorityOverdue }}</p>
    <p>Скоро дедлайн: {{ dueSoon }}</p>
    <p>Исполнитель не назначен: {{ noAssignee }}</p>
    <p>Нет срока выполнения: {{ noDueDate }}</p>
  </div>
</template>

<style lang="scss" scoped></style>
