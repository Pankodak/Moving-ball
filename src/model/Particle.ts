import { Point } from "./Point";
interface IParticle {
  speed: {
    x: number;
    y: number;
  };
}
export class Particle extends Point implements IParticle {
  speed = {
    x: 0,
    y: 0,
  };
  constructor(x: number, y: number, radius: number) {
    super(x, y, radius);
    this.speed.x =
      Math.random() > 0.5
        ? Math.random() * 0.3 + 0.01
        : -(Math.random() * 0.3 + 0.01);
    this.speed.y =
      Math.random() > 0.5
        ? Math.random() * 0.3 + 0.01
        : -(Math.random() * 0.3 + 0.01);
  }
}
