import { useQuery } from '@tanstack/vue-query';
import { reviewService } from '../services/review.service';
import { type Ref } from 'vue';

export function useReviewMetrics(projectId: Ref<string>, from: Ref<string>, to: Ref<string>) {
  return useQuery({
    queryKey: ['Project metrics', projectId, from, to],
    queryFn: () =>
      reviewService.getProjectReview(projectId.value, { from: from.value, to: to.value }),

    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    refetchInterval: 5 * 60 * 1000,
  });
}
