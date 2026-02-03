<script setup lang="ts">
withDefaults(defineProps<{ size?: number; color?: string }>(), {
  size: 20,
  color: 'rgb(153, 153, 153)',
});
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 20 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.3636 18H3.63636C3.39526 18 3.16403 17.9035 2.99354 17.7317C2.82305 17.5599 2.72727 17.3269 2.72727 17.0839V8.8389H0L9.3882 0.23852C9.5556 0.0850502 9.7737 0 10 0C10.2263 0 10.4444 0.0850502 10.6118 0.23852L20 8.8389H17.2727V17.0839C17.2727 17.3269 17.177 17.5599 17.0065 17.7317C16.836 17.9035 16.6047 18 16.3636 18ZM4.54545 16.1678H15.4545V7.1505L10 2.1541L4.54545 7.1505V16.1678Z"
      fill="currentColor"
    ></path>
  </svg>
</template>
