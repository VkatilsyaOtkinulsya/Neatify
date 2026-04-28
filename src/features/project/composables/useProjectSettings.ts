import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useDebounceFn } from '@vueuse/core';
import { boardKeys } from '@/api/queries/useProject';
import type { Board, ProjectDetails, ProjectSettings } from '@/features/board/types/board.types';
import { showNotification } from '@/shared/lib/utils/error-handler';
import { BoardService } from '@/api/services/board.service';
import { ref, watch } from 'vue';
import type { Ref } from 'vue';

export function useProjectSettings(projectId: Ref<string>) {
  const savedKey = ref<keyof ProjectSettings | null>(null);

  const queryClient = useQueryClient();

  const { data: cached } = useQuery<ProjectDetails>({
    queryKey: boardKeys.detail(projectId),
    enabled: false,
  });

  const localSettings = ref<ProjectSettings | null>(
    cached.value?.settings ? { ...cached.value.settings } : null
  );

  const { mutate } = useMutation<
    Board,
    Error,
    ProjectSettings,
    { previous: ProjectDetails | undefined }
  >({
    mutationFn: (settings: ProjectSettings) =>
      BoardService.update(projectId.value, { settings: settings }),

    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({
        queryKey: boardKeys.detail(projectId.value),
      });

      const previous = queryClient.getQueryData<ProjectDetails>(boardKeys.detail(projectId.value));

      queryClient.setQueryData<ProjectDetails>(boardKeys.detail(projectId.value), (old) => {
        if (!old) return old;
        return { ...old, settings: { ...old.settings, ...newSettings } };
      });

      return { previous };
    },

    onError: (_err, _newSettings, context) => {
      // Откат и кэша и локального состояния
      if (context?.previous) {
        queryClient.setQueryData<ProjectDetails>(
          boardKeys.detail(projectId.value),
          context.previous
        );
        localSettings.value = { ...context.previous.settings };
      }
      showNotification('Не удалось обновить настройки, попробуйте позже', 'error');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(projectId.value) });
    },
  });

  watch(
    () => cached.value?.settings,
    (settings) => {
      if (settings && !localSettings.value) {
        localSettings.value = { ...settings };
      }
    },
    { immediate: true }
  );

  const debouncedMutate = useDebounceFn((settings: ProjectSettings, key: keyof ProjectSettings) => {
    mutate(settings, {
      onSuccess: () => {
        savedKey.value = key;
        setTimeout(() => (savedKey.value = null), 2000);
      },
    });
  }, 600);

  // Единственный метод для компонента
  function updateSetting<K extends keyof ProjectSettings>(key: K, value: ProjectSettings[K]): void {
    if (!localSettings.value) return;
    localSettings.value[key] = value;
    debouncedMutate({ ...localSettings.value }, key);
  }

  return { localSettings, updateSetting, savedKey };
}
