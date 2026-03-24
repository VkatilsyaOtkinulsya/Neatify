<script setup lang="ts">
import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date';
import { CalendarIcon } from 'lucide-vue-next';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/shared/lib/utils';
import { RangeCalendar } from '@/components/ui/range-calendar';
import { useDateRange } from '../../composables/useDateRange';

interface DateRange {
  startDate?: Date;
  dueDate?: Date;
}

const props = withDefaults(
  defineProps<{
    modelValue: DateRange;
  }>(),
  {
    modelValue: () => ({}),
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: DateRange): void;
}>();

const defaultPlaceholder = today(getLocalTimeZone());

const { rangeValue } = useDateRange(props.modelValue, (value) => {
  emit('update:modelValue', value);
});

const df = new DateFormatter('ru-RU', {
  day: 'numeric',
  month: 'long',
});

const formattedRange = computed(() => {
  const { startDate, dueDate } = props.modelValue;

  if (!startDate && !dueDate) return '';

  if (startDate && !dueDate) {
    return df.format(startDate);
  }

  if (startDate && dueDate) {
    return `${df.format(startDate)} — ${df.format(dueDate)}`;
  }

  return '';
});
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn('w-60 justify-start text-left font-normal', !formattedRange && 'text-muted-foreground')
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ formattedRange || 'Выберите период' }}
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-auto p-0 z-9999">
      <RangeCalendar
        v-model="rangeValue"
        :number-of-months="2"
        :default-placeholder="defaultPlaceholder"
        initial-focus
        class="rounded-md border shadow-sm"
      />
    </PopoverContent>
  </Popover>
</template>
