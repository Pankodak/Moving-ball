import { Player } from "./model/Player";
import { GameSettings } from "./model/GameSettings";
import { Particle } from "./model/Particle";
import { calcLength, calcLengthBetweenLineAndPlayer } from "./utils/utils";
interface Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    height: number;
    width: number;
    particles: Particle[];
    gameSettings: GameSettings;
    player: Player;
    playerInfoDOM: {
        health: HTMLElement;
        time: HTMLElement;
    };
    gameOver: boolean;
    time: number;
    initCanvas(): void;
    run(): void;
    draw(now: number): void;
    clearCanvas(): void;
    drawParticlesAndCheckCollisions(): void;
    drawLinesBetweenParticles(): void;
    drawPlayer(): void;
    updatePlayer(delta: number): void;
    updateParticles(delta: number): void;
}
class Game implements Game {
    particles: Particle[] = [];
    gameOver = false;
    time = 0;
    constructor(
        canvas: HTMLCanvasElement,
        GameSettings: GameSettings,
        playerInfo: HTMLElement
    ) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = canvas.getContext("2d")!;
        this.gameSettings = GameSettings;
        this.player = new Player(
            this.canvas,
            this.gameSettings.playerColor,
            this.gameSettings.playerRadius
        );
        this.playerInfoDOM = {
            health: playerInfo.querySelector(".health")! as HTMLElement,
            time: playerInfo.querySelector(".time")! as HTMLElement,
        };
        window.addEventListener("keydown", this.onKeyDown.bind(this), false);
        window.addEventListener("keyup", this.onKeyUp.bind(this), false);
    }
    onKeyUp(event: KeyboardEvent) {
        if (event.keyCode == 65 || event.keyCode == 37)
            this.player.left = false;
        if (event.keyCode == 68 || event.keyCode == 39)
            this.player.right = false;
    }
    onKeyDown(event: KeyboardEvent) {
        if (event.keyCode == 65 || event.keyCode == 37) this.player.left = true;
        if (event.keyCode == 68 || event.keyCode == 39)
            this.player.right = true;
    }

    initCanvas() {
        this.drawRect(0, 0, this.canvas.width, this.canvas.height, "#000");
    }
    clearCanvas() {
        this.drawRect(0, 0, this.canvas.width, this.canvas.height, "#000");
    }
    generateParticles() {
        for (let i = 0; i < this.gameSettings.numberOfParticles; i++) {
            this.particles.push(
                new Particle(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height,
                    this.gameSettings.radius
                )
            );
        }
    }
    drawParticlesAndCheckCollisions() {
        let damagePlayer = false;
        this.particles.forEach((particle) => {
            this.ctx.fillStyle = this.gameSettings.particleColor;
            this.drawCircle(particle.x, particle.y, particle.radius);
        });
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle2 = this.particles[j];
                const difference = calcLength(particle2, particle);
                if (
                    difference < this.gameSettings.maxDistanceBetweenParticles
                ) {
                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.lineWidth = Math.min(250 / difference, 4);
                    if (
                        calcLengthBetweenLineAndPlayer(
                            particle2,
                            particle,
                            this.player
                        )
                    ) {
                        this.ctx.lineWidth = 5;
                        damagePlayer = true;
                    }
                    this.ctx.strokeStyle = calcLengthBetweenLineAndPlayer(
                        particle2,
                        particle,
                        this.player
                    )
                        ? "#FFFF00"
                        : "#FFFFFF";
                    this.ctx.moveTo(particle2.x, particle2.y);
                    this.ctx.lineTo(particle.x, particle.y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
        if (damagePlayer) {
            this.player.health -= 0.5;
            if (this.player.health <= 0) {
                this.gameOver = true;
            }
        } else if (this.player.health < 100) {
            this.player.health += 0.01;
        }
    }
    updateParticles(delta: number) {
        this.particles.forEach((particle) => {
            particle.speed.x > 0
                ? (particle.speed.x += 0.00025)
                : (particle.speed.x -= 0.00025);
            particle.speed.y > 0
                ? (particle.speed.y += 0.00025)
                : (particle.speed.y -= 0.00025);
            particle.x += particle.speed.x * (delta / 16);
            particle.y += particle.speed.y * (delta / 16);
            if (particle.x > this.canvas.width + 2 * particle.radius) {
                particle.x = -2 * particle.radius;
            } else if (particle.x < 0 - 2 * particle.radius)
                particle.x = this.canvas.width + 2 * particle.radius - 1;

            if (particle.y > this.canvas.height + 2 * particle.radius) {
                particle.y = -2 * particle.radius;
            } else if (particle.y < 0 - 2 * particle.radius) {
                particle.y = this.canvas.height + 2 * particle.radius - 1;
            }
        });
    }
    updatePlayer(delta: number) {
        this.player.speed += 0.0005;
        if (this.player.left)
            this.player.angle -= this.player.turnPower * (delta / 16);
        if (this.player.right)
            this.player.angle += this.player.turnPower * (delta / 16);
        this.player.x +=
            Math.cos(this.player.angle) * this.player.speed * (delta / 16);
        this.player.y +=
            Math.sin(this.player.angle) * this.player.speed * (delta / 16);

        if (this.player.x > this.canvas.width + 2 * this.player.radius) {
            this.player.x = -2 * this.player.radius;
        } else if (this.player.x < 0 - 2 * this.player.radius) {
            this.player.x = this.canvas.width + 2 * this.player.radius - 1;
        }

        if (this.player.y > this.canvas.height + 2 * this.player.radius) {
            this.player.y = -2 * this.player.radius;
        } else if (this.player.y < 0 - 2 * this.player.radius) {
            this.player.y = this.canvas.height + 2 * this.player.radius - 1;
        }
    }
    drawPlayer() {
        this.ctx.fillStyle = this.player.color;
        this.drawCircle(this.player.x, this.player.y, this.player.radius);
        this.playerInfoDOM.health.textContent = `HP: ${Math.floor(
            this.player.health
        )}%`;
        this.playerInfoDOM.time.textContent = `Time: ${Math.floor(
            this.time
        )} sec`;
    }
    drawCircle(x: number, y: number, radius: number) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.stroke();
    }
    drawRect(x1: number, y1: number, x2: number, y2: number, color: string) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x1, y1, x2, y2);
    }
    draw(delta: number) {
        this.clearCanvas();
        this.updateParticles(delta);
        this.updatePlayer(delta);
        this.drawParticlesAndCheckCollisions();
        this.drawPlayer();
    }
    animate(time: number) {
        this.draw(time);
    }
    run() {
        this.initCanvas();
        this.generateParticles();
        let last = 0,
            dt = 0;
        let tick = (time: number) => {
            if (this.gameOver) {
                this.clearCanvas();
                this.playerInfoDOM.health.remove();
                this.playerInfoDOM.time.textContent = `Your score is ${Math.floor(
                    this.time
                )} sec`;
                this.playerInfoDOM.time.style.textAlign = "center";
                return;
            }
            this.time = time / 1000;
            dt = time - last;
            last = time;
            this.animate(Math.min(dt, 1000));
            requestAnimationFrame(tick);
        };

        tick(0);
    }
}
const gameSettings = new GameSettings(50, 4, "#c82124", 250, "#00BFFF", 20);
const game = new Game(
    document.querySelector("#canvas")! as HTMLCanvasElement,
    gameSettings,
    document.querySelector(".infoPlayer")! as HTMLElement
);
game.run();
