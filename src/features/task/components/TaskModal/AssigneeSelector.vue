<script setup lang="ts">
import { CircleUser, Plus } from 'lucide-vue-next';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { useUsersStore } from '@/stores/users.store';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string[];
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const { users } = useUsersStore();

const selectedUserId = ref<string>('');

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
  const user = users.find((u) => u.userId === userId.toString());
  return user?.profile?.displayName ?? '';
};

const availableAssignees = computed(() => {
  return users
    .filter((user) => !props.modelValue.includes(String(user.userId)))
    .map((user) => ({
      value: String(user.userId),
      label: user.profile?.displayName || user.userId,
    }));
});
</script>

<template>
  <Popover>
    <div v-if="modelValue.length > 0" class="flex flex-wrap gap-2">
      <div
        v-for="userId in modelValue"
        :key="userId"
        class="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
      >
        <CircleUser />
        {{ getUserName(userId) }}
        <button @click="removeAssignee(userId)" class="text-muted-foreground hover:text-foreground">
          ✕
        </button>
      </div>
    </div>

    <PopoverTrigger as-child>
      <Button variant="outline" :class="'w-[45%] justify-start text-left font-normal'">
        <Plus class="mr-2 h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-full p-0 z-9999">
      <div class="flex w-full gap-1">
        <Select v-model="selectedUserId" class="flex-1">
          <SelectTrigger>
            <SelectValue placeholder="Выберите исполнителя..." />
          </SelectTrigger>

          <SelectContent class="z-9999">
            <SelectItem
              v-for="user in availableAssignees"
              :key="user.value"
              :value="String(user.value)"
            >
              {{ user.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <button
          @click="addAssignee"
          :disabled="!selectedUserId"
          class="flex flex-1 h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition"
        >
          +
        </button>
      </div>
    </PopoverContent>
  </Popover>
</template>
