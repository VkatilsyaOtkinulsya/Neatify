import type { InjectionKey } from 'vue';

export interface ProjectContext {
  isPersonal: boolean;
}

export const PROJECT_CONTEXT_KEY: InjectionKey<ProjectContext> = Symbol('projectContext');