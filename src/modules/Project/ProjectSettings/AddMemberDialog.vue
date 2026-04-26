<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MemberRoleEnum } from '@/shared/types/roles';
import type { MemberRole } from '@/shared/types/user.types';

const MemberRoleLabels: Record<MemberRole, string> = {
  owner: 'Владелец',
  admin: 'Админ',
  member: 'Участник',
  viewer: 'Наблюдатель',
};

const open = defineModel<boolean>('open');

const model = defineModel<{
  email: string;
  role: MemberRole;
}>();

const emit = defineEmits<{
  submit: [typeof model.value];
}>();

const handleSubmit = () => {
  emit('submit', model.value);
  open.value = false;
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-106.25">
      <form @submit.prevent="handleSubmit">
        <DialogHeader>
          <DialogTitle>Добавить участника</DialogTitle>
          <DialogDescription class="sr-only">
            Введите email и выберите роль нового участника
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4">
          <div class="grid gap-3">
            <Label for="name-1">Email</Label>
            <Input id="name-1" name="name" v-model="model!.email" />
          </div>
          <div class="grid gap-3">
            <Label for="role-1">Роль</Label>
            <Select v-model="model!.role">
              <SelectTrigger class="w-45">
                <SelectValue placeholder="Выбрать роль" />
                <SelectContent>
                  <SelectItem
                    v-for="role in Object.values(MemberRoleEnum)"
                    :key="role"
                    :value="role"
                  >
                    <span>{{ MemberRoleLabels[role] }}</span>
                  </SelectItem>
                </SelectContent>
              </SelectTrigger>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline" @click="open = false"> Отменить </Button>
          </DialogClose>
          <Button type="submit"> Добавить </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped></style>
