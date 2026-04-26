<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-vue-next';
import { ref } from 'vue';
import Textarea from '../textarea/Textarea.vue';
import Button from '../button/Button.vue';
import Input from '../selfmade-input/Input.vue';
import type { CreateProjectDto } from '@/features/board/types/board.types';

const title = ref<string>('');
const titleError = ref('');
const description = ref<string>('');
const isPersonal = ref<boolean>(false);
const isCreateDialogOpen = ref(false);

defineProps<{
  isCreatePending: boolean;
}>();

const emit = defineEmits<{
  'create-project': [data: CreateProjectDto];
}>();

const handleCreate = () => {
  if (!title.value.trim()) {
    titleError.value = 'Введите название проекта';
    return;
  }

  titleError.value = '';

  emit('create-project', {
    title: title.value,
    description: description.value,
    isPersonal: isPersonal.value,
  });
  isCreateDialogOpen.value = false;

  title.value = '';
  description.value = '';
  isPersonal.value = false;
};
</script>

<template>
  <Dialog :open="isCreateDialogOpen" @update:open="isCreateDialogOpen = $event">
    <DialogTrigger class="w-full">
      <div
        variant="ghost"
        className="w-full flex items-center p-2\.5 justify-center gap-2.5 h-auto bg-[rgba(17,16,18,0.05)] hover:bg-[rgba(17,16,18,0.1)] p-2.5 rounded-[6px] border-none transition ease-in duration-200"
      >
        <PlusIcon className="h-4 w-4 text-[#111012]/70" />
        <span className="text-sm font-medium text-[#111012]/70"> Добавить проект </span>
      </div>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Добавить проект</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
        <div class="grid w-full gap-1.5">
          <Input
            class="modal-input"
            :class="{ 'border-red-500': titleError }"
            v-model="title"
            type="text"
            placeholder="Название проекта"
            required
          />
          <p v-if="titleError" class="text-sm text-red-500">
            {{ titleError }}
          </p>
          <Textarea class="modal-input" v-model="description" placeholder="Описание" />

          <div class="project-type-selector">
            <label class="project-type-option" :class="{ active: isPersonal }">
              <input type="radio" v-model="isPersonal" :value="true" class="sr-only" />
              <span class="radio-circle">
                <span v-if="isPersonal" class="radio-dot"></span>
              </span>
              Личный проект
            </label>
            <label class="project-type-option" :class="{ active: !isPersonal }">
              <input type="radio" v-model="isPersonal" :value="false" class="sr-only" />
              <span class="radio-circle">
                <span v-if="!isPersonal" class="radio-dot"></span>
              </span>
              Командный проект
            </label>
          </div>
        </div>
      </DialogHeader>

      <DialogFooter>
        <Button type="submit" @click="handleCreate" :disabled="!title.trim() || isCreatePending"
          >Создать</Button
        >
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped lang="scss">
.modal-input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid rgb(229, 231, 235);
  border-radius: 6px;
  box-sizing: border-box;

  &:focus {
    border-color: #85deab;
  }
}

.project-type-selector {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.project-type-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: #111012;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgb(229, 231, 235);
  transition: all 0.2s ease;

  &.active {
    border-color: #85deab;
    background-color: rgba(133, 222, 171, 0.08);
  }

  &:hover {
    background-color: rgba(17, 16, 18, 0.03);
  }
}

.radio-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #ccc;
  transition: border-color 0.2s ease;

  .active & {
    border-color: #85deab;
  }
}

.radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #85deab;
}
</style>
