<template>
  <div class="w-full h-full text-white flex justify-center items-center">
    <div class="relative flex">
      <canvas
        ref="canvasEl"
        :width="canvasInfo.width"
        :height="canvasInfo.height"
        :style="canvasStyle"
        class="bg-white"
      ></canvas>
      <VfCanvasGrid v-bind="canvasInfo" />
      <VfCanvasHover
        :width="canvasInfo.scale"
        :height="canvasInfo.scale"
        @draw-point="handleDrawPoint"
      />
      <div class="absolute top-0 -right-16">
        <button @click="tool = 1" class="block mb-2">铅笔</button>
        <button @click="tool = -1" class="block mb-2">橡皮擦</button>
        <button @click="handleExport" class="block mb-2">导出</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { Point } from '../types';
import VfCanvasGrid from './vf-canvas-grid.vue';
import VfCanvasHover from './vf-canvas-hover.vue';

const canvasEl = ref<HTMLCanvasElement>();
const canvasInfo = ref({
  width: 16,
  height: 16,
  scale: 40,
});
const tool = ref(1);
const pixels = Array.from({ length: 16 }, () => new Array(16).fill(0));

const canvasStyle = computed(() => {
  const { width, height, scale } = canvasInfo.value;
  return {
    width: `${width * scale}px`,
    height: `${height * scale}px`,
  };
});
onMounted(() => {
  initializeCanvas();
});

const initializeCanvas = () => {};

const handleDrawPoint = (point: Point) => {
  if (canvasEl.value) {
    const ctx = canvasEl.value.getContext('2d');
    if (ctx) {
      if (tool.value === 1) {
        ctx.fillRect(point.x, point.y, 1, 1);
        pixels[point.x][point.y] = 1;
      } else {
        ctx.clearRect(point.x, point.y, 1, 1);
        pixels[point.x][point.y] = 0;
      }
    }
  }
};

const handleExport = () => {
  const svg = document.querySelector('#svg');
  if (svg) {
    svg.innerHTML = '';
    pixels.forEach((col, x) =>
      col.forEach((c, y) => {
        if (!c) {
          return;
        }
        const rect = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'rect'
        );
        rect.setAttribute('x', `${x}`);
        rect.setAttribute('y', `${y}`);
        rect.setAttribute('width', `1`);
        rect.setAttribute('height', `1`);
        svg.appendChild(rect);
      })
    );
    console.log(svg);
  }
};
</script>

<style scoped>
canvas {
  image-rendering: pixelated;
}
</style>
