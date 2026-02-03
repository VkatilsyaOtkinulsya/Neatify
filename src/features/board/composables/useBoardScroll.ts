import { ref } from 'vue';

export const useBoardScroll = () => {
  const isDragging = ref(false);
  const startX = ref(0);
  const scrollLeft = ref(0);
  const isDraggingTask = ref(false);

  // Функция для горизонтального скролла колесом мыши
  const handleHorizontalScroll = (event: WheelEvent): void => {
    if (isDraggingTask.value) return;
    const container = event.currentTarget as HTMLElement;
    if (container.scrollWidth > container.clientWidth) {
      event.preventDefault();
      container.scrollLeft += event.deltaY;
    }
  };
  const handleMouseDown = (event: MouseEvent): void => {
    const container = event.currentTarget as HTMLElement;
    isDragging.value = true;
    startX.value = event.pageX - container.offsetLeft;
    scrollLeft.value = container.scrollLeft;
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  };

  // Процесс перетаскивания
  const handleMouseMove = (event: MouseEvent): void => {
    if (!isDragging.value) return;
    event.preventDefault();
    const container = event.currentTarget as HTMLElement;
    const x = event.pageX - container.offsetLeft;
    const walk = (x - startX.value) * 2; // Множитель для скорости скролла
    container.scrollLeft = scrollLeft.value - walk;
  };

  // Окончание перетаскивания
  const handleMouseUp = (event: MouseEvent): void => {
    isDragging.value = false;
    const container = event.currentTarget as HTMLElement;
    container.style.cursor = 'grab';
    container.style.userSelect = '';
  };

  // Окончание перетаскивания при уходе курсора
  const handleMouseLeave = (event: MouseEvent): void => {
    if (isDragging.value) {
      isDragging.value = false;
      const container = event.currentTarget as HTMLElement;
      container.style.cursor = 'grab';
      container.style.userSelect = '';
    }
  };

  const setDraggingTask = (value: boolean) => {
    isDraggingTask.value = value;
  };

  return {
    isDragging,
    isDraggingTask,
    setDraggingTask,

    handleHorizontalScroll,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  };
};
