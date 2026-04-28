<script setup lang="ts">
import type { ActivityStats } from '@/shared/types/review';

defineProps<ActivityStats>();
</script>

<template>
  <div>
    <div v-for="activityPoint in createdByDay" class="">
      <p>Создано задач в день: {{ activityPoint.date }} - {{ activityPoint.count }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
