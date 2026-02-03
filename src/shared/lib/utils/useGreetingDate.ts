import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ref, onMounted, onUnmounted } from 'vue';

export function useGreeting(userName: string) {
  const formatdate = (date: Date): string => {
    return format(date, 'EEEE, d MMMM', { locale: ru });
  };

  const getGreeting = (date: Date): string => {
    const hours = date.getHours();
    if (hours < 6) {
      return `Доброй ночи, ${userName}`;
    }
    if (hours < 12) {
      return `Доброе утро, ${userName}`;
    }
    if (hours < 18) {
      return `Добрый день, ${userName}`;
    }
    return `Добрый вечер, ${userName}`;
  };

  return {
    formatdate,
    getGreeting,
  };
}

export function useCurrentTime() {
  const currentTime = ref(new Date());
  let intervalId: number | null = null;

  onMounted(() => {
    intervalId = setInterval(() => {
      currentTime.value = new Date();
    }, 600000); // update every 10 minutes
  });

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
  });

  return currentTime;
}
