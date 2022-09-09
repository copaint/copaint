<template>
  <div class="flex flex-col w-screen h-screen">
    <div class="h-10 border-b border-dark-800 bg-dark-100"></div>
    <div class="h-9 border-b border-dark-800 bg-dark-200"></div>
    <div class="flex-1 flex overflow-hidden">
      <div class="w-10 bg-dark-200"></div>
      <div class="flex-1 bg-dark-800 overflow-auto">
        <VfCanvas />
      </div>
      <div class="w-72 bg-dark-200"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import VfCanvas from '../vf-canvas';
</script>
