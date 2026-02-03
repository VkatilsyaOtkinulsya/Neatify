<script setup lang="ts">
defineProps<{
  taskCount: number;
}>();
</script>

<template>
  <div>
    <div class="w-full flex items-center justify-between px-5 shrink-0 backdrop-blur-xs min-h-12">
      <nav class="flex pl-5">
        <ol class="flex gap-3.5 items-center">
          <li class="nav-item">
            <button class="nav-btn"><a class="nav-link" href="#">Обзор</a></button>
          </li>
          <li
            class="nav-item"
            style="
              opacity: 100;
              color: #11429d;
              background-color: rgba(162, 223, 255, 0.8);
              pointer-events: auto;
            "
          >
            <button class="nav-btn">
              <a class="nav-link" href="#">Доска</a>
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-btn"><a class="nav-link" href="#">Список</a></button>
          </li>
          <li class="nav-item">
            <button class="nav-btn"><a class="nav-link" href="#">Календарь</a></button>
          </li>
        </ol>
      </nav>
      <p class="align-center h-fit">Активных задач: {{ taskCount }}</p>
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

  pointer-events: none;
  opacity: 0.5;
}

.nav-btn {
  width: 5rem;
  display: flex;
  justify-content: center;
  cursor: pointer;
}
</style>
