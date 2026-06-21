<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import KeyResultItem from './KeyResultItem.vue';
import KeyResultModalForm from './KeyResultModalForm.vue';
import { useAddKeyResult, useUpdateKeyResult, useDeleteKeyResult } from '@/api/queries/useObjectives';
import type { KeyResult, CreateKeyResultDto } from '@/features/okr/types/okr.types';
import { Plus } from 'lucide-vue-next';

interface Props {
  objectiveId: string;
  keyResults: KeyResult[];
  workspaceId: string;
}

const props = defineProps<Props>();

const workspaceIdRef = computed(() => props.workspaceId);
const objectiveIdRef = computed(() => props.objectiveId);

const { mutate: addKeyResult, isPending: isAddPending } = useAddKeyResult(workspaceIdRef, objectiveIdRef);
const { mutate: updateKeyResult, isPending: isUpdatePending } = useUpdateKeyResult(workspaceIdRef, objectiveIdRef);
const { mutate: deleteKeyResult, isPending: isDeletePending } = useDeleteKeyResult(workspaceIdRef, objectiveIdRef);

const showModal = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const editingKeyResult = ref<KeyResult | undefined>(undefined);

const showDeleteDialog = ref(false);
const deletingKrId = ref<string | null>(null);

// Вычисляем доступный вес для новых/редактируемых KR
const availableWeight = computed(() => {
  const totalUsed = props.keyResults.reduce((sum, kr) => {
    // Исключаем редактируемый KR из подсчёта
    if (editingKeyResult.value && kr._id === editingKeyResult.value._id) {
      return sum;
    }
    return sum + kr.weight;
  }, 0);

  return Math.max(0, 1 - totalUsed);
});

const handleCreate = () => {
  modalMode.value = 'create';
  editingKeyResult.value = undefined;
  showModal.value = true;
};

const handleEdit = (keyResult: KeyResult) => {
  modalMode.value = 'edit';
  editingKeyResult.value = keyResult;
  showModal.value = true;
};

const handleModalClose = () => {
  showModal.value = false;
  modalMode.value = 'create';
  editingKeyResult.value = undefined;
};

const handleDeleteClick = (krId: string) => {
  deletingKrId.value = krId;
  showDeleteDialog.value = true;
};

const handleDeleteConfirm = () => {
  if (deletingKrId.value) {
    deleteKeyResult(deletingKrId.value, {
      onSuccess: () => {
        showDeleteDialog.value = false;
        deletingKrId.value = null;
      },
    });
  }
};

const handleSubmit = (data: CreateKeyResultDto) => {
  if (modalMode.value === 'create') {
    addKeyResult(data, {
      onSuccess: () => {
        showModal.value = false;
      },
    });
  } else if (modalMode.value === 'edit' && editingKeyResult.value) {
    updateKeyResult(
      { krId: editingKeyResult.value._id, data },
      {
        onSuccess: () => {
          showModal.value = false;
          editingKeyResult.value = undefined;
        },
      }
    );
  }
};

const isPending = computed(() => isAddPending.value || isUpdatePending.value);
</script>

<template>
  <div class="key-results-list">
    <div v-if="keyResults.length === 0" class="empty-state">
      <p class="empty-text">Нет ключевых результатов</p>
      <Button @click="handleCreate">
        <Plus :size="16" class="mr-2" />
        Создать ключевой результат
      </Button>
    </div>

    <div v-else class="kr-items">
      <KeyResultItem
        v-for="keyResult in keyResults"
        :key="keyResult._id"
        :key-result="keyResult"
        @edit="handleEdit"
        @delete="handleDeleteClick"
      />
      <Button variant="outline" @click="handleCreate" class="add-kr-btn">
        <Plus :size="16" class="mr-2" />
        Добавить ключевой результат
      </Button>
    </div>

    <KeyResultModalForm
      v-if="showModal"
      v-model:open="showModal"
      :mode="modalMode"
      :initial-data="editingKeyResult"
      :available-weight="availableWeight"
      :workspace-id="workspaceId"
      :is-pending="isPending"
      @submit="handleSubmit"
      @update:open="(value) => !value && handleModalClose()"
    />

    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить ключевой результат?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя отменить. Ключевой результат будет удален навсегда.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction @click="handleDeleteConfirm" :disabled="isDeletePending">
            {{ isDeletePending ? 'Удаление...' : 'Удалить' }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<style scoped lang="scss">
.key-results-list {
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;

    .empty-text {
      margin: 0 0 16px 0;
      font-size: 0.875rem;
      color: #999;
    }
  }

  .kr-items {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .add-kr-btn {
      margin-top: 8px;
      width: 100%;
    }
  }
}
</style>
