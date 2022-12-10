import Point from './entries/point';

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  size: Size;
  pos: Point;
}

export interface CopaintSettings {
  pageSize: Size;
  view: {
    scale: number;
    offset: Point;
    bgGrid: {
      visible: boolean;
      size: number;
    };
  };
}

export type EventPayload = {
  // 原生事件
  event: MouseEvent;
  // 容器内鼠标位置
  wrapperPos: Point;
  // 画板内鼠标位置
  canvasPos: Point;
  // 画板内像素格子位置
  mappingPos: Point;
  // 是否进入画板
  inCanvas: boolean;
  // 是否正在拖动
  isDragging: boolean;
};
