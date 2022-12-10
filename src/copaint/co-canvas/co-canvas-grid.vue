<template>
  <canvas ref="gridEl" v-bind="canvasInfo.size" :style="canvasStyle"
    class="absolute inset-0 pointer-events-none"></canvas>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, ref, watchEffect } from 'vue';
import { useCopaintStore } from '../store';

const { settings, canvasInfo } = storeToRefs(useCopaintStore());

const gridEl = ref<HTMLCanvasElement>();

const canvasStyle = computed(() => {
  const { width, height } = canvasInfo.value.size;
  return {
    width: `${width}px`,
    height: `${height}px`,
  };
});

const drawBg = () => {
  if (gridEl.value) {
    const ctx = gridEl.value.getContext('2d');
    if (ctx) {
      const {
        pageSize: { width, height },
        view: { scale, bgGrid: { size: gridSize } }
      } = settings.value;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      for (let i = 0; i < width * scale; i += gridSize * scale * 2) {
        let t = 0;
        for (let j = 0; j < height * scale; j += gridSize * scale) {
          ctx.fillRect(i + gridSize * scale * (t % 2), j, gridSize * scale, gridSize * scale);
          t++;
        }
      }
    }
  }
};

watchEffect(() => {
  drawBg();
});
</script>
