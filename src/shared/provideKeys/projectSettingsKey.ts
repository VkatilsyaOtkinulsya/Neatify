import type { InjectionKey, Ref } from 'vue';

export interface SettingsContext {
  allowComments: Ref<boolean>;
  allowMemberEditing: Ref<boolean>;
  enableTimeTracking: Ref<boolean>;
  requireEstimates: Ref<boolean>;
  isPublic: Ref<boolean>;
}

export const SETTINGS_KEY: InjectionKey<SettingsContext> = Symbol('settings');
