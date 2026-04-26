<script setup lang="ts">
import { useHabitTracker } from '@/features/habit/composables/useHabitTracker';
import type {
  CreateHabitDto,
  HabitResponse,
  UpdateHabitDto,
} from '@/features/habit/types/habit.types';
import { ref, computed } from 'vue';
import { HABIT_ICONS, type HabitIconKey } from '@/shared/config/habitIcons';
import Input from '@/components/ui/input/Input.vue';
import { Select, SelectContent, SelectTrigger, SelectItem } from '@/components/ui/select';
import Button from '@/components/ui/button/Button.vue';
import { useHabitMatrix } from '@/features/habit/composables/useHabitMatrix';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';

const from = new Date().toISOString().slice(0, 10);
const to = new Date().toISOString().slice(0, 10);

const { habits, logs, isLoading, createHabit, updateHabit, deleteHabit, toggleHabit } =
  useHabitTracker(from, to);

const { matrix } = useHabitMatrix(habits, logs, from, to);

// ─── Форма ────────────────────────────────────────────────────────────────────

const editingHabit = ref<HabitResponse | null>(null);
const formName = ref('');
const formIcon = ref<HabitIconKey | null>(null);

const isEditing = computed(() => !!editingHabit.value);

const openEdit = (habit: HabitResponse) => {
  editingHabit.value = habit;
  formName.value = habit.name;
  formIcon.value = habit.icon;
};

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
  <div class="w-full h-auto px-10 py-15">
    <form @submit.prevent="handleSubmit" class="flex gap-3 mb-5">
      <Input v-model="formName" placeholder="Название" required />
      <Select v-model="formIcon">
        <SelectTrigger class="w-50 flex items-center gap-2">
          <component v-if="formIcon" :is="HABIT_ICONS[formIcon]?.component" class="w-4 h-4" />
          <span>
            {{ formIcon ? HABIT_ICONS[formIcon]?.label : 'Выбери иконку' }}
          </span>
        </SelectTrigger>

        <SelectContent>
          <SelectItem
            v-for="(icon, key) in HABIT_ICONS"
            :key="key"
            :value="key"
            class="flex items-center gap-2"
          >
            <component :is="icon.component" class="w-4 h-4" />
            <span>{{ icon.label }}</span>
          </SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">{{ isEditing ? 'Сохранить' : 'Добавить' }}</Button>
      <Button v-if="isEditing" type="button" @click="closeForm">Отмена</Button>
    </form>

    <div v-if="isLoading">Загрузка...</div>

    <div class="flex">
      <div class="flex flex-col gap-2 py-1.5 px-2 border border-indigo-500 rounded-sm">
        <h3 class="font-bold">Список</h3>
        <p v-for="habit in orderedHabits" class="text-500" :key="habit.id">{{ habit.name }}</p>
      </div>

      <div class="habit-grid" :style="{ '--cols': habits.length }">
        <!-- corner -->
        <div class="cell header sticky">Дата</div>

        <!-- header -->
        <div v-for="habit in habits" :key="habit.id" class="cell header">
          <component :is="HABIT_ICONS[habit.icon]?.component" class="w-4 h-4" />
        </div>

        <!-- rows -->
        <template v-for="row in matrix" :key="row.date">
          <!-- date -->
          <div class="cell date">
            {{ row.date }}
          </div>

          <!-- habits -->
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
.habit-grid {
  display: grid;
  grid-template-columns: 140px repeat(var(--cols), 1fr);
  gap: 8px;
}

.header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
}

.header {
  font-weight: 500;
}

.date {
  justify-content: center;
  position: sticky;
  left: 0;
  background: white;
}
</style>
