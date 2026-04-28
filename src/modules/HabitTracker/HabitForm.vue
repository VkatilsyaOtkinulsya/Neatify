<script setup lang="ts">
import type { HabitIconKey } from '@/shared/config/habitIcons';
import { HABIT_ICONS } from '@/shared/config/habitIcons';
import Input from '@/components/ui/input/Input.vue';
import { Select, SelectContent, SelectTrigger, SelectItem } from '@/components/ui/select';
import Button from '@/components/ui/button/Button.vue';

defineProps<{
  formName: string;
  formIcon: HabitIconKey | null;
  isEditing: boolean;
}>();

const emit = defineEmits<{
  'update:formName': [value: string];
  'update:formIcon': [value: HabitIconKey | null];
  submit: [];
  cancel: [];
}>();

const updateFormName = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:formName', target.value);
};

const updateFormIcon = (value: any) => {
  emit('update:formIcon', value as HabitIconKey);
};
</script>

<template>
  <form @submit.prevent="emit('submit')" class="habit-form">
    <Input :model-value="formName" @input="updateFormName" placeholder="Название" required />
    <Select :model-value="formIcon" @update:model-value="updateFormIcon">
      <SelectTrigger class="w-32 flex items-center gap-2">
        <component v-if="formIcon" :is="HABIT_ICONS[formIcon]?.component" class="w-4 h-4" />
        <span class="text-sm">
          {{ formIcon ? HABIT_ICONS[formIcon]?.label : 'Иконка' }}
        </span>
      </SelectTrigger>

      <SelectContent class="max-h-60">
        <div class="py-1">
          <SelectItem
            v-for="(icon, key) in HABIT_ICONS"
            :key="key"
            :value="key"
            class="flex items-center gap-2"
          >
            <component :is="icon.component" class="w-4 h-4 flex-shrink-0" />
            <span class="truncate">{{ icon.label }}</span>
          </SelectItem>
        </div>
      </SelectContent>
    </Select>
    <Button type="submit" size="sm">{{ isEditing ? 'Сохранить' : 'Добавить' }}</Button>
    <Button v-if="isEditing" type="button" variant="outline" size="sm" @click="emit('cancel')">
      Cancel
    </Button>
  </form>
</template>

<style scoped lang="scss">
.habit-form {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.habit-form > * {
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .habit-form {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
