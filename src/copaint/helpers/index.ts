import Point from '../entries/point';
import { Size } from '../types';

export const fill = (pixels: number[][], point: Point, targetColor: number) => {
  const width = pixels.length;
  const height = pixels[0]?.length ?? 0;
  const result = Array.from({ length: width }, () => [] as number[]);
  const pointColor = pixels[point.x]?.[point.y];

  if (typeof pointColor === 'number') {
    const _fill = (p: Point) => {
      const color = result[p.x][p.y];
      if (color === targetColor || pixels[p.x][p.y] === targetColor) {
        return;
      }
      result[p.x][p.y] = targetColor;
      // top
      if (p.y > 0) _fill(Point.create(p.x, p.y - 1));
      // right
      if (p.x < width - 1) _fill(Point.create(p.x + 1, p.y));
      // bottom
      if (p.y < height - 1) _fill(Point.create(p.x, p.y + 1));
      // left
      if (p.x > 0) _fill(Point.create(p.x - 1, p.y));
    };
    _fill(point);
  }
  return result;
};

export const getCanvasCtx = (canvasEl?: HTMLCanvasElement) => {
  return canvasEl?.getContext('2d');
};

/**
 * 画直线
 * @param from 起点
 * @param to 终点
 * @returns 点路径
 */
export const getLinePath = (from: Point, to: Point): Point[] => {
  let { x: x0, y: y0 } = from;
  let { x: x1, y: y1 } = to;
  const path: Point[] = [];

  const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
  if (steep) {
    [x0, y0] = [y0, x0];
    [x1, y1] = [y1, x1];
  }
  if (x0 > x1) {
    [x0, x1] = [x1, x0];
    [y0, y1] = [y1, y0];
  }
  const deltaX = x1 - x0;
  const deltaY = Math.abs(y1 - y0);
  let error = 0;
  let deltaErr = deltaY / deltaX;
  let yStep = y0 < y1 ? 1 : -1;
  let y = y0;
  for (let x = x0; x <= x1; x++) {
    if (steep) {
      path.push(Point.create(y, x));
    } else {
      path.push(Point.create(x, y));
    }
    error += deltaErr;
    if (error >= 0.5) {
      y += yStep;
      error -= 1;
    }
  }

  return path;
};

/**
 * 处理像素路径为完美像素
 * @param path 原路径点
 * @returns 处理后的路径点
 */
export const pixelPerfect = (path: Point[]): Point[] => {
  if (path.length > 2) {
    const lastPoints = path.splice(-3);
    const [a, b, c] = lastPoints;
    // 三个像素点是四邻域相连，且非同一直线
    if (
      !((a.x === b.x && b.x === c.x) || (a.y === b.y && b.y === c.y)) &&
      b.fourNeighboringWith(a) &&
      b.fourNeighboringWith(c)
    ) {
      lastPoints.splice(1, 1);
    }
    path.push(...lastPoints);
  }
  return path;
};

/**
 * 清除画板外的像素点
 * @param points 原始像素点
 * @returns 处理后的像素点
 */
export const clearOutside = (points: Point[], canvasSize: Size): Point[] => {
  return points.filter(
    (p) =>
      p.x >= 0 && p.y >= 0 && p.x < canvasSize.width && p.y < canvasSize.height
  );
};
