import { computed, ref, toValue, watch } from 'vue';
import type { MaybeRef } from 'vue';
import { watchDebounced } from '@vueuse/core';
import type { Task, Tag } from '@/features/task/types/task.types';

export interface ColumnWithTasks {
  id: string;
  title: string;
  tasks: Task[];
}

export function useTableFilters(tasksByColumn: MaybeRef<{ [key: string]: Task[] }>) {
  const searchQueryRaw = ref<string>('');
  const searchQuery = ref<string>('');
  const selectedTags = ref<string[]>([]);

  watchDebounced(
    searchQueryRaw,
    (value) => {
      searchQuery.value = value;
    },
    { debounce: 300 }
  );

  const availableTags = computed(() => {
    const tagsMap = new Map<string, Tag>();
    const data = toValue(tasksByColumn);

    Object.values(data).forEach((tasks) => {
      tasks.forEach((task) => {
        task.tags.forEach((tag) => {
          if (!tagsMap.has(tag.title)) {
            tagsMap.set(tag.title, tag);
          }
        });
      });
    });

    return Array.from(tagsMap.values());
  });

  const toggleTag = (tagTitle: string, checked: boolean) => {
    if (checked) {
      selectedTags.value = [...selectedTags.value, tagTitle];
    } else {
      selectedTags.value = selectedTags.value.filter((t) => t !== tagTitle);
    }
  };

  const applyFilters = (columns: ColumnWithTasks[]): ColumnWithTasks[] => {
    return columns.map((column) => {
      let tasks = column.tasks;

      // Фильтр по текстовому поиску
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        tasks = tasks.filter((task) => task.title.toLowerCase().includes(query));
      }

      // Фильтр по тегам (AND-логика)
      if (selectedTags.value.length > 0) {
        tasks = tasks.filter((task) => {
          const taskTagTitles = new Set(task.tags.map((t) => t.title));
          return selectedTags.value.every((selectedTag) => taskTagTitles.has(selectedTag));
        });
      }

      return {
        id: column.id,
        title: column.title,
        tasks,
      };
    });
  };

  return {
    searchQueryRaw,
    searchQuery,
    selectedTags,
    availableTags,
    toggleTag,
    applyFilters,
  };
}
