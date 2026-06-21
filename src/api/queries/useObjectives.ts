import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { ObjectivesService } from '../services/objectives.service';
import type {
  CreateObjectiveDto,
  UpdateObjectiveDto,
  CreateKeyResultDto,
  UpdateKeyResultDto,
  UpdateMetricDto,
} from '@/features/okr/types/okr.types';
import { computed, type Ref } from 'vue';
import { handleApiError, showNotification } from '@/shared/lib/utils/error-handler';

export const objectiveKeys = {
  all: (workspaceId: string) => ['objectives', workspaceId] as const,
  detail: (workspaceId: string, objectiveId: string) =>
    ['objectives', workspaceId, objectiveId] as const,
};

export function useObjectives(workspaceId: Ref<string>) {
  return useQuery({
    queryKey: computed(() => objectiveKeys.all(workspaceId.value)),
    queryFn: () => ObjectivesService.getAll(workspaceId.value),
    staleTime: 30 * 1000,
    enabled: computed(() => !!workspaceId.value),
  });
}

export function useObjective(workspaceId: Ref<string>, objectiveId: Ref<string>) {
  return useQuery({
    queryKey: computed(() => objectiveKeys.detail(workspaceId.value, objectiveId.value)),
    queryFn: () => ObjectivesService.getById(workspaceId.value, objectiveId.value),
    staleTime: 30 * 1000,
    enabled: computed(() => !!workspaceId.value && !!objectiveId.value),
  });
}

export function useCreateObjective(workspaceId: Ref<string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateObjectiveDto) =>
      ObjectivesService.create(workspaceId.value, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: objectiveKeys.all(workspaceId.value) });
      showNotification('Цель создана', 'success');
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
}

export function useUpdateObjective(workspaceId: Ref<string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ objectiveId, data }: { objectiveId: string; data: UpdateObjectiveDto }) =>
      ObjectivesService.update(workspaceId.value, objectiveId, data),

    onSuccess: (_, { objectiveId }) => {
      queryClient.invalidateQueries({ queryKey: objectiveKeys.all(workspaceId.value) });
      queryClient.invalidateQueries({
        queryKey: objectiveKeys.detail(workspaceId.value, objectiveId),
      });
      showNotification('Цель обновлена', 'success');
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
}

export function useDeleteObjective(workspaceId: Ref<string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (objectiveId: string) =>
      ObjectivesService.delete(workspaceId.value, objectiveId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: objectiveKeys.all(workspaceId.value) });
      showNotification('Цель удалена', 'success');
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
}

export function useAddKeyResult(workspaceId: Ref<string>, objectiveId: Ref<string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateKeyResultDto) =>
      ObjectivesService.addKeyResult(workspaceId.value, objectiveId.value, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: objectiveKeys.detail(workspaceId.value, objectiveId.value),
      });
      queryClient.invalidateQueries({ queryKey: objectiveKeys.all(workspaceId.value) });
      showNotification('Ключевой результат добавлен', 'success');
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
}

export function useUpdateKeyResult(workspaceId: Ref<string>, objectiveId: Ref<string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ krId, data }: { krId: string; data: UpdateKeyResultDto }) =>
      ObjectivesService.updateKeyResult(workspaceId.value, objectiveId.value, krId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: objectiveKeys.detail(workspaceId.value, objectiveId.value),
      });
      queryClient.invalidateQueries({ queryKey: objectiveKeys.all(workspaceId.value) });
      showNotification('Ключевой результат обновлен', 'success');
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
}

export function useStartKeyResult(workspaceId: Ref<string>, objectiveId: Ref<string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (krId: string) =>
      ObjectivesService.startKeyResult(workspaceId.value, objectiveId.value, krId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: objectiveKeys.detail(workspaceId.value, objectiveId.value),
      });
      queryClient.invalidateQueries({ queryKey: objectiveKeys.all(workspaceId.value) });
      showNotification('Ключевой результат запущен', 'success');
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
}

export function useDeleteKeyResult(workspaceId: Ref<string>, objectiveId: Ref<string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (krId: string) =>
      ObjectivesService.deleteKeyResult(workspaceId.value, objectiveId.value, krId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: objectiveKeys.detail(workspaceId.value, objectiveId.value),
      });
      queryClient.invalidateQueries({ queryKey: objectiveKeys.all(workspaceId.value) });
      showNotification('Ключевой результат удален', 'success');
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
}

export function useUpdateMetric(workspaceId: Ref<string>, objectiveId: Ref<string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ krId, data }: { krId: string; data: UpdateMetricDto }) =>
      ObjectivesService.updateMetric(workspaceId.value, objectiveId.value, krId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: objectiveKeys.detail(workspaceId.value, objectiveId.value),
      });
      queryClient.invalidateQueries({ queryKey: objectiveKeys.all(workspaceId.value) });
      showNotification('Метрика обновлена', 'success');
    },

    onError: (err) => {
      handleApiError(err);
    },
  });
}
