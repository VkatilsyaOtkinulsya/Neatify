<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Select from '@/components/ui/select/Select.vue';
import { defineStore } from 'pinia';

const props = defineProps<{
  modelValue: string[];
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const usersStore = defineStore('users', {});
const users = ref<Array<{ id: string; name: string }>>([]);
const selectedUserId = ref<string>('');

// onMounted(async () => {
//
//   await usersStore.fetchUsers();
//   users.value = usersStore.users.map((u) => ({ id: u.id, name: u.name }));
// });

const addAssignee = () => {
  if (!selectedUserId.value) return;
  if (props.modelValue.includes(selectedUserId.value)) return;

  emits('update:modelValue', [...props.modelValue, selectedUserId.value]);
  selectedUserId.value = '';
};

const removeAssignee = (userId: string) => {
  emits(
    'update:modelValue',
    props.modelValue.filter((id) => id !== userId)
  );
};

const getUserName = (userId: string): string => {
  return users.value.find((u) => u.id === userId)?.name || userId;
};
</script>

<template>
  <Popover>
    <div v-if="modelValue.length > 0" class="flex flex-wrap gap-2">
      <div
        v-for="userId in modelValue"
        :key="userId"
        class="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
      >
        {{ getUserName(userId) }}
        <button @click="removeAssignee(userId)" class="text-muted-foreground hover:text-foreground">
          ✕
        </button>
      </div>
    </div>

    <PopoverTrigger as-child>
      <Button variant="outline" :class="'w-70 justify-start text-left font-normal'">
        <Plus class="mr-2 h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <!-- Add assignee -->
      <div class="flex gap-2">
        <Select
          v-model="selectedUserId"
          :items="users.map((u) => u.name)"
          :item-values="users.map((u) => u.id)"
          class="flex-1"
          placeholder="Выберите исполнителя..."
        />
        <button
          @click="addAssignee"
          :disabled="!selectedUserId"
          class="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition"
        >
          +
        </button>
      </div>
    </PopoverContent>
  </Popover>
</template>
