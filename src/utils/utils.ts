import { Particle } from "../model/Particle";
import { Player } from "../model/Player";
export const calcLength = (particle1: Particle, particle2: Particle) => {
  return Math.sqrt(
    Math.pow(particle2.x - particle1.x, 2) +
      Math.pow(particle2.y - particle1.y, 2)
  );
};
export const calcLengthBetweenLineAndPlayer = (
  particle1: Particle,
  particle2: Particle,
  player: Player
) => {
  if (
    player.x + player.radius < Math.min(particle1.x, particle2.x) ||
    player.x - player.radius > Math.max(particle1.x, particle2.x) ||
    player.y + player.radius < Math.min(particle1.y, particle2.y) ||
    player.y - player.radius > Math.max(particle1.y, particle2.y)
  )
    return false;
  const a = (particle1.y - particle2.y) / (particle1.x - particle2.x);
  const b = particle1.y - particle1.x * a;
  const dst = Math.abs(a * player.x - player.y + b) / Math.sqrt(a * a + 1);
  return dst <= player.radius;
};

export const toRadians = (deg: number) => (deg / 180) * Math.PI;
