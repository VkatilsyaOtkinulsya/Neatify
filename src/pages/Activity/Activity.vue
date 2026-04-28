<script setup lang="ts">
import { useActivityWidgets } from '@/shared/composables/useActivityWidgets';
import WidgetSelector from '@/components/ui/widgets/WidgetSelector.vue';
import WidgetCard from '@/components/ui/widgets/WidgetCard.vue';
import '@/modules/HabitTracker/registerHabitTrackerWidget';

const {
  widgets,
  availableWidgets,
  addedWidgetTypes,
  hasWidgets,
  addWidget,
  removeWidget,
  toggleMinimize,
} = useActivityWidgets();
</script>

<template>
  <div class="activity-page">
    <div class="activity-header">
      <h1 class="activity-title">Активность</h1>
      <WidgetSelector
        :available-widgets="availableWidgets"
        :added-widget-types="addedWidgetTypes"
        @add-widget="addWidget"
      />
    </div>

    <div v-if="!hasWidgets" class="empty-state">
      <div class="empty-state-content">
        <p class="empty-state-message">Вы ещё не добавили ни одного виджета.</p>
        <WidgetSelector
          :available-widgets="availableWidgets"
          :added-widget-types="addedWidgetTypes"
          @add-widget="addWidget"
        />
      </div>
    </div>

    <div v-else class="widgets-grid">
      <div class="widget-list">
        <WidgetCard
          v-for="widget in widgets"
          :key="widget.id"
          :title="widget.title"
          :is-minimized="widget.isMinimized"
          @remove="removeWidget(widget.id)"
          @toggle-minimize="toggleMinimize(widget.id)"
        >
          <component :is="widget.component" />
        </WidgetCard>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.activity-page {
  padding: 2.5rem;
  max-width: 1200px;
  margin: 0;
  min-height: calc(100vh - 4rem);
  width: 100%;
}

.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid hsl(var(--border));
  gap: 1rem;
}

.activity-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  color: hsl(var(--foreground));
  letter-spacing: -0.025em;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  border: 2px dashed hsl(var(--border));
  border-radius: 1rem;
  background: hsl(var(--muted) / 0.15);
  transition: all 0.2s ease;
}

.empty-state:hover {
  border-color: hsl(var(--primary) / 0.3);
  background: hsl(var(--muted) / 0.25);
}

.empty-state-content {
  text-align: center;
  padding: 1rem;
}

.empty-state-message {
  font-size: 1.125rem;
  color: hsl(var(--muted-foreground));
  margin-bottom: 1.5rem;
  font-weight: 400;
}

.widgets-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

.widget-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

@media (max-width: 1024px) {
  .activity-page {
    padding: 1.5rem;
  }

  .widgets-grid {
    gap: 1.5rem;
  }

  .widget-list {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .activity-page {
    padding: 1rem;
  }

  .activity-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .activity-title {
    font-size: 1.5rem;
  }

  .widgets-grid {
    gap: 1rem;
  }

  .widget-list {
    gap: 1rem;
  }

  .empty-state {
    min-height: 400px;
  }
}

@media (max-width: 480px) {
  .activity-page {
    padding: 0.75rem;
  }

  .activity-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  .activity-title {
    font-size: 1.25rem;
  }

  .empty-state {
    min-height: 300px;
    border-radius: 0.75rem;
  }

  .empty-state-message {
    font-size: 1rem;
  }

  .widgets-grid {
    gap: 0.75rem;
  }

  .widget-list {
    gap: 0.75rem;
  }
}
</style>
