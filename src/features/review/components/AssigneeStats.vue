<script setup lang="ts">
import type { AssigneeStats } from '@/shared/types/review';

const props = defineProps<AssigneeStats>();
</script>

<template>
  <div class="assignee">
    <div>
      Пользователь с id: {{ userId }}, имеет задач {{ total }}, из которых выполнено {{ completed }}
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
