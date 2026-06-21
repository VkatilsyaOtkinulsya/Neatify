<script setup lang="ts">
import { computed, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RangeSlider from './RangeSlider.vue';
import { useKeyResultForm } from '@/features/okr/composables/useKeyResultForm';
import { useWorkspaceProjects } from '@/features/okr/composables/useWorkspaceProjects';
import { useAuthStore } from '@/stores/auth.store';
import type { CreateKeyResultDto, KeyResult } from '@/features/okr/types/okr.types';

interface Props {
  open: boolean;
  isPending?: boolean;
  mode?: 'create' | 'edit';
  initialData?: KeyResult;
  availableWeight?: number;
  workspaceId: string;
}

const props = withDefaults(defineProps<Props>(), {
  isPending: false,
  mode: 'create',
  availableWeight: 1,
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'submit', data: CreateKeyResultDto): void;
}>();

const authStore = useAuthStore();
const { formData, resetForm, isFormValid, getFormDto } = useKeyResultForm(props.initialData);

const workspaceIdRef = computed(() => props.workspaceId);
const { projects } = useWorkspaceProjects(workspaceIdRef);

// Автоматически устанавливаем owner_id из authStore
if (!formData.value.owner_id) {
  formData.value.owner_id = authStore.userInfo.id;
}

// Устанавливаем начальный вес в доступный максимум
if (props.mode === 'create' && formData.value.weight === 1) {
  formData.value.weight = props.availableWeight;
}

const showDialog = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

watch(
  () => props.initialData,
  (newData) => {
    if (newData && props.mode === 'edit') {
      formData.value.title = newData.title;
      formData.value.owner_id = newData.owner_id;
      formData.value.weight = newData.weight;
      formData.value.metricType = newData.metric ? newData.metric.type : 'none';

      if (newData.metric?.type === 'number') {
        formData.value.numberMetric = {
          direction: newData.metric.direction,
          unit: newData.metric.unit || '',
          start: newData.metric.start,
          target: newData.metric.target,
        };
      }
    }
  }
);

// Инициализация numberMetric при выборе типа
watch(
  () => formData.value.metricType,
  (newType) => {
    if (newType === 'number' && !formData.value.numberMetric) {
      formData.value.numberMetric = {
        direction: 'increase',
        unit: '',
        start: 0,
        target: 100,
      };
    }
  }
);

// Сброс формы при закрытии диалога
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      resetForm();
      formData.value.owner_id = authStore.userInfo.id;
      formData.value.weight = props.availableWeight;
    }
  }
);

const handleSubmit = () => {
  if (!isFormValid()) return;

  emit('submit', getFormDto());
  resetForm();
  // Восстанавливаем owner_id и вес после сброса
  formData.value.owner_id = authStore.userInfo.id;
  formData.value.weight = props.availableWeight;
};

const handleCancel = () => {
  showDialog.value = false;
  resetForm();
  // Восстанавливаем owner_id и вес после сброса
  formData.value.owner_id = authStore.userInfo.id;
  formData.value.weight = props.availableWeight;
};

const weightPercent = computed({
  get: () => [Math.round(formData.value.weight * 100)],
  set: (value: number[]) => {
    formData.value.weight = value[0] / 100;
  },
});

const maxWeightPercent = computed(() => Math.round(props.availableWeight * 100));

const selectedProjectId = computed({
  get: () => formData.value.projects[0]?.id || '',
  set: (value: string) => {
    if (value) {
      const project = projects.value.find((p) => p.id === value);
      if (project) {
        formData.value.projects = [project];
      }
    } else {
      formData.value.projects = [];
    }
  },
});
</script>

<template>
  <Dialog v-model:open="showDialog">
    <DialogContent class="sm:max-w-125">
      <DialogHeader>
        <DialogTitle>{{
          mode === 'create' ? 'Создать ключевой результат' : 'Редактировать ключевой результат'
        }}</DialogTitle>
        <DialogDescription class="sr-only">Форма ключевого результата</DialogDescription>
      </DialogHeader>
      <div class="kr-form">
        <div class="form-field">
          <label for="kr-title">Название</label>
          <Input
            id="kr-title"
            v-model="formData.title"
            placeholder="Например: Увеличить конверсию на 20%"
          />
        </div>

        <div class="form-field">
          <label for="kr-weight"
            >Вес: {{ weightPercent[0] }}% (доступно: {{ maxWeightPercent }}%)</label
          >
          <Slider
            id="kr-weight"
            v-model="weightPercent"
            :min="1"
            :max="maxWeightPercent"
            :step="1"
          />
        </div>

        <div class="form-field">
          <label for="kr-projects">Связанные проекты (опционально)</label>
          <Select v-model="selectedProjectId">
            <SelectTrigger id="kr-projects">
              <SelectValue placeholder="Выберите проект" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.title }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="form-field">
          <label for="kr-metric-type">Тип метрики</label>
          <NativeSelect id="kr-metric-type" v-model="formData.metricType">
            <option value="none">Без метрики</option>
            <option value="number">Числовая</option>
            <option value="boolean">Булева</option>
          </NativeSelect>
        </div>

        <div v-if="formData.metricType === 'number'" class="metric-fields">
          <div class="form-field">
            <label for="metric-direction">Направление</label>
            <NativeSelect id="metric-direction" v-model="formData.numberMetric!.direction">
              <option value="increase">Увеличение</option>
              <option value="decrease">Уменьшение</option>
            </NativeSelect>
          </div>

          <div class="form-field">
            <label for="metric-unit">Единица измерения</label>
            <Input
              id="metric-unit"
              v-model="formData.numberMetric!.unit"
              placeholder="%, шт, руб"
            />
          </div>

          <div class="form-field">
            <label>Диапазон значений</label>
            <RangeSlider
              v-model="formData.numberMetric"
              :direction="formData.numberMetric!.direction"
              :min="0"
              :max="100"
              :step="1"
            />
          </div>
        </div>

        <div class="form-actions">
          <Button variant="outline" @click="handleCancel">Отмена</Button>
          <Button @click="handleSubmit" :disabled="!isFormValid() || isPending">
            {{ isPending ? 'Сохранение...' : mode === 'create' ? 'Создать' : 'Сохранить' }}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped lang="scss">
.kr-form {
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

  .metric-fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    background-color: #f5f5f5;
    border-radius: 8px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
  }
}
</style>
