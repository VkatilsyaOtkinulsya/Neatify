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

const name = ref('');
</script>

<template>
  <Dialog>
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
            :modelValue="name"
            type="text"
            placeholder="Название проекта"
            required
          />
          <Textarea class="modal-input" placeholder="Описание" />
        </div>
      </DialogHeader>

      <DialogFooter>
        <Button type="submit">Создать</Button>
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
</style>
