<script setup lang="ts">
import { ref } from 'vue';

defineProps<{}>();

const isActive = ref<string>('board');

const handleLinkClick = (link: string) => {
  isActive.value = link;
};
</script>

<template>
  <div>
    <div class="w-full flex items-center justify-between px-5 shrink-0 backdrop-blur-xs min-h-12">
      <nav class="flex pl-5">
        <ol class="flex gap-3.5 items-center">
          <li :class="{ active: isActive === 'review', 'nav-item': true }">
            <button class="nav-btn" @click="handleLinkClick('review')">
              <router-link class="nav-link" :to="{ name: 'review' }">Обзор</router-link>
            </button>
          </li>
          <li :class="{ active: isActive === 'board', 'nav-item': true }">
            <button class="nav-btn" @click="handleLinkClick('board')">
              <router-link class="nav-link" :to="{ name: 'board' }">Доска</router-link>
            </button>
          </li>
          <li :class="{ active: isActive === 'table', 'nav-item': true }">
            <button class="nav-btn" @click="handleLinkClick('table')">
              <router-link class="nav-link" :to="{ name: 'table' }">Список</router-link>
            </button>
          </li>
        </ol>
      </nav>
      <p class="align-center h-fit">Активных задач:</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-item {
  width: 100%;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 6px 0;
  background-color: rgba($color: #fff, $alpha: 0.7);
  border-radius: 0.5rem;
  cursor: pointer;

  opacity: 0.5;
}

.nav-item.active {
  opacity: 100;
  color: #11429d;
  background-color: rgba(162, 223, 255, 0.8);
  pointer-events: auto;
}

.nav-btn {
  width: 5rem;
  display: flex;
  justify-content: center;
  cursor: pointer;
}
</style>
