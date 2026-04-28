<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-vue-next';

interface Props {
  availableWidgets: Array<{ type: string; title: string; description: string; icon: any }>;
  addedWidgetTypes: string[];
  onAddWidget: (type: string) => void;
}

const props = defineProps<Props>();

const dialogOpen = ref(false);

const availableToAdd = computed(() => {
  if (!Array.isArray(props.availableWidgets)) return [];
  return props.availableWidgets.filter((w) => !props.addedWidgetTypes.includes(w.type));
});

const handleAddWidget = (type: string) => {
  props.onAddWidget(type);
  dialogOpen.value = false;
};
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <Button variant="outline" size="sm" class="gap-2 font-medium">
        <Plus :size="16" />
        Добавить виджет
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-lg">Добавить виджет</DialogTitle>
        <DialogDescription class="text-sm">
          Выберите виджет для добавления на страницу активности
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-2 py-4 max-h-96 overflow-y-auto">
        <div
          v-for="widget in availableToAdd"
          :key="widget.type"
          class="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200 hover:shadow-sm"
          @click="handleAddWidget(widget.type)"
        >
          <div class="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <component :is="widget.icon" class="w-5 h-5 text-primary" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-sm truncate">{{ widget.title }}</h4>
            <p class="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
              {{ widget.description }}
            </p>
          </div>
        </div>
        <div
          v-if="availableToAdd.length === 0"
          class="text-center text-sm text-muted-foreground py-8"
        >
          Нет доступных виджетов для добавления
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
