import axiosApiInstance from '@/api/api';
import { buildUrl } from '@/shared/lib/utils/buildUrl';
import type { ReviewSnapshot } from '@/shared/types/review';

const BASE_URL = import.meta.env.VITE_API_B0ARDS_URL;

class ReviewService {
  async getProjectReview(
    boardId: string,
    params: { from: string; to: string }
  ): Promise<ReviewSnapshot> {
    const url = buildUrl(BASE_URL, ':boardId/review', { boardId });
    const response = await axiosApiInstance.get(url, { params: params });
    return response.data;
  }
}

export const reviewService = new ReviewService();
