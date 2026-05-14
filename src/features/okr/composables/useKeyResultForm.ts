import { ref } from 'vue';
import type { CreateKeyResultDto, KeyResult, KRMetric } from '@/features/okr/types/okr.types';

export function useKeyResultForm(initialData?: KeyResult) {
  const formData = ref<{
    title: string;
    owner_id: string;
    weight: number;
    metricType: 'none' | 'number' | 'boolean';
    projects: Array<{ id: string; title: string }>;
    numberMetric?: {
      direction: 'increase' | 'decrease';
      unit: string;
      start: number;
      target: number;
    };
    booleanMetric?: boolean;
  }>({
    title: initialData?.title || '',
    owner_id: initialData?.owner_id || '',
    weight: initialData?.weight || 1,
    metricType: initialData?.metric
      ? initialData.metric.type
      : 'none',
    projects: initialData?.projects || [],
    numberMetric:
      initialData?.metric?.type === 'number'
        ? {
            direction: initialData.metric.direction,
            unit: initialData.metric.unit || '',
            start: initialData.metric.start,
            target: initialData.metric.target,
          }
        : undefined,
    booleanMetric:
      initialData?.metric?.type === 'boolean' ? initialData.metric.target : undefined,
  });

  const resetForm = () => {
    formData.value = {
      title: '',
      owner_id: '',
      weight: 1,
      metricType: 'none',
      projects: [],
      numberMetric: undefined,
      booleanMetric: undefined,
    };
  };

  const isFormValid = () => {
    if (!formData.value.title || !formData.value.owner_id) return false;
    if (formData.value.weight < 0 || formData.value.weight > 1) return false;

    if (formData.value.metricType === 'number') {
      const nm = formData.value.numberMetric;
      if (!nm || nm.start === undefined || nm.target === undefined) return false;

      // Валидация direction
      if (nm.direction === 'increase' && nm.start >= nm.target) return false;
      if (nm.direction === 'decrease' && nm.start <= nm.target) return false;
    }

    return true;
  };

  const getFormDto = (): CreateKeyResultDto => {
    let metric: KRMetric | undefined;

    if (formData.value.metricType === 'number' && formData.value.numberMetric) {
      metric = {
        type: 'number',
        direction: formData.value.numberMetric.direction,
        unit: formData.value.numberMetric.unit || undefined,
        start: formData.value.numberMetric.start,
        current: formData.value.numberMetric.start,
        target: formData.value.numberMetric.target,
      };
    } else if (formData.value.metricType === 'boolean') {
      metric = {
        type: 'boolean',
        current: false,
        target: true,
      };
    }

    return {
      title: formData.value.title,
      owner_id: formData.value.owner_id,
      weight: formData.value.weight,
      metric,
      projects: formData.value.projects.length > 0 ? formData.value.projects : undefined,
    };
  };

  return {
    formData,
    resetForm,
    isFormValid,
    getFormDto,
  };
}
