import { storeToRefs } from 'pinia';
import { useActivityWidgetsStore } from '@/stores/activityWidgets.store';

export function useActivityWidgets() {
  const store = useActivityWidgetsStore();

  const { enrichedWidgets, availableWidgets, addedWidgetTypes, hasWidgets } = storeToRefs(store);

  return {
    widgets: enrichedWidgets,
    availableWidgets,
    addedWidgetTypes,
    hasWidgets,
    addWidget: store.addWidget,
    removeWidget: store.removeWidget,
    toggleMinimize: store.toggleMinimize,
  };
}