<template>
  <div
    class="absolute inset-0 overflow-hidden group"
    @mousemove="handleMouseMove"
    @mousedown="handleMouseDown"
    @mouseleave="handleMouseUp"
    @mouseup="handleMouseUp"
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
  const { width, height } = props;
  return {
    transform: `translate(${x}px, ${y}px)`,
    width: `${width}px`,
    height: `${height}px`,
  };
});

const drawPoint = (e: MouseEvent) => {
  const { width, height } = props;
  const { offsetX, offsetY } = e;
  const [x, y] = [Math.floor(offsetX / width), Math.floor(offsetY / height)];
  emit('drawPoint', { x, y });
};

let isMoving = false;
const handleMouseDown = (e: MouseEvent) => {
  isMoving = true;
  drawPoint(e);
};
const handleMouseMove = (e: MouseEvent) => {
  const { width, height } = props;
  const { offsetX, offsetY } = e;
  position.value.x = Math.floor(offsetX / width) * width;
  position.value.y = Math.floor(offsetY / height) * height;
  if (isMoving) {
    drawPoint(e);
  }
};
const handleMouseUp = () => {
  isMoving = false;
};
</script>
