<template>
  <div class="flex flex-col w-screen h-screen">
    <!-- menu -->
    <div class="h-10 border-b border-dark-800 bg-dark-100">
      <CoMenu />
    </div>
    <!-- tool setting -->
    <div class="h-9 border-b border-dark-800 bg-dark-200"></div>
    <div class="flex-1 flex overflow-hidden">
      <!-- toolbars -->
      <div class="w-10 bg-dark-200"></div>
      <!-- main container -->
      <div class="flex-1 bg-dark-800 overflow-auto">
        <VfCanvas />
      </div>
      <!-- right -->
      <div class="relative w-72 bg-dark-200">
        <div class="absolute bottom-0 w-full p-1">
          <div style="color: red; font-size: 280px">
            <svg id="preview" class="bg-white" v-bind="svgSize" :viewBox="svgViewBox" version="1.1"
              xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="svg" stroke="currentColor" fill="currentColor"></g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import VfCanvas from './co-canvas';
import CoMenu from './co-menu';
import { useCopaintStore } from './store';

const { settings, wrapperEl, canvasEl, isMounted, canvasInfo } = storeToRefs(useCopaintStore());

const svgViewBox = computed(() => {
  const { width, height } = settings.value.pageSize;
  return `0 0 ${width} ${height}`;
});

const svgSize = computed(() => {
  const { width, height } = settings.value.pageSize;
  return {
    width: '1em',
    height: `${height / width}em`,
  };
});

</script>
  