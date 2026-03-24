// useDateRange.ts
import type { DateValue } from '@internationalized/date';
import type { DateRange as CalendarRange } from 'reka-ui';
import { computed, unref, type MaybeRef } from 'vue';
import { getLocalTimeZone, today } from '@internationalized/date';

export interface DateRangeModel {
  startDate?: Date;
  dueDate?: Date;
}

export function useDateRange(
  modelValue: MaybeRef<DateRangeModel>,
  emit: (value: DateRangeModel) => void
) {
  const timezone = getLocalTimeZone();

  // Date -> DateValue
  const dateToDateValue = (date?: Date): DateValue | undefined => {
    if (!date) return undefined;

    return today(timezone).set({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
  };

  // DateValue -> Date + время
  const dateValueToDate = (dateValue?: DateValue, hours?: number): Date | undefined => {
    if (!dateValue) return undefined;

    const date = dateValue.toDate(timezone);

    if (hours !== undefined) {
      date.setHours(hours, 0, 0, 0);
    }

    return date;
  };

  // 🧠 главный v-model для RangeCalendar
  const rangeValue = computed<CalendarRange>({
    get: () => {
      const value = unref(modelValue);

      return {
        start: dateToDateValue(value.startDate),
        end: dateToDateValue(value.dueDate),
      };
    },

    set: (range) => {
      emit({
        startDate: dateValueToDate(range?.start, 9), // 🔥 9:00
        dueDate: dateValueToDate(range?.end, 17), // 🔥 17:00
      });
    },
  });

  return {
    rangeValue,
  };
}
