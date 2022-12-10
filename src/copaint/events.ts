import mitt from 'mitt';
import { Ref } from 'vue';
import Point from './entries/point';
import { CopaintSettings, EventPayload } from './types';

type Events = {
  mouseDown: EventPayload;
  mouseMove: EventPayload;
  mouseUp: EventPayload;
  mouseDrag: EventPayload;
};

export const eventBus = mitt<Events>();

// 给画板容器添加事件
// [ ]. mouseMove
// [ ]. mouseDown
// [ ]. mouseUp
// [ ]. mouseDrag
export const watchCanvasWrapper = (
  wrapperEl: HTMLElement,
  canvasEl: HTMLElement,
  settings: Ref<CopaintSettings>
) => {
  let isMouseDown = false;
  const handleMouseMove = (event: MouseEvent) => {
    if (!isMouseDown) {
      eventBus.emit(
        'mouseMove',
        getEventPayload({
          event,
          wrapperEl,
          canvasEl,
          settings: settings.value,
        })
      );
    }
  };
  const handleMouseDown = (event: MouseEvent) => {
    isMouseDown = true;
    eventBus.emit(
      'mouseDown',
      getEventPayload({ event, wrapperEl, canvasEl, settings: settings.value })
    );
    const handleMouseMove = (event: MouseEvent) => {
      eventBus.emit(
        'mouseDrag',
        getEventPayload({
          event,
          wrapperEl,
          canvasEl,
          settings: settings.value,
          payload: {
            isDragging: true,
          },
        })
      );
      eventBus.emit(
        'mouseMove',
        getEventPayload({
          event,
          wrapperEl,
          canvasEl,
          settings: settings.value,
          payload: {
            isDragging: true,
          },
        })
      );
    };
    const handleMouseUp = () => {
      isMouseDown = false;
      eventBus.emit(
        'mouseUp',
        getEventPayload({
          event,
          wrapperEl,
          canvasEl,
          settings: settings.value,
        })
      );
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  wrapperEl.addEventListener('mousemove', handleMouseMove);
  wrapperEl.addEventListener('mousedown', handleMouseDown);

  return () => {
    wrapperEl.removeEventListener('mousedown', handleMouseMove);
  };
};

const getEventPayload = ({
  event,
  wrapperEl,
  canvasEl,
  settings,
  payload = {},
}: {
  event: MouseEvent;
  wrapperEl: HTMLElement;
  canvasEl: HTMLElement;
  settings: CopaintSettings;
  payload?: Partial<EventPayload>;
}): EventPayload => {
  const wrapperRect = wrapperEl.getBoundingClientRect();
  const canvasRect = canvasEl.getBoundingClientRect();

  const inCanvas =
    event.x >= canvasRect.x &&
    event.x <= canvasRect.x + canvasRect.width &&
    event.y >= canvasRect.y &&
    event.y <= canvasRect.y + canvasRect.height;

  const canvasPos = Point.create(
    event.x - canvasRect.x,
    event.y - canvasRect.y
  );

  const mappingPos = Point.create(
    canvasPos.x / settings.view.scale,
    canvasPos.y / settings.view.scale
  );

  return {
    event,
    // 容器内鼠标位置
    wrapperPos: Point.create(event.x - wrapperRect.x, event.y - wrapperRect.y),
    // 画板内鼠标位置
    canvasPos,
    mappingPos,
    // 是否进入画板
    inCanvas,
    isDragging: false,
    ...payload,
  };
};
