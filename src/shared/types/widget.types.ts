export interface WidgetConfig {
  id: string;
  type: string;
  isMinimized: boolean;
}

export interface WidgetDefinition {
  type: string;
  title: string;
  description: string;
  icon: any;
  component: any;
}

export interface WidgetState {
  widgets: WidgetConfig[];
}

export interface EnrichedWidget extends WidgetDefinition {
  id: string;
  isMinimized: boolean;
}
