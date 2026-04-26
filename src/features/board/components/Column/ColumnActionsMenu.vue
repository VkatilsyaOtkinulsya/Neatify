<script setup lang="ts">
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuShortcut from '@/components/ui/dropdown-menu/DropdownMenuShortcut.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue';

import { Bolt, Check, MoreVerticalIcon, Trash2 } from 'lucide-vue-next';

const emit = defineEmits(['move-left', 'move-right', 'complete', 'delete', 'open-settings']);

defineProps<{
  canUpdate?: boolean;
  canMove?: boolean;
  canDelete: boolean;
}>();

const openSettings = () => {
  emit('open-settings');
};

const handleDelete = () => {
  emit('delete');
};

const handleMove = (side: string) => {
  if (side === 'left') {
    emit('move-left');
  } else emit('move-right');
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger @click.stop class="w-8 h-8 p-2 cursor-pointer">
      <MoreVerticalIcon class="w-4 h-4 rounded-full" />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem v-if="canUpdate" @click="handleMove('left')">
        влево
        <DropdownMenuShortcut> <Check /> </DropdownMenuShortcut>
      </DropdownMenuItem>

      <DropdownMenuItem v-if="canUpdate" @click="handleMove('right')">
        вправо
        <DropdownMenuShortcut> <Check /> </DropdownMenuShortcut>
      </DropdownMenuItem>

      <DropdownMenuItem @click="openSettings">
        Настройки
        <DropdownMenuShortcut><Bolt /></DropdownMenuShortcut>
      </DropdownMenuItem>

      <DropdownMenuItem v-if="canDelete" @click="handleDelete">
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
