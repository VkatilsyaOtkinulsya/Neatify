<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useWorkspaceStore } from '@/stores/spaces.store'
import { BoardService } from '@/api/services/board.service'
import type { Board } from '@/features/board/types/board.types'
import type { ContributorStats } from '@/features/board/types/contributor.types'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'

interface ProjectStat {
  boardId: string
  workspaceId: string
  title: string
  stats: ContributorStats | null
  isLoading: boolean
  error: string | null
}

const router = useRouter()
const authStore = useAuthStore()
const workspaceStore = useWorkspaceStore()

const userId = computed(() => authStore.userInfo.id)

const isLoadingWorkspaces = ref(true)
const isReady = ref(false)

const defaultFrom = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return format(d, 'yyyy-MM-dd')
})

const defaultTo = computed(() => format(new Date(), 'yyyy-MM-dd'))

const from = ref(defaultFrom.value)
const to = ref(defaultTo.value)

const projects = ref<ProjectStat[]>([])

const aggregateStats = computed(() => {
  const loaded = projects.value.filter((p) => p.stats && !p.isLoading)
  if (!loaded.length) return null

  const total = loaded.reduce((sum, p) => sum + p.stats!.totalAssigned, 0)
  const completed = loaded.reduce((sum, p) => sum + p.stats!.completed, 0)
  const overdue = loaded.reduce((sum, p) => sum + p.stats!.overdue, 0)
  const onTimeRate =
    loaded.reduce((sum, p) => sum + p.stats!.onTimeRate, 0) / loaded.length
  const avgCycleTime =
    loaded.reduce((sum, p) => sum + p.stats!.avgCycleTime, 0) / loaded.length
  const totalPoints = loaded.reduce(
    (sum, p) => sum + p.stats!.estimateBurned.points,
    0,
  )

  return { total, completed, overdue, onTimeRate, avgCycleTime, totalPoints }
})

async function loadProjects() {
  if (!userId.value || !from.value || !to.value) return

  isLoadingWorkspaces.value = true

  try {
    await workspaceStore.loadSpaces()
    const workspaces = workspaceStore.spaces

    const allBoards: { board: Board; workspaceId: string }[] = []

    for (const ws of workspaces) {
      try {
        const boards = await BoardService.getByWorkspace(ws.id)
        boards.forEach((board) => {
          if (board.members.some((m) => m.userId === userId.value)) {
            allBoards.push({ board, workspaceId: ws.id })
          }
        })
      } catch {
        // skip workspace if boards can't be loaded
      }
    }

    projects.value = allBoards.map(({ board, workspaceId }) => ({
      boardId: board.id,
      workspaceId,
      title: board.title,
      stats: null,
      isLoading: true,
      error: null,
    }))

    for (const project of projects.value) {
      try {
        const response = await BoardService.getMyContributorStats(
          project.boardId,
          from.value,
          to.value,
        )
        project.stats = response.contributor
      } catch (e: any) {
        project.error = e?.message ?? 'Ошибка'
      } finally {
        project.isLoading = false
      }
    }
  } finally {
    isLoadingWorkspaces.value = false
    isReady.value = true
  }
}

function navigateToProject(project: ProjectStat) {
  router.push({
    name: 'review',
    params: {
      workspaceId: project.workspaceId,
      projectId: project.boardId,
    },
  })
}

function formatCycleTime(hours: number | null): string {
  if (hours == null || isNaN(hours)) return '—'
  if (hours < 24) return `${hours.toFixed(1)} ч`
  return `${(hours / 24).toFixed(1)} д`
}

function formatRate(rate: number | null): string {
  if (rate == null || isNaN(rate)) return '—'
  return `${Math.round(rate)}%`
}

onMounted(() => {
  loadProjects()
})

watch([from, to], () => {
  loadProjects()
})
</script>

<template>
  <div class="profile-page">
    <header class="profile-header">
      <h1 class="profile-title">Профиль</h1>
      <p class="profile-name">
        {{ authStore.userInfo.firstName }} {{ authStore.userInfo.lastName }}
      </p>
    </header>

    <div class="period-selector">
      <label class="period-label">
        <span>С</span>
        <input v-model="from" type="date" class="period-input" />
      </label>
      <label class="period-label">
        <span>По</span>
        <input v-model="to" type="date" class="period-input" />
      </label>
    </div>

    <div v-if="isLoadingWorkspaces" class="profile-state">
      <p>Загрузка...</p>
    </div>

    <div v-else-if="!projects.length" class="profile-state">
      <p>Вы не участвуете ни в одном проекте</p>
    </div>

    <template v-else>
      <div v-if="aggregateStats" class="aggregate-card">
        <div class="aggregate-row">
          <div class="stat-item">
            <span class="stat-value">{{ aggregateStats.completed }}</span>
            <span class="stat-label">завершено</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ aggregateStats.total }}</span>
            <span class="stat-label">назначено</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ formatRate(aggregateStats.onTimeRate) }}</span>
            <span class="stat-label">в срок</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ aggregateStats.overdue }}</span>
            <span class="stat-label">просрочено</span>
          </div>
        </div>
      </div>

      <div class="projects-grid">
        <div
          v-for="project in projects"
          :key="project.boardId"
          class="project-card"
          @click="navigateToProject(project)"
        >
          <div class="project-card-header">
            <h3 class="project-card-title">{{ project.title }}</h3>
          </div>

          <div v-if="project.isLoading" class="project-card-body">
            <p class="text-muted">Загрузка...</p>
          </div>

          <div v-else-if="project.error" class="project-card-body">
            <p class="text-error">{{ project.error }}</p>
          </div>

          <div v-else-if="project.stats" class="project-card-body">
            <div class="card-stats-row">
              <div class="card-stat">
                <span class="card-stat-value">{{ project.stats.completed }}</span>
                <span class="card-stat-label">завершено</span>
              </div>
              <div class="card-stat">
                <span class="card-stat-value">{{ project.stats.totalAssigned }}</span>
                <span class="card-stat-label">назначено</span>
              </div>
            </div>
            <div class="card-stats-row">
              <div class="card-stat">
                <span class="card-stat-value">
                  {{ formatRate(project.stats.onTimeRate) }}
                </span>
                <span class="card-stat-label">в срок</span>
              </div>
              <div class="card-stat">
                <span class="card-stat-value">{{ project.stats.overdue }}</span>
                <span class="card-stat-label">просрочено</span>
              </div>
            </div>
            <div class="card-stats-row">
              <div class="card-stat">
                <span class="card-stat-value">
                  {{ formatCycleTime(project.stats.avgCycleTime) }}
                </span>
                <span class="card-stat-label">среднее время цикла</span>
              </div>
            </div>
            <div class="card-stats-row estimate-row">
              <span class="estimate-label">Сожжено оценок:</span>
              <span class="estimate-value">
                {{ project.stats.estimateBurned.points.toFixed(1) }} pts
              </span>
              <span class="estimate-value">
                {{ project.stats.estimateBurned.hours.toFixed(1) }} ч
              </span>
              <span class="estimate-value">
                {{ project.stats.estimateBurned.days.toFixed(1) }} д
              </span>
            </div>
          </div>

          <div v-else class="project-card-body">
            <p class="text-muted">Нет данных за выбранный период</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.profile-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
  min-height: 100vh;
  background: var(--background, #f5f5f5);
}

.profile-header {
  margin-bottom: 24px;
}

.profile-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 4px;
}

.profile-name {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

.period-selector {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
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

.profile-state {
  text-align: center;
  padding: 48px 0;
  color: #888;
  font-size: 0.9375rem;
}

.aggregate-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px 24px;
  margin-bottom: 24px;
}

.aggregate-row {
  display: flex;
  gap: 32px;
  justify-content: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.project-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 18px 20px;
  cursor: pointer;
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
}

.project-card-header {
  margin-bottom: 12px;
}

.project-card-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.project-card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-stats-row {
  display: flex;
  gap: 20px;
}

.card-stat {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.card-stat-value {
  font-size: 0.9375rem;
  font-weight: 600;
}

.card-stat-label {
  font-size: 0.6875rem;
  color: #999;
  text-transform: uppercase;
}

.estimate-row {
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding-top: 4px;
  border-top: 1px solid #f0f0f0;
}

.estimate-label {
  font-size: 0.6875rem;
  color: #999;
  text-transform: uppercase;
  margin-right: 4px;
}

.estimate-value {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #555;
}

.text-muted {
  color: #aaa;
  font-size: 0.8125rem;
  margin: 0;
}

.text-error {
  color: #e53e3e;
  font-size: 0.8125rem;
  margin: 0;
}
</style>
