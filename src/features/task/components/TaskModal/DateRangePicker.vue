<script setup lang="ts">
import type { DateValue } from '@internationalized/date';
import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date';
import { CalendarIcon } from 'lucide-vue-next';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/shared/lib/utils';

interface DateRange {
  startDate?: Date;
  dueDate?: Date;
}

const props = defineProps<{
  modelValue: DateRange;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: DateRange): void;
}>();

const startDateValue = computed({
  get: () => dateToDateValue(props.modelValue.startDate),
  set: (value: DateValue) =>
    emits('update:modelValue', { ...props.modelValue, startDate: dateValueToDate(value) }),
});

const dueDateValue = computed({
  get: () => dateToDateValue(props.modelValue.startDate),
  set: (value: DateValue) =>
    emits('update:modelValue', { ...props.modelValue, dueDate: dateValueToDate(value) }),
});

const defaultPlaceholder = today(getLocalTimeZone());

const dateToDateValue = (date?: Date): DateValue | undefined => {
  if (!date) return undefined;
  return today(getLocalTimeZone()).set({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
};

const dateValueToDate = (dateValue?: DateValue): Date | undefined => {
  if (!dateValue) return undefined;
  dateValue.toDate(getLocalTimeZone());
};

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
});

const dueDateMin = computed(() => startDateValue.value ?? defaultPlaceholder);
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn('w-50 justify-start text-left font-normal', !startDateValue && 'text-muted-foreground')
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{
          startDateValue ? df.format(startDateValue.toDate(getLocalTimeZone())) : 'Выберите дату'
        }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0 z-[9999]" :to="'body'">
      <Calendar
        v-model="startDateValue"
        :placeholder="startDateValue"
        :initial-focus="true"
        :default-placeholder="defaultPlaceholder"
        layout="month-and-year"
      />
    </PopoverContent>
  </Popover>

  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn('w-50 justify-start text-left font-normal', !dueDateValue && 'text-muted-foreground')
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ dueDateValue ? df.format(dueDateValue.toDate(getLocalTimeZone())) : 'Выберите дату' }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0 z-[9999]">
      <Calendar
        v-model="dueDateValue"
        :placeholder="dueDateValue"
        :initial-focus="true"
        :min-value="dueDateMin"
        layout="month-and-year"
      />
    </PopoverContent>
  </Popover>
</template>
