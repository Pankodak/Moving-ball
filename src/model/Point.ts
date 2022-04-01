interface IPoint {
  x: number;
  y: number;
  radius: number;
  color: string;
}

export class Point implements IPoint {
  x = 0;
  y = 0;
  radius = 0;
  color: string;
  constructor(x: number, y: number, radius: number, color?: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color || "";
  }
}
