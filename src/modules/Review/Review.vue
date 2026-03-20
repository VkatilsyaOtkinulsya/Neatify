<script setup lang="ts">
import { useReviewMetrics } from '@/api/queries/useReview';
import Loader from '@/components/ui/loader/Loader.vue';
import ActivityStats from '@/features/review/components/ActivityStats.vue';
import AssigneeStats from '@/features/review/components/AssigneeStats.vue';
import OverviewStats from '@/features/review/components/OverviewStats.vue';
import RiskStats from '@/features/review/components/RiskStats.vue';
import TimingStats from '@/features/review/components/TimingStats.vue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectDetails } from '@/api/queries/useProject';
import {
  buildPeriods,
  type Period,
  type PeriodMode,
} from '@/features/review/composables/useWeeklyPeriods';

const route = useRoute();
const projectId = computed(() => route.params.projectId as string);
const workspaceId = route.params.workspaceId as string;

const { data: projectData } = useProjectDetails(workspaceId, projectId);

const mode = ref<PeriodMode>('sprint');
const periods = ref<Period[]>([]);
const selectedPeriod = ref<Period | null>(null);

function initPeriods(startDate: Date) {
  periods.value = buildPeriods(startDate, mode.value);
  selectedPeriod.value = periods.value[0] ?? null;
}

watch(
  projectData,
  (project) => {
    if (!project) return;
    initPeriods(new Date(project.createdAt));
  },
  { immediate: true }
);

watch(mode, () => {
  if (!projectData.value) return;
  initPeriods(new Date(projectData.value.createdAt));
});

// Select работает со строками — используем fromStr как уникальный ключ периода
const selectedKey = computed({
  get: () => selectedPeriod.value?.fromStr ?? '',
  set: (key) => {
    selectedPeriod.value = periods.value.find((p) => p.fromStr === key) ?? null;
  },
});
const from = computed(() => selectedPeriod.value?.fromStr ?? '');
const to = computed(() => selectedPeriod.value?.toStr ?? '');

const { data, isLoading, isLoadingError } = useReviewMetrics(projectId, from, to);
</script>

<template>
  <div v-if="isLoading" class="p-3">
    <Loader color="#4A5568" />
  </div>

  <div v-else-if="isLoadingError || !data" class="p-3">Ошибка получения данных</div>

  <div v-else class="p-3 space-y-4">
    <div class="flex items-center gap-2">
      <!-- Переключатель режима -->
      <div class="flex rounded-md border overflow-hidden">
        <button
          v-for="m in ['weekly', 'sprint'] as PeriodMode[]"
          :key="m"
          :class="[
            'px-3 py-1.5 text-sm transition-colors',
            mode === m ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
          ]"
          @click="mode = m"
        >
          {{ m === 'weekly' ? 'По неделям' : 'Спринты' }}
        </button>
      </div>

      <Select v-model="selectedKey">
        <SelectTrigger class="w-56">
          <SelectValue placeholder="Выберите период" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="period in periods" :key="period.fromStr" :value="period.fromStr">
            {{ period.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Метрики -->
    <div class="flex flex-wrap gap-3">
      <div class="flex items-center justify-center flex-1 border rounded-sm min-w-90 min-h-50">
        <OverviewStats v-bind="data.overview" />
      </div>
      <div class="flex items-center justify-start flex-1 border rounded-sm min-w-90 min-h-50">
        <AssigneeStats
          v-for="assignee in data.byAssignee"
          :key="assignee.userId"
          v-bind="assignee"
        />
      </div>
      <div class="flex items-center justify-center flex-1 border rounded-sm min-w-90 min-h-50">
        <TimingStats v-bind="data.timing" />
      </div>
      <div class="flex items-center justify-center flex-1 border rounded-sm min-w-90 min-h-50">
        <RiskStats v-bind="data.risks" />
      </div>
      <div v-if="!data.activity">ниче не передали</div>
      <div
        v-else
        class="flex flex-col items-center justify-start pt-3 flex-1 border rounded-sm min-w-90 min-h-50"
      >
        <div>Активности</div>
        <ActivityStats v-bind="data.activity" />
      </div>
    </div>
  </div>
</template>
