import {
  Droplet,
  Dumbbell,
  BookOpen,
  Moon,
  Apple,
  Brain,
  Flame,
  CheckCircle2,
  Clock,
  Smile,
} from 'lucide-vue-next';

export const HABIT_ICONS = {
  water: {
    label: 'Вода',
    component: Droplet,
  },
  sport: {
    label: 'Спорт',
    component: Dumbbell,
  },
  reading: {
    label: 'Чтение',
    component: BookOpen,
  },
  sleep: {
    label: 'Сон',
    component: Moon,
  },
  food: {
    label: 'Питание',
    component: Apple,
  },
  meditation: {
    label: 'Медитация',
    component: Brain,
  },
  streak: {
    label: 'Серия',
    component: Flame,
  },
  habit: {
    label: 'Привычка',
    component: CheckCircle2,
  },
  time: {
    label: 'Время',
    component: Clock,
  },
  mood: {
    label: 'Настроение',
    component: Smile,
  },
} as const;

export type HabitIconKey = keyof typeof HABIT_ICONS;
