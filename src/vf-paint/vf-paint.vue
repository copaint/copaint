<template>
  <div class="flex flex-col w-screen h-screen">
    <!-- menu -->
    <div class="h-10 border-b border-dark-800 bg-dark-100">
      <VfMenu />
    </div>
    <!-- tool setting -->
    <div class="h-9 border-b border-dark-800 bg-dark-200"></div>
    <div class="flex-1 flex overflow-hidden">
      <!-- toolbars -->
      <div class="w-10 bg-dark-200"></div>
      <div class="flex-1 bg-dark-800 overflow-auto bg-sky-800">
        <VfCanvas />
      </div>
      <div class="relative w-72 bg-dark-200">
        <div class="absolute bottom-0 w-full p-1">
          <div style="color: red; font-size: 280px">
            <svg
              id="preview"
              class="bg-white"
              width="1em"
              height="1em"
              viewBox="0 0 32 32"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g id="svg" stroke="currentColor" fill="currentColor"></g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import VfCanvas from '../vf-canvas';
import VfMenu from '../vf-menu';
</script>
