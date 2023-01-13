import { defineStore } from 'pinia';
import { computed, ref, watchEffect } from 'vue';
import Point from './entries/point';
import { watchCanvasWrapper } from './events';
import { CopaintSettings, Rect } from './types';

export const useCopaintStore = defineStore('copaintStore', () => {
  const settings = ref<CopaintSettings>({
    pageSize: {
      width: 32,
      height: 24,
    },
    view: {
      scale: 32,
      offset: Point.create(),
      bgGrid: {
        visible: true,
        size: 10,
      },
    },
  });
  // doms binding
  const wrapperEl = ref<HTMLDivElement>();
  const canvasEl = ref<HTMLCanvasElement>();

  const isMounted = computed(() => Boolean(wrapperEl.value && canvasEl.value));

  const canvasInfo = computed((): Rect => {
    const {
      pageSize: { width, height },
      view: { scale, offset },
    } = settings.value;

    const size = { width: width * scale, height: height * scale };
    const pos = Point.create();

    // if (wrapperEl.value) {
    //     const wrapperRect = wrapperEl.value.getBoundingClientRect();
    //     pos.x = wrapperRect.width / 2 - size.width / 2;
    //     pos.y = wrapperRect.height / 2 - size.height / 2;
    // }

    return {
      pos,
      size,
    };
  });

  const canvasFullToScreen = () => {
    if (!wrapperEl.value) return;
    const { width, height } = wrapperEl.value.getBoundingClientRect();
    const { width: w, height: h } = settings.value.pageSize;
    settings.value.view.scale = Math.floor(
      Math.max(1, Math.min((width - 200) / w, (height - 20) / h))
    );
  };

  watchEffect((onCleanup) => {
    if (wrapperEl.value && canvasEl.value) {
      onCleanup(watchCanvasWrapper(wrapperEl.value, canvasEl.value, settings));
    }
  });

  const dialogVisible = ref({
    newFile: true,
    about: false,
  });

  return {
    isMounted,
    settings,
    wrapperEl,
    canvasEl,
    canvasInfo,
    canvasFullToScreen,
    dialogVisible,
  };
});
