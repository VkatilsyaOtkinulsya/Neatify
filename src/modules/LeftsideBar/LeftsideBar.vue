<script setup lang="ts">
import NavItem from '@/components/ui/sidebar-item/NavItem.vue';
import Tooltip from '@/components/ui/tooltip/Tooltip.vue';
import FooterItem from '@/components/ui/sidebar-item/FooterItem.vue';
import Loader from '@/components/ui/loader/Loader.vue';
import SpaceItem from '@/components/ui/sidebar-item/SpaceItem.vue';
import {
  ActivityIcon,
  SpaceIcon,
  HelpIcon,
  SignoutIcon,
  MainIcon,
  ToggleIcon,
  ProjectItemIcon,
} from '@/components/icons/index.ts';
import { Target } from 'lucide-vue-next';
import { defineAsyncComponent, ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useCreateWorkspace } from '@/api/queries/useWorkspace';

interface Props {
  spaces: {
    id: string;
    title: string;
    memberCount?: number;
  }[];
  showLoader: boolean;
  displayName: string;
}

defineProps<Props>();

const Modal = defineAsyncComponent(() => import('@/components/ui/modal/Modal.vue'));

const authStore = useAuthStore();
const create = useCreateWorkspace();

const isOpened = ref(false);
const showModal = ref(false);
const elRef = ref<HTMLElement | null>(null);
const expandedWorkspaces = ref<Set<string>>(new Set());

const toggleSidebar = () => {
  isOpened.value = !isOpened.value;
};

const toggleWorkspace = (workspaceId: string) => {
  if (expandedWorkspaces.value.has(workspaceId)) {
    expandedWorkspaces.value.delete(workspaceId);
  } else {
    expandedWorkspaces.value.add(workspaceId);
  }
};

const logout = () => {
  localStorage.removeItem('spaces');
  authStore.logout();
};

const handleCreateWorkspace = (data: { title: string; description?: string }) => {
  create.mutate(data, {
    onSettled: () => {
      showModal.value = false;
    },
  });
};
</script>

<template>
  <aside class="leftside-bar" :class="{ 'leftside-bar--collapsed': !isOpened }">
    <div class="leftside-bar-navigation">
      <router-link to="/account" class="navigation__client">
        <div class="client__link-wrapper">
          <div class="client__link-icon">
            <img src="@/assets/images/client.jpg" alt="client" />
          </div>
          <div v-if="isOpened" class="client__link-name">{{ displayName }}</div>
        </div>
        <div class="navigation__client-toggle">
          <span ref="elRef" class="client__toggle-button" @click="toggleSidebar">
            <ToggleIcon :isOpened />
          </span>
          <Tooltip
            :target="elRef"
            :text="isOpened ? 'Свернуть боковую панель' : 'Развернуть боковую панель'"
            position="right"
            :disabled="isOpened"
          ></Tooltip>
        </div>
      </router-link>
      <div class="navigation__sections">
        <div class="navigation__sections-list">
          <router-link to="/main">
            <NavItem label="Главная" tooltipText="Главная" :isOpened>
              <template #icon>
                <MainIcon />
              </template>
            </NavItem>
          </router-link>
          <router-link to="/activity">
            <NavItem label="Активность" tooltipText="Активность" :isOpened>
              <template #icon><ActivityIcon /></template>
            </NavItem>
          </router-link>
        </div>
        <div class="content__wrapper">
          <div class="content__space-list">
            <div v-if="isOpened" class="space-list__title">Все пространства</div>
            <div class="space-list__add-space">
              <button
                id="add-space-button show-modal"
                @click="showModal = true"
                class="add-space__button"
              >
                <div class="add-icon"></div>
                <p v-if="isOpened">Добавить пространство</p>
              </button>
              <Teleport to="body">
                <Modal
                  type="create"
                  :is-visible="showModal"
                  @create="handleCreateWorkspace"
                  @close="showModal = false"
                />
              </Teleport>
            </div>
            <Loader v-if="showLoader" color="#fff" />
            <div v-else class="space-list">
              <div
                v-for="(workspace, index) in spaces"
                :key="workspace.id"
                class="space-list__item"
              >
                <div @click="toggleWorkspace(workspace.id)">
                  <SpaceItem
                    :workspace="{ id: workspace.id, name: workspace.title }"
                    :index
                    :isOpened
                  >
                    <template #icon>
                      <SpaceIcon />
                    </template>
                    <template #label> {{ workspace.title }} </template>
                  </SpaceItem>
                </div>
                <div
                  v-if="expandedWorkspaces.has(workspace.id)"
                  class="workspace-submenu"
                >
                  <router-link
                    :to="{
                      name: 'workspace-projects',
                      params: { workspaceId: workspace.id },
                    }"
                  >
                    <NavItem label="Проекты" tooltipText="Проекты" :isOpened>
                      <template #icon><ProjectItemIcon /></template>
                    </NavItem>
                  </router-link>
                  <router-link
                    :to="{
                      name: 'workspace-objectives',
                      params: { workspaceId: workspace.id },
                    }"
                  >
                    <NavItem label="Цели" tooltipText="Цели" :isOpened>
                      <template #icon><Target :size="18" /></template>
                    </NavItem>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="leftside-bar-footer">
      <FooterItem
        href="#"
        label="Помощь и начало работы"
        tooltipText="Помощь и начало работы"
        :is-opened
      >
        <template #icon>
          <HelpIcon />
        </template>
      </FooterItem>
      <router-link to="/signin" @click.prevent="logout">
        <FooterItem href="#" label="Выйти" tooltipText="Выйти" :is-opened :isButton="true">
          <template #icon>
            <SignoutIcon />
          </template>
        </FooterItem>
      </router-link>
    </div>
  </aside>
</template>

<style scoped lang="scss">
@use './LeftsideBar.module';
</style>
