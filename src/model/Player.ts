import { Point } from "./Point";

import { toRadians } from "../utils/utils";
export interface IPlayer {
  angle: number;
  speed: number;
  health: number;
  color?: string;
}

export class Player extends Point implements IPlayer {
  angle = -Math.PI / 2;
  health = 100;
  speed = 1;
  left = false;
  right = false;
  turnPower: any;

  constructor(canvas: HTMLCanvasElement, color: string, radius: number) {
    super(
      canvas.width * Math.random(),
      canvas.height * Math.random(),
      radius,
      color
    );
    this.turnPower = toRadians(4);
  }
}
