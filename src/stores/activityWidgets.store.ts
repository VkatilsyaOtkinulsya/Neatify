import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { widgetRegistry } from '@/shared/lib/widgets/widgetRegistry';
import type { WidgetConfig, WidgetDefinition } from '@/shared/types/widget.types';

export interface EnrichedWidget extends WidgetDefinition {
  id: string;
  isMinimized: boolean;
}

export const useActivityWidgetsStore = defineStore(
  'activityWidgets',
  () => {
    const widgets = ref<WidgetConfig[]>([]);

    const availableWidgets = computed<WidgetDefinition[]>(() => widgetRegistry.getAll());

    const addedWidgetTypes = computed(() => widgets.value.map((w) => w.type));

    const hasWidgets = computed(() => widgets.value.length > 0);

    const getWidgetById = (id: string): WidgetConfig | undefined => {
      return widgets.value.find((w) => w.id === id);
    };

    const enrichedWidgets = computed<EnrichedWidget[]>(() => {
      const result = widgets.value
        .map((widget) => {
          const definition = widgetRegistry.get(widget.type);
          if (!definition) return null;
          return {
            ...definition,
            id: widget.id,
            isMinimized: widget.isMinimized,
          };
        })
        .filter((w): w is EnrichedWidget => w !== null);
      return result;
    });

    const addWidget = (type: string) => {
      const definition = widgetRegistry.get(type);
      if (!definition) return;

      const widget: WidgetConfig = {
        id: `${type}-${Date.now()}`,
        type,
        isMinimized: false,
      };

      widgets.value.push(widget);
    };

    const removeWidget = (id: string) => {
      widgets.value = widgets.value.filter((w) => w.id !== id);
    };

    const toggleMinimize = (id: string) => {
      const widget = getWidgetById(id);
      if (widget) {
        widget.isMinimized = !widget.isMinimized;
      }
    };

    const clearWidgets = () => {
      widgets.value = [];
    };

    return {
      widgets,
      availableWidgets,
      addedWidgetTypes,
      hasWidgets,
      getWidgetById,
      enrichedWidgets,
      addWidget,
      removeWidget,
      toggleMinimize,
      clearWidgets,
    };
  },
  {
    persist: {
      key: 'activity-widgets',
      storage: localStorage,
      pick: ['widgets'],
    },
  }
);
