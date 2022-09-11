<template>
  <li class="h-full flex items-center px-3 text-white/60 hover:text-white/80 select-none">
    <span class="text-sm">{{ label }}</span>
  </li>
</template>

<script lang="ts" setup>
defineProps<{
  label: string;
}>();
</script>
