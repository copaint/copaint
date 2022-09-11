<template>
  <div
    class="absolute inset-0 overflow-hidden group"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
  >
    <div
      class="absolute border box-border border-sky-500 bg-sky-500/60 pointer-events-none dark:hover:(bg-transparent w-4) hidden group-hover:block"
      :style="style"
    ></div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';

const props = defineProps<{
  width: number;
  height: number;
  scale: number;
  color?: string;
}>();

const emit = defineEmits<{
  (event: 'drawPoint', point: { x: number; y: number }): void;
}>();

const position = ref({
  x: 0,
  y: 0,
});

const style = computed(() => {
  const { x, y } = position.value;
  const { scale } = props;
  return {
    transform: `translate(${x}px, ${y}px)`,
    width: `${scale}px`,
    height: `${scale}px`,
  };
});

const drawPoint = (e: MouseEvent) => {
  const { scale, width, height } = props;
  const { offsetX, offsetY } = e;
  const [x, y] = [Math.floor(offsetX / scale), Math.floor(offsetY / scale)];
  if (x >= 0 && x < width && y >= 0 && y < height) {
    emit('drawPoint', { x, y });
  }
};

let currentTarget: EventTarget | null = null;
const handleMouseDown = (e: MouseEvent) => {
  currentTarget = e.target;
  drawPoint(e);
  const handleMouseMove = (e: MouseEvent) => {
    if (e.target !== currentTarget) {
      return;
    }
    drawPoint(e);
  };
  const handleMouseUp = () => {
    currentTarget = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
};
const handleMouseMove = (e: MouseEvent) => {
  const { scale } = props;
  const { offsetX, offsetY } = e;
  position.value.x = Math.floor(offsetX / scale) * scale;
  position.value.y = Math.floor(offsetY / scale) * scale;
};
</script>
