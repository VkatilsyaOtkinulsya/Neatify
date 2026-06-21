import { ref, type Ref } from 'vue'
import { BoardService } from '@/api/services/board.service'
import type { ContributorStats } from '../types/contributor.types'

export function useBoardContributors(
  boardId: Ref<string>,
  from: Ref<string>,
  to: Ref<string>,
) {
  const data = ref<ContributorStats[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetch() {
    if (!boardId.value || !from.value || !to.value) return

    isLoading.value = true
    error.value = null

    try {
      const response = await BoardService.getContributors(
        boardId.value,
        from.value,
        to.value,
      )
      data.value = response.contributors
    } catch (e: any) {
      error.value = e?.message ?? 'Ошибка загрузки статистики'
      data.value = []
    } finally {
      isLoading.value = false
    }
  }

  return { data, isLoading, error, fetch }
}

export function useMyContributorStats(
  boardId: Ref<string>,
  from: Ref<string>,
  to: Ref<string>,
) {
  const data = ref<ContributorStats | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetch() {
    if (!boardId.value || !from.value || !to.value) return

    isLoading.value = true
    error.value = null

    try {
      const response = await BoardService.getMyContributorStats(
        boardId.value,
        from.value,
        to.value,
      )
      data.value = response.contributor
    } catch (e: any) {
      error.value = e?.message ?? 'Ошибка загрузки статистики'
      data.value = null
    } finally {
      isLoading.value = false
    }
  }

  return { data, isLoading, error, fetch }
}
