<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DateRangePicker from '@/features/task/components/TaskModal/DateRangePicker.vue';
import { useObjectiveForm } from '@/features/okr/composables/useObjectiveForm';
import { Plus } from 'lucide-vue-next';
import type { CreateObjectiveDto } from '../types/okr.types';
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue';

interface Props {
  open: boolean;
  isPending?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isPending: false,
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'submit', data: CreateObjectiveDto): void;
}>();

const { formData, resetForm, isFormValid, getFormDto } = useObjectiveForm();

const showDialog = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

const handleSubmit = () => {
  if (!isFormValid()) return;

  emit('submit', getFormDto());
  resetForm();
};

const handleCancel = () => {
  showDialog.value = false;
  resetForm();
};
</script>

<template>
  <Dialog v-model:open="showDialog">
    <DialogTrigger as-child>
      <Button>
        <Plus :size="16" class="mr-2" />
        Создать цель
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Создать новую цель</DialogTitle>
        <DialogDescription class="sr-only">Форма цели</DialogDescription>
      </DialogHeader>
      <div class="objective-form">
        <div class="form-field">
          <label for="title">Название цели</label>
          <Input
            id="title"
            v-model="formData.title"
            placeholder="Например: Увеличить вовлеченность пользователей"
          />
        </div>
        <div class="form-field">
          <label for="description">Описание (опционально)</label>
          <Textarea
            id="description"
            v-model="formData.description"
            placeholder="Опишите цель подробнее..."
            rows="3"
          />
        </div>
        <div class="form-field">
          <label>Период</label>
          <DateRangePicker v-model="formData.period" />
        </div>
        <div class="form-actions">
          <Button variant="outline" @click="handleCancel">Отмена</Button>
          <Button @click="handleSubmit" :disabled="!isFormValid() || isPending">
            {{ isPending ? 'Создание...' : 'Создать' }}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped lang="scss">
.objective-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px 0;

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #111012;
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
  }
}
</style>
