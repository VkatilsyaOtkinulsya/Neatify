<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Button from '@/components/ui/button/Button.vue';
import { useUsersStore } from '@/stores/users.store';
import { Check, CircleUser, Trash2, UserRoundPlus } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { MemberRole } from '@/shared/types/user.types';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import Label from '@/components/ui/label/Label.vue';
import { useProjectSettings } from '@/features/project/composables/useProjectSettings';
import type { ProjectSettings } from '@/features/board/types/board.types';
import AddMemberDialog from './AddMemberDialog.vue';
import { MemberRoleEnum } from '@/shared/types/roles';

type SettingKey = keyof ProjectSettings;

const settingsConfig: { key: SettingKey; label: string }[] = [
  { key: 'isPublic', label: 'Публичный проект' },
  { key: 'allowComments', label: 'Включить комментарии' },
  { key: 'requireEstimates', label: 'Требовать оценки' },
  { key: 'allowMemberEditing', label: 'Разрешить редактирование участникам' },
  { key: 'enableTimeTracking', label: 'Трекинг времени' },
] as const;

const emit = defineEmits<{
  'delete-project': [id: string];
}>();

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);

const route = useRoute();
const projectId = computed(() => route.params.projectId as string);

const { localSettings, updateSetting, savedKey } = useProjectSettings(projectId);

const isDeleteDialogOpen = ref(false);
const removeUserId = ref<string | null>(null);

const isAddMemberDialogOpen = ref(false);
const form = reactive<{ email: string; role: MemberRole }>({
  email: '',
  role: MemberRoleEnum.MEMBER as MemberRole,
});

const openDeleteDialog = (id: string) => {
  removeUserId.value = id;
  isDeleteDialogOpen.value = true;
};

const confirmDelete = () => {
  if (!removeUserId.value) return;

  usersStore.removeMember(projectId.value, removeUserId.value);

  isDeleteDialogOpen.value = false;
  removeUserId.value = null;
};

const handleAddMember = () => {
  if (!form.email) return;
  if (form.role === null) return;

  usersStore.addMember(projectId.value, { ...form });
  form.email = '';
  form.role = MemberRoleEnum.MEMBER;
};
</script>

<template>
  <div class="flex flex-col w-full p-3 pl-5 overflow-hidden box-border gap-4">
    <div class="font-bold"><p>Настройки</p></div>
    <div>
      <table class="table-auto mb-3">
        <tbody>
          <tr v-for="user in users" :key="user.userId">
            <td v-if="user.profile.avatar">{{ user.profile.avatar }}</td>
            <td v-else><CircleUser /></td>

            <td>{{ user.profile.displayName }}</td>
            <td>{{ user.role }}</td>
            <td @click.stop="openDeleteDialog(user.userId)"><Trash2 /></td>
          </tr>
        </tbody>
      </table>

      <Button @click="isAddMemberDialogOpen = true" variant="outline" class="flex space-y-2">
        <UserRoundPlus class="m-0" />
        <p class="font-medium leading-none">Добавить участника</p>
      </Button>
    </div>

    <div v-for="item in settingsConfig" :key="item.key" class="flex items-center space-x-2">
      <Checkbox
        :id="item.key"
        :modelValue="localSettings?.[item.key]"
        @update:modelValue="(v: any) => updateSetting(item.key, v)"
      />

      <Label :for="item.key">
        {{ item.label }}
      </Label>

      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <Check v-if="savedKey === item.key" class="size-4 text-green-500" />
      </Transition>
    </div>

    <div>
      <Button
        variant="outline"
        @click="emit('delete-project', projectId)"
        class="bg-red-600 hover:bg-red-700"
      >
        <p class="font-medium leading-none text-white">Удалить проект</p>
      </Button>
    </div>
  </div>

  <Teleport to="body">
    <AddMemberDialog
      v-model:open="isAddMemberDialogOpen"
      v-model="form"
      @submit="handleAddMember"
    />
  </Teleport>

  <AlertDialog :open="isDeleteDialogOpen" @update:open="isDeleteDialogOpen = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Удалить участника?</AlertDialogTitle>
        <AlertDialogDescription> Это действие нельзя отменить. </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>Отмена</AlertDialogCancel>
        <AlertDialogAction @click="confirmDelete" class="bg-red-600 hover:bg-red-700">
          Удалить
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style lang="scss" scoped>
thead {
  font-size: 0.875rem;
}
th,
td {
  padding: calc(var(--spacing) * 2);
}

td {
  text-align: center;
}
</style>
