<script setup lang="ts">
import BoardHeader from '@/features/board/components/BoardHeader.vue';
</script>

<template>
  <div class="h-full">
    <BoardHeader />
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped></style>
