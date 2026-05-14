<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useObjectives, useCreateObjective } from '@/api/queries/useObjectives';
import { useWorkspaceBoards } from '@/api/queries/useProject';
import Loader from '@/components/ui/loader/Loader.vue';
import ObjectiveModalForm from '@/features/okr/components/ObjectiveModalForm.vue';
import ObjectiveCard from '@/features/okr/components/ObjectiveCard.vue';
import type { CreateObjectiveDto } from '@/features/okr/types/okr.types';
import Label from '@/components/ui/label/Label.vue';

const route = useRoute();
const workspaceId = computed(() => route.params.workspaceId as string);

const { data, isLoading } = useObjectives(workspaceId);
const { mutate: createObjective, isPending: isCreatePending } = useCreateObjective(workspaceId);

// Загружаем проекты workspace для кэша (используется в KeyResultModalForm)
useWorkspaceBoards(workspaceId);

const objectives = computed(() => data.value?.objectives || []);

const showDialog = ref(false);
const expandedObjectives = ref<Set<string>>(new Set());

const handleCreateObjective = (dto: CreateObjectiveDto) => {
  createObjective(dto, {
    onSuccess: () => {
      showDialog.value = false;
    },
  });
};

const toggleObjective = (objectiveId: string) => {
  if (expandedObjectives.value.has(objectiveId)) {
    expandedObjectives.value.delete(objectiveId);
  } else {
    expandedObjectives.value.add(objectiveId);
  }
};
</script>

<template>
  <div class="objectives-wrapper">
    <div class="objectives-header">
      <div class="objectives-wrapper__title">
        <Label>Цели продукта</Label>
      </div>
      <ObjectiveModalForm
        v-model:open="showDialog"
        :is-pending="isCreatePending"
        @submit="handleCreateObjective"
      />
    </div>
    <Loader v-if="isLoading" color="#000" />
    <div v-else-if="objectives.length > 0" class="objectives-list">
      <ObjectiveCard
        v-for="objective in objectives"
        :key="objective._id"
        :objective="objective"
        :workspace-id="workspaceId"
        :is-expanded="expandedObjectives.has(objective._id)"
        @toggle="toggleObjective"
      />
    </div>
    <div v-else class="objectives-list_empty">
      <p>Нет целей</p>
      <p class="empty-hint">Создайте первую цель для workspace</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.objectives-wrapper {
  display: block;
  width: 80%;
  max-width: 1200px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-left: 50px;
  border-radius: 10px;
  background-color: #fff;
  box-sizing: border-box;

  .objectives-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .objectives-wrapper__title {
    display: flex;
    font-family: 'Roboto', sans-serif;
    font-size: 1.375rem;
  }

  .objectives-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .objectives-list_empty {
    text-align: center;
    padding: 60px 20px;

    p {
      margin: 0;
      font-size: 1rem;
      color: #999;

      &.empty-hint {
        margin-top: 8px;
        font-size: 0.875rem;
        color: #bbb;
      }
    }
  }
}
</style>
