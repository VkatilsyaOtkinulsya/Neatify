import { ChevronDown, ChevronUp, ChevronsUp } from 'lucide-vue-next';
import type { Component } from 'vue';

export const TaskPriorityMap: Record<string, Component> = {
  'low': ChevronDown,
  'medium': ChevronUp,
  'high': ChevronsUp,
  'urgent': ChevronsUp,
} as const;
