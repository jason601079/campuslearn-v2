import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, RotateCcw, Play, Pause, Heart, Zap } from "lucide-react";

const StudySprint = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("campusDefenderHighScore");
    return saved ? parseInt(saved) : 0;
  });
  const [isPaused, setIsPaused] = useState(false);

  const gameStateRef = useRef({
    player: { x: 400, y: 500, width: 50, height: 50, speed: 5 },
    bullets: [] as Array<{ x: number; y: number; width: number; height: number }>,
    enemies: [] as Array<{ x: number; y: number; width: number; height: number; speed: number; type: string; health: number }>,
    powerups: [] as Array<{ x: number; y: number; width: number; height: number; type: string }>,
    particles: [] as Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }>,
    score: 0,
    lives: 3,
    level: 1,
    frameCount: 0,
    keys: {} as Record<string, boolean>,
    combo: 0,
    comboTimer: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const enemyTypes = [
      { emoji: "📝", name: "Assignment", health: 1, speed: 1, points: 10 },
      { emoji: "📚", name: "Textbook", health: 2, speed: 0.8, points: 20 },
      { emoji: "📊", name: "Presentation", health: 3, speed: 0.6, points: 30 },
      { emoji: "🎯", name: "Deadline", health: 1, speed: 2, points: 15 },
    ];

    const resetGame = () => {
      gameStateRef.current = {
        player: { x: 400, y: 500, width: 50, height: 50, speed: 5 },
        bullets: [],
        enemies: [],
        powerups: [],
        particles: [],
        score: 0,
        lives: 3,
        level: 1,
        frameCount: 0,
        keys: {},
        combo: 0,
        comboTimer: 0,
      };
      setScore(0);
      setLives(3);
      setLevel(1);
      setGameOver(false);
    };

    const spawnEnemy = () => {
      const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      const baseSpeed = type.speed + (gameStateRef.current.level - 1) * 0.2;
      gameStateRef.current.enemies.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: baseSpeed,
        type: type.emoji,
        health: type.health,
      });
    };

    const spawnPowerup = () => {
      const types = ["💊", "⚡", "🛡️"];
      gameStateRef.current.powerups.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 30,
        height: 30,
        type: types[Math.floor(Math.random() * types.length)],
      });
    };

    const createExplosion = (x: number, y: number, color: string = "#FFD700") => {
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        gameStateRef.current.particles.push({
          x,
          y,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
          life: 30,
          color,
        });
      }
    };

    const checkCollision = (rect1: any, rect2: any) => {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    };

    const shootBullet = () => {
      const state = gameStateRef.current;
      state.bullets.push({
        x: state.player.x + state.player.width / 2 - 2,
        y: state.player.y,
        width: 4,
        height: 15,
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.code] = true;
      if (e.code === "Space" && gameStarted && !gameOver && !isPaused) {
        e.preventDefault();
        shootBullet();
      }
      if (e.code === "Escape" && gameStarted && !gameOver) {
        setIsPaused(prev => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.code] = false;
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    const gameLoop = () => {
      if (!gameStarted || gameOver || isPaused) return;

      const state = gameStateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw space background with stars
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0a0e27");
      gradient.addColorStop(1, "#1a1f3a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      ctx.fillStyle = "#fff";
      for (let i = 0; i < 50; i++) {
        const x = (i * 37) % canvas.width;
        const y = ((i * 51 + state.frameCount) % canvas.height);
        ctx.fillRect(x, y, 2, 2);
      }

      // Update player movement
      if (state.keys["ArrowLeft"] && state.player.x > 0) {
        state.player.x -= state.player.speed;
      }
      if (state.keys["ArrowRight"] && state.player.x < canvas.width - state.player.width) {
        state.player.x += state.player.speed;
      }
      if (state.keys["ArrowUp"] && state.player.y > 300) {
        state.player.y -= state.player.speed;
      }
      if (state.keys["ArrowDown"] && state.player.y < canvas.height - state.player.height) {
        state.player.y += state.player.speed;
      }

      // Draw player (student defender)
      ctx.save();
      ctx.font = "50px Arial";
      ctx.fillText("🎓", state.player.x, state.player.y + 45);
      ctx.restore();

      // Update and draw bullets
      state.bullets = state.bullets.filter(bullet => {
        bullet.y -= 8;
        ctx.fillStyle = "#00ffff";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00ffff";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 0;
        return bullet.y > 0;
      });

      // Spawn enemies
      state.frameCount++;
      const spawnRate = Math.max(60 - state.level * 5, 30);
      if (state.frameCount % spawnRate === 0) {
        spawnEnemy();
      }
      if (state.frameCount % 300 === 0 && Math.random() > 0.5) {
        spawnPowerup();
      }

      // Update and draw enemies
      state.enemies = state.enemies.filter(enemy => {
        enemy.y += enemy.speed;

        // Check bullet collisions
        state.bullets = state.bullets.filter(bullet => {
          if (checkCollision(bullet, enemy)) {
            enemy.health--;
            if (enemy.health <= 0) {
              state.score += 10 * state.level;
              state.combo++;
              state.comboTimer = 60;
              setScore(state.score);
              createExplosion(enemy.x + 20, enemy.y + 20, "#FFD700");
            } else {
              createExplosion(bullet.x, bullet.y, "#00ffff");
            }
            return false;
          }
          return true;
        });

        // Check player collision
        if (checkCollision(state.player, enemy)) {
          state.lives--;
          setLives(state.lives);
          createExplosion(enemy.x + 20, enemy.y + 20, "#ff0000");
          if (state.lives <= 0) {
            setGameOver(true);
            if (state.score > highScore) {
              setHighScore(state.score);
              localStorage.setItem("campusDefenderHighScore", state.score.toString());
            }
          }
          return false;
        }

        // Draw enemy
        if (enemy.y < canvas.height) {
          ctx.font = "40px Arial";
          // Health indicator
          if (enemy.health > 1) {
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(enemy.x, enemy.y - 8, enemy.width, 4);
            ctx.fillStyle = "#00ff00";
            const healthPercent = enemy.health / 3;
            ctx.fillRect(enemy.x, enemy.y - 8, enemy.width * healthPercent, 4);
          }
          ctx.fillText(enemy.type, enemy.x, enemy.y + 35);
          return true;
        }

        // Enemy reached bottom - lose life
        state.lives--;
        setLives(state.lives);
        if (state.lives <= 0) {
          setGameOver(true);
          if (state.score > highScore) {
            setHighScore(state.score);
            localStorage.setItem("campusDefenderHighScore", state.score.toString());
          }
        }
        return false;
      });

      // Update and draw powerups
      state.powerups = state.powerups.filter(powerup => {
        powerup.y += 2;

        if (checkCollision(state.player, powerup)) {
          if (powerup.type === "💊") state.lives = Math.min(state.lives + 1, 5);
          if (powerup.type === "⚡") state.score += 50;
          if (powerup.type === "🛡️") state.lives = Math.min(state.lives + 1, 5);
          setLives(state.lives);
          setScore(state.score);
          createExplosion(powerup.x + 15, powerup.y + 15, "#00ff00");
          return false;
        }

        if (powerup.y < canvas.height) {
          ctx.font = "30px Arial";
          ctx.fillText(powerup.type, powerup.x, powerup.y + 25);
          return true;
        }
        return false;
      });

      // Update and draw particles
      state.particles = state.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.fillRect(p.x, p.y, 3, 3);
        ctx.globalAlpha = 1;
        return p.life > 0;
      });

      // Update combo
      if (state.comboTimer > 0) {
        state.comboTimer--;
        if (state.comboTimer === 0) {
          state.combo = 0;
        }
      }

      // Level up
      if (state.score > state.level * 500) {
        state.level++;
        setLevel(state.level);
      }

      // Draw UI
      ctx.fillStyle = "#fff";
      ctx.font = "bold 24px Arial";
      ctx.fillText(`Score: ${state.score}`, 20, 35);
      ctx.fillText(`Level: ${state.level}`, 20, 65);
      
      if (state.combo > 1) {
        ctx.fillStyle = "#FFD700";
        ctx.font = "bold 20px Arial";
        ctx.fillText(`Combo x${state.combo}!`, canvas.width / 2 - 50, 40);
      }
    };

    let animationId: number;
    const animate = () => {
      gameLoop();
      animationId = requestAnimationFrame(animate);
    };

    if (gameStarted) {
      animate();
    }

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStarted, gameOver, highScore, isPaused]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setLevel(1);
    setIsPaused(false);
  };

  const restartGame = () => {
    setGameStarted(false);
    setTimeout(() => startGame(), 100);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-accent/10">
      <div className="max-w-4xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🚀 Campus Defender 🎓
          </h1>
          <p className="text-muted-foreground">
            Defend your GPA! Shoot down assignments and dodge deadlines!
          </p>
        </div>

        <Card className="p-6 space-y-4 bg-gradient-to-br from-card via-card to-accent/5 border-2">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span className="text-2xl font-bold text-cyan-400">{score}</span>
                <span className="text-sm text-muted-foreground">Score</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-xl font-bold text-red-500">{lives}</span>
                <span className="text-sm text-muted-foreground">Lives</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-purple-500">Lv.{level}</span>
                <span className="text-sm text-muted-foreground">Level</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-lg font-semibold text-yellow-500">{highScore}</span>
                <span className="text-sm text-muted-foreground">Best</span>
              </div>
            </div>
            
            {gameStarted && !gameOver && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
            )}
          </div>

          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full border-2 border-cyan-500/30 rounded-lg bg-[#0a0e27] shadow-lg shadow-cyan-500/20"
            />
            
            {!gameStarted && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-lg">
                <div className="text-center space-y-4 max-w-lg">
                  <div className="text-6xl animate-bounce">🚀</div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Ready to Defend?
                  </h2>
                  <div className="text-sm text-muted-foreground space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p><kbd className="px-2 py-1 bg-background rounded">Arrow Keys</kbd> Move your defender</p>
                    <p><kbd className="px-2 py-1 bg-background rounded">Spacebar</kbd> Shoot bullets to destroy assignments</p>
                    <p><kbd className="px-2 py-1 bg-background rounded">ESC</kbd> Pause game</p>
                    <p className="text-xs pt-2">💊 Health • ⚡ Bonus Points • 🛡️ Shield</p>
                  </div>
                  <Button onClick={startGame} size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-600">
                    <Play className="w-4 h-4" />
                    Start Mission
                  </Button>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-lg">
                <div className="text-center space-y-4">
                  <div className="text-6xl">💥</div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    Mission Failed!
                  </h2>
                  <div className="space-y-2">
                    <p className="text-lg">Final Score: <span className="font-bold text-cyan-400 text-2xl">{score}</span></p>
                    <p className="text-sm text-muted-foreground">Reached Level {level}</p>
                    {score === highScore && score > 0 && (
                      <p className="text-yellow-500 font-semibold text-lg animate-pulse">🎉 New High Score! 🎉</p>
                    )}
                  </div>
                  <Button onClick={restartGame} size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-600">
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {isPaused && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/85 backdrop-blur-sm rounded-lg">
                <div className="text-center space-y-4">
                  <Pause className="w-16 h-16 mx-auto text-cyan-400" />
                  <h2 className="text-2xl font-bold">Mission Paused</h2>
                  <p className="text-muted-foreground">
                    Press <kbd className="px-2 py-1 bg-muted rounded">ESC</kbd> to resume
                  </p>
                  <Button onClick={() => setIsPaused(false)} size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-600">
                    <Play className="w-4 h-4" />
                    Resume Mission
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 text-sm text-muted-foreground flex-wrap justify-center bg-muted/30 p-3 rounded-lg">
            <span className="font-semibold">Controls:</span>
            <kbd className="px-2 py-1 bg-background rounded text-xs">← → ↑ ↓</kbd>
            <span>Move •</span>
            <kbd className="px-2 py-1 bg-background rounded text-xs">Space</kbd>
            <span>Shoot •</span>
            <kbd className="px-2 py-1 bg-background rounded text-xs">ESC</kbd>
            <span>Pause</span>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center hover:scale-105 transition-transform border-red-500/20">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-xs font-semibold text-red-400">Assignments</p>
            <p className="text-xs text-muted-foreground">Quick but deadly</p>
          </Card>
          <Card className="p-4 text-center hover:scale-105 transition-transform border-orange-500/20">
            <div className="text-4xl mb-2">📚</div>
            <p className="text-xs font-semibold text-orange-400">Textbooks</p>
            <p className="text-xs text-muted-foreground">Takes 2 hits</p>
          </Card>
          <Card className="p-4 text-center hover:scale-105 transition-transform border-purple-500/20">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-xs font-semibold text-purple-400">Presentations</p>
            <p className="text-xs text-muted-foreground">Takes 3 hits!</p>
          </Card>
          <Card className="p-4 text-center hover:scale-105 transition-transform border-green-500/20">
            <div className="text-4xl mb-2">💊</div>
            <p className="text-xs font-semibold text-green-400">Power-ups</p>
            <p className="text-xs text-muted-foreground">Collect them all!</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudySprint;
