<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import BoardSkeleton from './BoardSkeleton.vue';

const Board = defineAsyncComponent(() => import('./Board.vue'));

const showSkeleton = ref(true);
const minSkeletonTime = 300;

onMounted(() => {
  const startTime = Date.now();

  const checkLoaded = () => {
    const elapsed = Date.now() - startTime;
    if (elapsed >= minSkeletonTime) {
      showSkeleton.value = false;
    } else {
      setTimeout(() => {
        showSkeleton.value = false;
      }, minSkeletonTime - elapsed);
    }
  };

  checkLoaded();
});
</script>

<template>
  <div class="board-wrapper-container">
    <BoardSkeleton v-if="showSkeleton" />
    <Suspense v-else>
      <Board />
      <template #fallback>
        <BoardSkeleton />
      </template>
    </Suspense>
  </div>
</template>

<style scoped lang="scss">
.board-wrapper-container {
  width: 100%;
  height: 100%;
}
</style>
