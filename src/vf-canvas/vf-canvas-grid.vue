<template>
  <canvas
    ref="gridEl"
    :width="width * scale * 2"
    :height="height * scale * 2"
    :style="canvasStyle"
    class="absolute inset-0 pointer-events-none"
  ></canvas>
</template>
<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';

const props = defineProps<{
  width: number;
  height: number;
  scale: number;
}>();
const gridEl = ref<HTMLCanvasElement>();

const canvasStyle = computed(() => {
  const { width, height, scale } = props;
  return {
    width: `${width * scale}px`,
    height: `${height * scale}px`,
  };
});

const initializeGrid = () => {
  if (gridEl.value) {
    const ctx = gridEl.value.getContext('2d');
    if (ctx) {
      const { width, height, scale } = props;
      ctx.beginPath();
      for (let i = 0; i < height * 2; i += 2) {
        ctx.moveTo(0, scale * i);
        ctx.lineTo(height * scale * 2, scale * i);
      }
      for (let i = 0; i < width * 2; i += 2) {
        ctx.moveTo(scale * i, 0);
        ctx.lineTo(scale * i, width * scale * 2);
      }
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(128, 128, 128, 0.2)';
      ctx.stroke();
    }
  }
};

watchEffect(() => {
  initializeGrid();
});
</script>
