import { QueryClient } from '@tanstack/vue-query';

let queryClient: QueryClient;

export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient();
  }
  return queryClient;
}

export function resetQueryClient() {
  if (queryClient) {
    queryClient.removeQueries();
    queryClient.getMutationCache().clear();
    queryClient = new QueryClient();
  } else {
    queryClient = new QueryClient();
  }
}
