<script setup lang="ts">
import { useHabitTracker } from '@/features/habit/composables/useHabitTracker';
import type {
  CreateHabitDto,
  HabitResponse,
  UpdateHabitDto,
} from '@/features/habit/types/habit.types';
import { ref, computed } from 'vue';
import { HABIT_ICONS, type HabitIconKey } from '@/shared/config/habitIcons';
import HabitForm from './HabitForm.vue';
import { useHabitMatrix } from '@/features/habit/composables/useHabitMatrix';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';

const from = new Date().toISOString().slice(0, 10);
const to = new Date().toISOString().slice(0, 10);

const { habits, logs, isLoading, createHabit, updateHabit, toggleHabit } = useHabitTracker(
  from,
  to
);

const { matrix } = useHabitMatrix(habits, logs, from, to);

const editingHabit = ref<HabitResponse | null>(null);
const formName = ref('');
const formIcon = ref<HabitIconKey | null>(null);

const isEditing = computed(() => !!editingHabit.value);

const closeForm = () => {
  editingHabit.value = null;
  formName.value = '';
  formIcon.value = null;
};

const handleSubmit = () => {
  if (!formIcon.value) return;
  if (isEditing.value) {
    updateHabit.mutate(
      {
        habitId: editingHabit.value!.id,
        dto: { name: formName.value, icon: formIcon.value } satisfies UpdateHabitDto,
      },
      { onSuccess: closeForm }
    );
  } else {
    createHabit.mutate({ name: formName.value, icon: formIcon.value } satisfies CreateHabitDto, {
      onSuccess: closeForm,
    });
  }
};

const handleToggle = (habitId: string, date: string, checkedState: boolean | 'indeterminate') => {
  const done = checkedState === true;
  toggleHabit.mutate({ habitId, date, done });
};

const orderedHabits = computed(() => [...habits.value].sort((a, b) => a.order - b.order));
</script>

<template>
  <div class="habit-tracker-widget">
    <HabitForm
      v-model:form-name="formName"
      v-model:form-icon="formIcon"
      :is-editing="isEditing"
      @submit="handleSubmit"
      @cancel="closeForm"
    />

    <div v-if="isLoading" class="loading-state">Loading...</div>

    <div v-else class="habit-content">
      <div class="habit-list">
        <h4 class="habit-list-title">Habits</h4>
        <div v-for="habit in orderedHabits" :key="habit.id" class="habit-list-item">
          <component :is="HABIT_ICONS[habit.icon]?.component" class="w-4 h-4" />
          <span :title="habit.name">{{ habit.name }}</span>
        </div>
      </div>

      <div class="habit-grid" :style="{ '--cols': habits.length }">
        <div class="cell header">Дата</div>

        <div v-for="habit in habits" :key="habit.id" class="cell header">
          <component :is="HABIT_ICONS[habit.icon]?.component" class="w-4 h-4" />
        </div>

        <template v-for="row in matrix" :key="row.date">
          <div class="cell date">
            {{ row.date }}
          </div>

          <div v-for="cell in row.habits" :key="cell.habitId" class="cell">
            <Checkbox
              type="checkbox"
              :model-value="cell.done"
              @update:model-value="handleToggle(cell.habitId, row.date, $event)"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.habit-tracker-widget {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: fit-content;
}

.loading-state {
  text-align: center;
  padding: 1.5rem;
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
}

.habit-content {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}

.habit-list {
  display: flex;
  flex-direction: column;
  gap: 0px;
  padding: 0.5rem 0.625rem;
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  min-width: 120px;
  max-width: 140px;
  background: hsl(var(--muted) / 0.2);
  flex-shrink: 0;
}

.habit-list-title {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.075em;
  color: hsl(var(--muted-foreground));
  margin: 0;
  padding-bottom: 0.375rem;
  margin-bottom: 0.25rem;
  border-bottom: 1px solid hsl(var(--border));
}

.habit-list-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: hsl(var(--foreground));
  height: 24px;
  overflow: hidden;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.habit-grid {
  display: grid;
  grid-template-columns: auto repeat(var(--cols), 24px);
  gap: 4px;
  align-content: start;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  font-size: 0.6875rem;
  white-space: nowrap;
}

.header {
  font-weight: 500;
  color: hsl(var(--muted-foreground));
}

.date {
  justify-content: flex-start;
  padding-right: 0.375rem;
  color: hsl(var(--muted-foreground));
  font-size: 0.6875rem;
}

@media (max-width: 480px) {
  .habit-content {
    flex-direction: column;
  }

  .habit-list {
    max-width: 100%;
    min-width: 100%;
  }
}
</style>
