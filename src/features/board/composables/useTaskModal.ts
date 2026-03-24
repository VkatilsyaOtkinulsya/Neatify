import type { Task } from "@/features/task/types/task.types"
import { ref } from "vue"

export function useTaskModal() {
  const showModal = ref(false)
  const currentColumnId = ref('')
  const editingTask = ref<Task | null>(null)

  const openCreate = (columnId: string) => {
    editingTask.value = null
    currentColumnId.value = columnId
    showModal.value = true
  }

  const openEdit = (task: Task) => {
    editingTask.value = task
    currentColumnId.value = task.columnId
    showModal.value = true
  }

  const close = () => {
    showModal.value = false
    editingTask.value = null
    currentColumnId.value = ''
  }

  return {
    showModal,
    currentColumnId,
    editingTask,
    openCreate,
    openEdit,
    close
  }
}