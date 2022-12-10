export default class Point {
  public x!: number;
  public y!: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public clone() {
    return new Point(this.x, this.y);
  }

  public round() {
    return this.map(Math.round);
  }

  public floor() {
    return this.map(Math.floor);
  }

  public map(fn: (i: number) => number) {
    const clone = this.clone();
    clone.x = fn(clone.x);
    clone.y = fn(clone.y);
    return clone;
  }

  public equal(p: Point) {
    return p ? p.x === this.x && p.y === this.y : false;
  }

  public fourNeighboringWith(p: Point) {
    const a = this.floor();
    const b = p.floor();
    return (
      (a.x === b.x && (a.y === b.y || a.y - 1 === b.y || a.y + 1 === b.y)) ||
      (a.y === b.y && (a.x === b.x || a.x - 1 === b.x || a.x + 1 === b.x))
    );
  }

  public eightNeighboringWith(p: Point) {
    const a = this.floor();
    const b = p.floor();
    return (
      (a.x - 1 === b.x && a.y - 1 === b.y) ||
      (a.x === b.x && a.y - 1 === b.y) ||
      (a.x + 1 === b.x && a.y - 1 === b.y) ||
      (a.x - 1 === b.x && a.y === b.y) ||
      (a.x === b.x && a.y === b.y) ||
      (a.x + 1 === b.x && a.y === b.y) ||
      (a.x - 1 === b.x && a.y + 1 === b.y) ||
      (a.x === b.x && a.y + 1 === b.y) ||
      (a.x + 1 === b.x && a.y + 1 === b.y)
    );
  }

  public toString() {
    return `(${this.x}, ${this.y})`;
  }

  public static create(x = 0, y = 0) {
    return new Point(x, y);
  }
}
