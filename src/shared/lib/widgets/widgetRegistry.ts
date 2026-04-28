import type { WidgetDefinition } from '@/shared/types/widget.types';

class WidgetRegistry {
  private widgets: Map<string, WidgetDefinition> = new Map();

  register(definition: WidgetDefinition): void {
    this.widgets.set(definition.type, definition);
  }

  get(type: string): WidgetDefinition | undefined {
    return this.widgets.get(type);
  }

  getAll(): WidgetDefinition[] {
    return Array.from(this.widgets.values());
  }

  has(type: string): boolean {
    return this.widgets.has(type);
  }
}

export const widgetRegistry = new WidgetRegistry();