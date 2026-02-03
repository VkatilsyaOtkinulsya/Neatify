<script setup lang="ts">
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuShortcut from '@/components/ui/dropdown-menu/DropdownMenuShortcut.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue';

import { Check, MoreVerticalIcon, Trash2 } from 'lucide-vue-next';

const emit = defineEmits(['edit', 'complete', 'delete']);

const handleDelete = () => {
  emit('delete');
};

const handleComplete = () => {
  emit('complete');
};

const handleEdit = () => {
  emit('edit');
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger @click.stop class="w-8 h-8 p-2 cursor-pointer hover:bg-gray">
      <MoreVerticalIcon class="w-4 h-4 rounded-full hover:bg-gray-300" />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @click="handleEdit">Редактировать </DropdownMenuItem>
      <DropdownMenuItem @click="handleComplete">
        Выполнить
        <DropdownMenuShortcut> <Check /> </DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleDelete">
        Удалить
        <DropdownMenuShortcut><Trash2 /></DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style lang="scss" scoped>
.actions {
  gap: 4px;
  font-size: 1rem;
  color: #5e5e5e;
}
</style>
