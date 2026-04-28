<script setup lang="ts">
/** Карточек в каждой колонке (варьируется для реалистичности) */
const cardsPerColumn = [3, 2, 4, 1, 2];
</script>

<template>
  <div class="board-skeleton">
    <div class="columns-skeleton">
      <div v-for="(count, colIdx) in cardsPerColumn" :key="colIdx" class="column-skeleton">
        <!-- Заголовок колонки -->
        <div class="column-header-skeleton">
          <div class="skeleton-bar title-bar" />
          <div class="skeleton-circle" />
        </div>

        <!-- Карточки -->
        <div class="column-body-skeleton">
          <div
            v-for="(_, cardIdx) in count"
            :key="cardIdx"
            class="task-card-skeleton"
            :style="{ minHeight: `${60 + Math.random() * 40}px` }"
          >
            <!-- Теги -->
            <div v-if="cardIdx % 2 === 0" class="card-tags-skeleton">
              <div class="skeleton-bar tag-bar" />
              <div v-if="cardIdx % 3 === 0" class="skeleton-bar tag-bar tag-bar-short" />
            </div>

            <!-- Заголовок задачи -->
            <div class="card-title-skeleton">
              <div class="skeleton-bar text-bar" />
              <div v-if="cardIdx % 2 === 0" class="skeleton-bar text-bar text-bar-short" />
            </div>

            <!-- Мета (дата, чеклист) -->
            <div v-if="cardIdx % 3 !== 1" class="card-meta-skeleton">
              <div class="skeleton-bar meta-bar" />
              <div v-if="cardIdx % 2 === 0" class="skeleton-bar meta-bar meta-bar-short" />
            </div>
          </div>
        </div>

        <!-- Кнопка «Добавить задачу» -->
        <div class="add-task-skeleton">
          <div class="skeleton-bar add-bar" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* ---------- анимация shimmer ---------- */
@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}

.skeleton-bar,
.skeleton-circle {
  background: linear-gradient(90deg, #e2e2e2 25%, #f5f5f5 37%, #e2e2e2 63%);
  background-size: 800px 100%;
  animation: shimmer 1.8s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-circle {
  border-radius: 50%;
}

/* ---------- board layout ---------- */
.board-skeleton {
  display: flex;
  flex-direction: column;
  height: calc(100% - 84px);
  padding-bottom: 26px;
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;
}

.columns-skeleton {
  display: flex;
  flex: 1;
  align-items: flex-start;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.75rem 1.25rem 0 0.375rem;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

/* ---------- column ---------- */
.column-skeleton {
  display: flex;
  flex-direction: column;
  min-width: 17rem;
  flex-shrink: 0;
  margin: 0 6px;
  border-radius: 0.75rem;
  box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  background: #c7c7c7;
}

.column-header-skeleton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 8px 8px 8px 12px;

  .title-bar {
    width: 80px;
    height: 14px;
  }

  .skeleton-circle {
    width: 24px;
    height: 24px;
  }
}

.column-body-skeleton {
  padding: 4px 4px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ---------- task card ---------- */
.task-card-skeleton {
  padding: 8px 12px;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-tags-skeleton {
  display: flex;
  gap: 4px;

  .tag-bar {
    width: 48px;
    height: 12px;
    border-radius: 2px;
  }

  .tag-bar-short {
    width: 32px;
  }
}

.card-title-skeleton {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .text-bar {
    width: 100%;
    height: 12px;
  }

  .text-bar-short {
    width: 60%;
  }
}

.card-meta-skeleton {
  display: flex;
  gap: 6px;
  margin-top: 2px;

  .meta-bar {
    width: 64px;
    height: 16px;
    border-radius: 3px;
  }

  .meta-bar-short {
    width: 48px;
  }
}

/* ---------- add task button ---------- */
.add-task-skeleton {
  flex-shrink: 0;
  padding: 6px 10px 10px;

  .add-bar {
    width: 100%;
    min-height: 40px;
    border: 1px solid #ccc;
    border-radius: 8px;
    height: 28px;
  }
}
</style>
