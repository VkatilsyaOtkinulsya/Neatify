<script setup lang="ts">
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth.store'
import { useUsersStore } from '@/stores/users.store'
import { BoardService } from '@/api/services/board.service'
import { PERMISSIONS_KEY, type PermissionsContext } from '@/shared/permissions/permissionsKey'
import type { ContributorStats } from '@/features/board/types/contributor.types'

const route = useRoute()
const authStore = useAuthStore()
const usersStore = useUsersStore()

const boardId = computed(() => route.params.projectId as string)

const permissionsCtx = inject<PermissionsContext>(PERMISSIONS_KEY)
const isAdmin = computed(() => permissionsCtx?.can('manage_members') ?? false)

function getDisplayName(userId: string): string {
  const member = usersStore.getUser(userId)
  return member?.profile?.displayName || member?.profile?.firstName || userId
}

const defaultFrom = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return format(d, 'yyyy-MM-dd')
})
const defaultTo = computed(() => format(new Date(), 'yyyy-MM-dd'))

const from = ref(defaultFrom.value)
const to = ref(defaultTo.value)

const contributors = ref<ContributorStats[]>([])
const myStats = ref<ContributorStats | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

async function fetchContributors() {
  if (!boardId.value || !from.value || !to.value) return

  isLoading.value = true
  error.value = null

  try {
    if (isAdmin.value) {
      const response = await BoardService.getContributors(
        boardId.value,
        from.value,
        to.value,
      )
      contributors.value = response.contributors
    } else {
      const response = await BoardService.getMyContributorStats(
        boardId.value,
        from.value,
        to.value,
      )
      myStats.value = response.contributor
    }
  } catch (e: any) {
    error.value = e?.message ?? 'Ошибка загрузки статистики'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchContributors()
})

watch([from, to], () => {
  fetchContributors()
})

function formatCycleTime(hours: number | null): string {
  if (hours == null || isNaN(hours)) return '—'
  if (hours < 24) return `${hours.toFixed(1)} ч`
  return `${(hours / 24).toFixed(1)} д`
}

function formatRate(rate: number | null): string {
  if (rate == null || isNaN(rate)) return '—'
  return `${Math.round(rate)}%`
}
</script>

<template>
  <div class="contributors-page">
    <div class="period-bar">
      <label class="period-label">
        <span>С</span>
        <input v-model="from" type="date" class="period-input" />
      </label>
      <label class="period-label">
        <span>По</span>
        <input v-model="to" type="date" class="period-input" />
      </label>
    </div>

    <div v-if="isLoading" class="state-message">Загрузка...</div>

    <div v-else-if="error" class="state-message text-error">{{ error }}</div>

    <template v-else>
      <table v-if="isAdmin && contributors.length" class="contributors-table">
        <thead>
          <tr>
            <th>Участник</th>
            <th>Завершено</th>
            <th>Оценки (pts)</th>
            <th>Оценки (ч)</th>
            <th>Оценки (д)</th>
            <th>Цикл</th>
            <th>В срок</th>
            <th>Просрочено</th>
            <th>Назначено</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in contributors" :key="c.userId">
            <td class="cell-name">{{ getDisplayName(c.userId) }}</td>
            <td>{{ c.completed }}</td>
            <td>{{ c.estimateBurned.points.toFixed(1) }}</td>
            <td>{{ c.estimateBurned.hours.toFixed(1) }}</td>
            <td>{{ c.estimateBurned.days.toFixed(1) }}</td>
            <td>{{ formatCycleTime(c.avgCycleTime) }}</td>
            <td>{{ formatRate(c.onTimeRate) }}</td>
            <td>{{ c.overdue }}</td>
            <td>{{ c.totalAssigned }}</td>
          </tr>
        </tbody>
      </table>

      <div v-else-if="!isAdmin && myStats" class="personal-card">
        <h3 class="personal-name">{{ myStats.userName || authStore.userInfo.firstName }}</h3>
        <div class="personal-grid">
          <div class="personal-item">
            <span class="personal-value">{{ myStats.completed }}</span>
            <span class="personal-label">завершено</span>
          </div>
          <div class="personal-item">
            <span class="personal-value">{{ myStats.totalAssigned }}</span>
            <span class="personal-label">назначено</span>
          </div>
          <div class="personal-item">
            <span class="personal-value">{{ formatRate(myStats.onTimeRate) }}</span>
            <span class="personal-label">в срок</span>
          </div>
          <div class="personal-item">
            <span class="personal-value">{{ myStats.overdue }}</span>
            <span class="personal-label">просрочено</span>
          </div>
          <div class="personal-item">
            <span class="personal-value">{{ formatCycleTime(myStats.avgCycleTime) }}</span>
            <span class="personal-label">среднее время цикла</span>
          </div>
        </div>
        <div class="personal-estimate">
          <span class="estimate-label">Сожжено оценок:</span>
          <span>{{ myStats.estimateBurned.points.toFixed(1) }} pts</span>
          <span>{{ myStats.estimateBurned.hours.toFixed(1) }} ч</span>
          <span>{{ myStats.estimateBurned.days.toFixed(1) }} д</span>
        </div>
      </div>

      <div v-else class="state-message">
        Нет данных за выбранный период
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.contributors-page {
  padding: 16px 24px;
}

.period-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
}

.period-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #444;
}

.period-input {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: #fff;
}

.state-message {
  text-align: center;
  padding: 32px 0;
  color: #888;
  font-size: 0.9375rem;
}

.text-error {
  color: #e53e3e;
}

.contributors-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;

  th,
  td {
    padding: 10px 14px;
    text-align: left;
    font-size: 0.875rem;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f9fafb;
    font-weight: 600;
    font-size: 0.75rem;
    color: #666;
    text-transform: uppercase;
  }

  td {
    color: #333;
  }
}

.cell-name {
  font-weight: 500;
}

.personal-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 24px;
  max-width: 480px;
}

.personal-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 16px;
}

.personal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.personal-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.personal-value {
  font-size: 1.25rem;
  font-weight: 700;
}

.personal-label {
  font-size: 0.6875rem;
  color: #999;
  text-transform: uppercase;
}

.personal-estimate {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 0.8125rem;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  color: #555;

  .estimate-label {
    font-size: 0.6875rem;
    color: #999;
    text-transform: uppercase;
    margin-right: 4px;
  }
}
</style>
