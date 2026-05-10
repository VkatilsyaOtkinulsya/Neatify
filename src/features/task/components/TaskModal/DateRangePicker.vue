<script setup lang="ts">
import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date';
import { CalendarIcon } from 'lucide-vue-next';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/shared/lib/utils';
import { RangeCalendar } from '@/components/ui/range-calendar';
import { TimePicker } from '@/components/ui/time-picker';
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

const { rangeValue, dateToTimeString, updateDateTime } = useDateRange(props.modelValue, (value) => {
  emit('update:modelValue', value);
});

const startTime = computed({
  get: () => dateToTimeString(props.modelValue.startDate),
  set: (timeString: string) => {
    const newStartDate = updateDateTime(props.modelValue.startDate, timeString);
    emit('update:modelValue', {
      ...props.modelValue,
      startDate: newStartDate,
    });
  },
});

const dueTime = computed({
  get: () => dateToTimeString(props.modelValue.dueDate),
  set: (timeString: string) => {
    const newDueDate = updateDateTime(props.modelValue.dueDate, timeString);
    emit('update:modelValue', {
      ...props.modelValue,
      dueDate: newDueDate,
    });
  },
});

const formattedRange = computed(() => {
  const { startDate, dueDate } = props.modelValue;

  if (!startDate && !dueDate) return '';

  const dfWithTime = new DateFormatter('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (startDate && !dueDate) {
    return dfWithTime.format(startDate);
  }

  if (startDate && dueDate) {
    return `${dfWithTime.format(startDate)} — ${dfWithTime.format(dueDate)}`;
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
          cn('w-70 justify-start text-left font-normal', !formattedRange && 'text-muted-foreground')
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ formattedRange || 'Выберите период' }}
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-auto flex p-0 z-9999">
      <RangeCalendar
        v-model="rangeValue"
        :number-of-months="2"
        :default-placeholder="defaultPlaceholder"
        initial-focus
        class="rounded-md border shadow-sm"
      />

      <div class="p-4 border-t space-y-3">
        <div class="space-y-2">
          <label class="text-sm text-muted-foreground">Время начала</label>
          <TimePicker v-model="startTime" :disabled="!modelValue.startDate" />
        </div>
        <div class="space-y-2">
          <label class="text-sm text-muted-foreground">Время окончания</label>
          <TimePicker v-model="dueTime" :disabled="!modelValue.dueDate" />
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
