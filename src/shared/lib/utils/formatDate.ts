import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DateFormatter } from '@internationalized/date';

export const formatDueDate = (date: Date | string) => {
  return format(new Date(date), 'd MMMM ', { locale: ru }).toLocaleString();
};

export const df = new DateFormatter('ru-RU', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
});
