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
      <VfCanvasHover v-bind="canvasInfo" @draw-point="handleDrawPoint" />
      <div class="absolute top-0 -right-24">
        <button
          v-for="b in toolbars"
          :key="b.code"
          @click="tool = b.code"
          class="block mb-2"
          :class="{ 'font-bold border-b': b.code === tool }"
        >
          {{ b.label }}
        </button>
        <button @click="handlePreview" class="block mb-2">预览</button>
        <button @click="handleExportSvg" class="block mb-2">导出为SVG</button>
        <button @click="handleClear" class="block mb-2">清除</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { fill } from '.';
import { Point } from '../types';
import VfCanvasGrid from './vf-canvas-grid.vue';
import VfCanvasHover from './vf-canvas-hover.vue';

const toolbars = [
  {
    code: 0,
    label: '铅笔',
  },
  {
    code: 1,
    label: '橡皮擦',
  },
  {
    code: 2,
    label: '油漆桶',
  },
];

const canvasEl = ref<HTMLCanvasElement>();
const canvasInfo = ref({
  width: 32,
  height: 32,
  scale: 20,
});
const tool = ref(0);
let pixels = Array.from({ length: canvasInfo.value.width }, () =>
  new Array(canvasInfo.value.height).fill(0)
);

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
      if (tool.value === 0) {
        ctx.fillRect(point.x, point.y, 1, 1);
        pixels[point.x][point.y] = 1;
      } else if (tool.value === 1) {
        ctx.clearRect(point.x, point.y, 1, 1);
        pixels[point.x][point.y] = 0;
      } else if (tool.value === 2) {
        const result = fill(pixels, point, 1);
        result.forEach((row, x) => {
          row.forEach((value, y) => {
            if (value) {
              ctx.fillRect(x, y, 1, 1);
              pixels[x][y] = 1;
            }
          });
        });
      }
    }
  }
};

const handleClear = () => {
  if (window.confirm('确定要清除吗？') && canvasEl.value) {
    const ctx = canvasEl.value.getContext('2d');
    if (ctx) {
      const { width, height } = canvasInfo.value;
      ctx.clearRect(0, 0, width, height);
      pixels = Array.from({ length: canvasInfo.value.width }, () =>
        new Array(canvasInfo.value.height).fill(0)
      );
    }
  }
};

const handlePreview = () => {
  const svg = document.querySelector('#svg');
  if (svg) {
    svg.innerHTML = '';
    const d: string[] = [];
    pixels.forEach((col, x) =>
      col.forEach((c, y) => {
        if (!c) {
          return;
        }
        d.push(`M${x} ${y} L${x} ${y + 1} Z`);
      })
    );
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d.join(' '));
    path.setAttribute('stroke-width', '1');
    svg.appendChild(path);
    // pixels.forEach((col, x) =>
    //   col.forEach((c, y) => {
    //     if (!c) {
    //       return;
    //     }
    //     const rect = document.createElementNS(
    //       'http://www.w3.org/2000/svg',
    //       'rect'
    //     );
    //     rect.setAttribute('x', `${x}`);
    //     rect.setAttribute('y', `${y}`);
    //     rect.setAttribute('width', `1`);
    //     rect.setAttribute('height', `1`);
    //     svg.appendChild(rect);
    //   })
    // );
  }
};

const handleExportSvg = () => {
  handlePreview();
  const preview = document.querySelector('#preview');
  if (preview) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(
      new Blob([preview.outerHTML], { type: 'xml/svg' })
    );
    a.setAttribute('download', 'export.svg');
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 1000);
  }
};
</script>

<style scoped>
canvas {
  image-rendering: pixelated;
}
</style>
