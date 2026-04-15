<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';

const emit = defineEmits(['save']);

const isOpen = defineModel<boolean>('isOpen');
const model = defineModel<{ taskLimit: number | null; color: string }>({ required: true });
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Настройки колонки</DialogTitle>
      </DialogHeader>

      <div class="grid gap-4">
        <div class="grid gap-3">
          <Label for="name-1">WIP-лимит задач</Label>
          <Input
            id="name-1"
            :model-value="model.taskLimit ?? 0"
            @update:model-value="
              (val) => {
                model.taskLimit = val === '' ? null : Number(val);
              }
            "
            type="number"
            name="name"
          />
        </div>
        <div class="grid gap-3">
          <Label for="username-1">Цвет колонки</Label>
          <input
            type="color"
            v-model="model.color"
            class="h-9 w-9 cursor-pointer rounded-md border p-1"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline"> Cancel </Button>
        </DialogClose>
        <Button type="submit" @click="emit('save', model)"> Save changes </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped></style>
