import { Point } from '../types';

export { default as default } from './vf-canvas.vue';

export const fill = (pixels: number[][], point: Point, targetColor: number) => {
  const width = pixels.length;
  const heigth = pixels[0]?.length ?? 0;
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
      if (p.y > 0) _fill({ x: p.x, y: p.y - 1 });
      // right
      if (p.x < width - 1) _fill({ x: p.x + 1, y: p.y });
      // bottom
      if (p.y < heigth - 1) _fill({ x: p.x, y: p.y + 1 });
      // left
      if (p.x > 0) _fill({ x: p.x - 1, y: p.y });
    };
    _fill(point);
  }
  return result;
};
