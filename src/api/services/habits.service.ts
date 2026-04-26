import type {
  CreateHabitDto,
  HabitLogRangeResponse,
  HabitResponse,
  ToggleHabitDto,
  UpdateHabitDto,
} from '@/features/habit/types/habit.types';
import axiosApiInstance from '../api';
import { buildUrl } from '@/shared/lib/utils/buildUrl';

const HABITS_URL = '/api/habits';
const HABIT_LOGS_URL = '/api/habit-logs';

export const HabitService = {
  async create(dto: CreateHabitDto): Promise<HabitResponse> {
    const response = await axiosApiInstance.post(HABITS_URL, dto);
    return response.data;
  },

  async update(habitId: string, dto: UpdateHabitDto): Promise<HabitResponse> {
    const url = buildUrl(HABITS_URL, ':habitId', { habitId });
    const response = await axiosApiInstance.patch(url, dto);
    return response.data;
  },

  async delete(habitId: string): Promise<void> {
    const url = buildUrl(HABITS_URL, ':habitId', { habitId });
    await axiosApiInstance.delete(url);
  },

  async toggle(dto: ToggleHabitDto): Promise<void> {
    const response = await axiosApiInstance.post(`${HABIT_LOGS_URL}/toggle`, dto);
    return response.data;
  },

  async getRange(from: string, to: string): Promise<HabitLogRangeResponse> {
    const response = await axiosApiInstance.get(`${HABIT_LOGS_URL}/matrix`, {
      params: { from, to },
    });
    return response.data;
  },
};
