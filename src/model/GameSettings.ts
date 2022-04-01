export interface IGameSettings {
  numberOfParticles: number;
  radius: number;
  particleColor: string;
  maxDistanceBetweenParticles: number;
  playerColor: string;
  playerRadius: number;
}
export class GameSettings implements IGameSettings {
  numberOfParticles: number;
  radius: number;
  particleColor: string;
  maxDistanceBetweenParticles: number;
  playerColor: string;
  playerRadius: number;
  constructor(
    numberOfParticles: number,
    radius: number,
    color: string,
    maxDistanceBetweenParticles: number,
    playerColor: string,
    playerRadius: number
  ) {
    this.numberOfParticles = numberOfParticles;
    this.radius = radius;
    this.particleColor = color;
    this.maxDistanceBetweenParticles = maxDistanceBetweenParticles;
    this.playerColor = playerColor;
    this.playerRadius = playerRadius;
  }
}
