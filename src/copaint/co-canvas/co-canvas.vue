<template>
  <div ref="wrapperEl" class="w-full h-full text-white">
    <div class="relative flex left-1/2 top-1/2" :style="canvasWrapperStyle">
      <VfCanvasGrid />
      <!-- 主画布 -->
      <canvas ref="canvasEl" v-bind="settings.pageSize" :style="canvasStyle" class="bg-white"></canvas>
      <!-- 临时画布 -->
      <canvas ref="tmpCanvasEl" v-bind="settings.pageSize" :style="canvasStyle" class="absolute inset-0"></canvas>
      <VfCanvasHover />
      <div class="absolute top-0 -right-24">
        <button v-for="b in toolbars" :key="b.code" @click="tool = b.code" class="block mb-2"
          :class="{ 'font-bold border-b': b.code === tool }">
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
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watchEffect } from 'vue';
import Point from '../entries/point';
import { eventBus } from '../events';
import { clearOutside, fill, getCanvasCtx, getLinePath, pixelPerfect } from '../helpers';
import { useCopaintStore } from '../store';
import { EventPayload } from '../types';
import VfCanvasGrid from './co-canvas-grid.vue';
import VfCanvasHover from './co-canvas-hover.vue';

const { settings, wrapperEl, canvasEl, isMounted, canvasInfo } = storeToRefs(useCopaintStore());
const tmpCanvasEl = ref<HTMLCanvasElement>();

const toolbars = [
  {
    code: 0,
    label: '铅笔',
  },
  {
    code: 1,
    label: '橡皮擦',
  },
  // {
  //   code: 2,
  //   label: '油漆桶',
  // },
];

const tool = ref(0);
let drawPoints: Point[] = [];

const canvasWrapperStyle = computed(() => {
  const { view: { offset: { x, y } } } = settings.value;
  const { size: { width, height } } = canvasInfo.value;
  return {
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(${x - width / 2}px, ${y - height / 2}px)`,
  };
});

const canvasStyle = computed(() => {
  const { width, height } = canvasInfo.value.size;
  return {
    width: `${width}px`,
    height: `${height}px`,
  };
});

let mouseMovePath: Point[] = [];
const appendPointToPath = (p: Point) => {
  const lastPoint = mouseMovePath.length ? mouseMovePath[mouseMovePath.length - 1] : null;
  if (lastPoint && p.floor().equal(lastPoint)) {
    return;
  }
  // 判断两点是否相邻，否则补全中间点
  if (lastPoint && !lastPoint.eightNeighboringWith(p)) {
    mouseMovePath.push(...getLinePath(lastPoint, p.floor()));
  }
  mouseMovePath.push(p.floor());
  mouseMovePath = pixelPerfect(mouseMovePath);
};

const handleMouseDrag = (payload: EventPayload) => {
  const p = payload.mappingPos;
  if (tool.value === 1) {
    mouseMovePath.push(p.floor());
    clearPointsTo(mouseMovePath);
  } else {
    appendPointToPath(p);
    clearCanvas(tmpCanvasEl.value);
    drawPointsTo(mouseMovePath, tmpCanvasEl.value);
  }
};

const handleMouseUp = () => {
  clearCanvas(tmpCanvasEl.value);
  const newPath = clearOutside(mouseMovePath, settings.value.pageSize);
  if (tool.value === 1) {
    const clearPoints = mouseMovePath.map(p => p.toString());
    drawPoints = drawPoints.filter((p) => !clearPoints.includes(p.toString()));
  } else {
    drawPointsTo(newPath);
    drawPoints = drawPoints.concat(newPath);
  }
  mouseMovePath = [];
};

watchEffect((onCleanup) => {
  eventBus.on('mouseDown', handleMouseDrag);
  eventBus.on('mouseDrag', handleMouseDrag);
  eventBus.on('mouseUp', handleMouseUp);
  onCleanup(() => {
    eventBus.off('mouseDown', handleMouseDrag);
    eventBus.off('mouseDrag', handleMouseDrag);
    eventBus.off('mouseUp', handleMouseUp);
  })
})
/**
 * 绘制点到画板
 * @param points 点们
 * @param el 目标画板元素
 */
const drawPointsTo = (points: Point[], el?: HTMLCanvasElement) => {
  const ctx = getCanvasCtx(el ?? canvasEl.value);
  if (!ctx) return;
  points.forEach((point) => {
    ctx.fillRect(point.x, point.y, 1, 1);
  });
}
/**
 * 清除画板上的点
 * @param points 点们
 * @param el 目标画板元素
 */
const clearPointsTo = (points: Point[], el?: HTMLCanvasElement) => {
  const ctx = getCanvasCtx(el ?? canvasEl.value);
  if (!ctx) return;
  points.forEach((point) => {
    ctx.clearRect(point.x, point.y, 1, 1);
  });
}
/**
 * 清除画板内容
 * @param el 目标画板元素
 */
const clearCanvas = (el?: HTMLCanvasElement) => {
  const ctx = getCanvasCtx(el);
  if (!el || !ctx) return;
  ctx.clearRect(0, 0, el.width, el.height);
}

const handleClear = () => {
  if (window.confirm('确定要清除吗？')) {
    clearCanvas(canvasEl.value);
    drawPoints = [];
  }
};

const handlePreview = () => {
  const svg = document.querySelector('#svg');
  if (svg) {
    svg.innerHTML = '';
    const d: string[] = [];
    drawPoints.forEach(({ x, y }) => {
      d.push(`M${x} ${y} L${x} ${y + 1} Z`);
    });
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
