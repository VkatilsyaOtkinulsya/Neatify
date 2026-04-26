import { HABIT_ICONS, type HabitIconKey } from '@/shared/config/habitIcons';

export const isHabitIconKey = (key: string): key is HabitIconKey => {
  return key in HABIT_ICONS;
};
