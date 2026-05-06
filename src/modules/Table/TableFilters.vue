<script setup lang="ts">
import { computed } from 'vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import type { Tag } from '@/features/task/types/task.types';

interface Props {
  searchQuery: string;
  selectedTags: string[];
  availableTags: Tag[];
}

interface Emits {
  (e: 'update:searchQuery', value: string): void;
  (e: 'toggleTag', tagTitle: string, checked: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const searchQueryModel = computed({
  get: () => props.searchQuery,
  set: (value) => emit('update:searchQuery', value),
});
</script>

<template>
  <div class="filters-panel">
    <div class="filter-group">
      <Label for="search">Поиск по названию</Label>
      <Input
        id="search"
        v-model="searchQueryModel"
        placeholder="Введите название задачи..."
        class="w-full"
      />
    </div>

    <div v-if="availableTags.length > 0" class="filter-group">
      <Label>Фильтр по тегам</Label>
      <div class="tags-filter">
        <div v-for="tag in availableTags" :key="tag.title" class="tag-checkbox-item">
          <Checkbox
            :id="`tag-${tag.title}`"
            :checked="selectedTags.includes(tag.title)"
            @update:model-value="(checked: any) => emit('toggleTag', tag.title, checked)"
          />
          <Label :for="`tag-${tag.title}`" class="cursor-pointer">
            <Badge :color="tag.color">{{ tag.title }}</Badge>
          </Label>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filters-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: var(--muted);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
