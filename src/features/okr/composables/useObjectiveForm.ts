import { ref } from 'vue';
import type { CreateObjectiveDto } from '@/features/okr/types/okr.types';

export function useObjectiveForm() {
  const formData = ref<{
    title: string;
    description: string;
    period: { startDate?: Date; dueDate?: Date };
  }>({
    title: '',
    description: '',
    period: {},
  });

  const resetForm = () => {
    formData.value = {
      title: '',
      description: '',
      period: {},
    };
  };

  const isFormValid = () => {
    return !!(
      formData.value.title &&
      formData.value.period.startDate &&
      formData.value.period.dueDate
    );
  };

  const getFormDto = (): CreateObjectiveDto => {
    return {
      title: formData.value.title,
      description: formData.value.description || undefined,
      period: {
        start: formData.value.period.startDate!.toISOString(),
        end: formData.value.period.dueDate!.toISOString(),
      },
      status: 'active',
    };
  };

  return {
    formData,
    resetForm,
    isFormValid,
    getFormDto,
  };
}
