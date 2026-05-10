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
  const dateValueToDate = (
    dateValue?: DateValue,
    existingDate?: Date,
    defaultHours: number = 9
  ): Date | undefined => {
    if (!dateValue) return undefined;

    const date = dateValue.toDate(timezone);

    // Если есть существующая дата с временем, используем её время
    if (existingDate) {
      date.setHours(existingDate.getHours(), existingDate.getMinutes(), 0, 0);
    } else {
      // Иначе используем дефолтное время
      date.setHours(defaultHours, 0, 0, 0);
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
      const currentValue = unref(modelValue);
      emit({
        startDate: dateValueToDate(range?.start, currentValue.startDate, 9),
        dueDate: dateValueToDate(range?.end, currentValue.dueDate, 17),
      });
    },
  });

  // Date -> "HH:mm" string
  const dateToTimeString = (date?: Date): string => {
    if (!date) return '09:00';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // "HH:mm" string -> обновить Date
  const updateDateTime = (date: Date | undefined, timeString: string): Date => {
    if (!timeString || !timeString.includes(':')) {
      // Если время не указано, используем дефолтное
      const newDate = date ? new Date(date) : new Date();
      newDate.setHours(9, 0, 0, 0);
      return newDate;
    }

    const [hours, minutes] = timeString.split(':').map(Number);

    // Проверяем валидность часов и минут
    if (isNaN(hours) || isNaN(minutes)) {
      const newDate = date ? new Date(date) : new Date();
      newDate.setHours(9, 0, 0, 0);
      return newDate;
    }

    const newDate = date ? new Date(date) : new Date();
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  return {
    rangeValue,
    dateToTimeString,
    updateDateTime,
  };
}
