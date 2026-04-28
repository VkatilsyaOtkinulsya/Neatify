import { widgetRegistry } from '@/shared/lib/widgets/widgetRegistry';
import HabitTrackerContent from './HabitTrackerContent.vue';
import { Activity } from 'lucide-vue-next';

widgetRegistry.register({
  type: 'habit-tracker',
  title: 'Habit Tracker',
  description: 'Track your daily habits and build consistency',
  icon: Activity,
  component: HabitTrackerContent,
});
