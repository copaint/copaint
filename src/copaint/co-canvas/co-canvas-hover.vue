<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute border box-border border-sky-500 bg-sky-500/60" :style="style"></div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, ref, watchEffect } from 'vue';
import Point from '../entries/point';
import { eventBus } from '../events';
import { useCopaintStore } from '../store';
import { EventPayload } from '../types';

const position = ref(Point.create());
const inCanvas = ref(false);

const handleMouseMove = (payload: EventPayload) => {
  inCanvas.value = payload.inCanvas;
  if (payload.inCanvas) {
    position.value = payload.mappingPos.floor();
  }
};

watchEffect((onCleanup) => {
  eventBus.on('mouseMove', handleMouseMove)
  onCleanup(() => {
    eventBus.off('mouseMove', handleMouseMove)
  })
})


const { settings } = storeToRefs(useCopaintStore());

const style = computed(() => {
  if (!inCanvas.value) {
    return {
      display: 'none'
    };
  }
  const { x, y } = position.value;
  const { scale } = settings.value.view;
  return {
    transform: `translate(${x * scale}px, ${y * scale}px)`,
    width: `${scale}px`,
    height: `${scale}px`,
  };
});
</script>
