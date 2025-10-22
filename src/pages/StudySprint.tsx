import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, RotateCcw, Play, Pause } from "lucide-react";

const StudySprint = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("studySprintHighScore");
    return saved ? parseInt(saved) : 0;
  });
  const [isPaused, setIsPaused] = useState(false);

  const gameStateRef = useRef({
    player: { x: 50, y: 0, width: 40, height: 50, velocityY: 0, isJumping: false },
    obstacles: [] as Array<{ x: number; y: number; width: number; height: number; type: string }>,
    collectibles: [] as Array<{ x: number; y: number; width: number; height: number; collected: boolean }>,
    gameSpeed: 3,
    score: 0,
    frameCount: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GROUND_Y = canvas.height - 80;
    const GRAVITY = 0.6;
    const JUMP_FORCE = -12;

    const obstacleTypes = [
      { emoji: "📚", name: "books" },
      { emoji: "☕", name: "coffee" },
      { emoji: "💤", name: "stress" },
      { emoji: "📱", name: "phone" },
    ];

    const resetGame = () => {
      gameStateRef.current = {
        player: { x: 50, y: GROUND_Y, width: 40, height: 50, velocityY: 0, isJumping: false },
        obstacles: [],
        collectibles: [],
        gameSpeed: 3,
        score: 0,
        frameCount: 0,
      };
      setScore(0);
      setGameOver(false);
    };

    const spawnObstacle = () => {
      const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
      gameStateRef.current.obstacles.push({
        x: canvas.width,
        y: GROUND_Y,
        width: 35,
        height: 35,
        type: type.emoji,
      });
    };

    const spawnCollectible = () => {
      gameStateRef.current.collectibles.push({
        x: canvas.width,
        y: GROUND_Y - 100 - Math.random() * 50,
        width: 30,
        height: 30,
        collected: false,
      });
    };

    const checkCollision = (rect1: any, rect2: any) => {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    };

    const jump = () => {
      if (!gameStateRef.current.player.isJumping) {
        gameStateRef.current.player.velocityY = JUMP_FORCE;
        gameStateRef.current.player.isJumping = true;
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && gameStarted && !gameOver && !isPaused) {
        e.preventDefault();
        jump();
      }
      if (e.code === "Escape" && gameStarted && !gameOver) {
        setIsPaused(prev => !prev);
      }
    };

    const handleClick = () => {
      if (gameStarted && !gameOver && !isPaused) {
        jump();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    canvas.addEventListener("click", handleClick);

    const gameLoop = () => {
      if (!gameStarted || gameOver || isPaused) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(1, "#E0F6FF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = "#90EE90";
      ctx.fillRect(0, GROUND_Y + 50, canvas.width, canvas.height - GROUND_Y);
      
      // Ground line
      ctx.strokeStyle = "#228B22";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 50);
      ctx.lineTo(canvas.width, GROUND_Y + 50);
      ctx.stroke();

      // Update player
      const player = gameStateRef.current.player;
      player.velocityY += GRAVITY;
      player.y += player.velocityY;

      if (player.y >= GROUND_Y) {
        player.y = GROUND_Y;
        player.velocityY = 0;
        player.isJumping = false;
      }

      // Draw player (running student)
      ctx.font = "40px Arial";
      ctx.fillText("🎓", player.x, player.y + 40);

      // Spawn obstacles
      gameStateRef.current.frameCount++;
      if (gameStateRef.current.frameCount % 120 === 0) {
        spawnObstacle();
      }
      if (gameStateRef.current.frameCount % 200 === 0) {
        spawnCollectible();
      }

      // Update and draw obstacles
      gameStateRef.current.obstacles = gameStateRef.current.obstacles.filter(obstacle => {
        obstacle.x -= gameStateRef.current.gameSpeed;

        if (obstacle.x + obstacle.width > 0) {
          ctx.font = "35px Arial";
          ctx.fillText(obstacle.type, obstacle.x, obstacle.y + 35);

          if (checkCollision(player, obstacle)) {
            setGameOver(true);
            if (gameStateRef.current.score > highScore) {
              setHighScore(gameStateRef.current.score);
              localStorage.setItem("studySprintHighScore", gameStateRef.current.score.toString());
            }
          }
          return true;
        }
        return false;
      });

      // Update and draw collectibles
      gameStateRef.current.collectibles = gameStateRef.current.collectibles.filter(collectible => {
        if (collectible.collected) return false;
        
        collectible.x -= gameStateRef.current.gameSpeed;

        if (collectible.x + collectible.width > 0) {
          ctx.font = "30px Arial";
          ctx.fillText("🧠", collectible.x, collectible.y + 30);

          if (checkCollision(player, collectible)) {
            collectible.collected = true;
            gameStateRef.current.score += 10;
            setScore(gameStateRef.current.score);
          }
          return true;
        }
        return false;
      });

      // Increase score and speed over time
      if (gameStateRef.current.frameCount % 10 === 0) {
        gameStateRef.current.score += 1;
        setScore(gameStateRef.current.score);
      }

      if (gameStateRef.current.frameCount % 500 === 0) {
        gameStateRef.current.gameSpeed += 0.5;
      }

      // Draw score
      ctx.fillStyle = "#000";
      ctx.font = "24px Arial";
      ctx.fillText(`Score: ${gameStateRef.current.score}`, 20, 40);
      ctx.fillText(`High: ${highScore}`, 20, 70);
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
      document.removeEventListener("keydown", handleKeyPress);
      canvas.removeEventListener("click", handleClick);
    };
  }, [gameStarted, gameOver, highScore, isPaused]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Study Sprint 🎓
          </h1>
          <p className="text-muted-foreground">
            Jump over study obstacles and collect brain boosts!
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{score}</span>
                <span className="text-sm text-muted-foreground">Score</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-lg font-semibold">{highScore}</span>
                <span className="text-sm text-muted-foreground">High Score</span>
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
              height={400}
              className="w-full border-2 border-border rounded-lg bg-sky-100"
            />
            
            {!gameStarted && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🎓</div>
                  <h2 className="text-2xl font-bold">Ready to Sprint?</h2>
                  <p className="text-muted-foreground max-w-md">
                    Press <kbd className="px-2 py-1 bg-muted rounded">Space</kbd> or click to jump over obstacles!
                    <br />
                    Collect 🧠 brains for bonus points!
                  </p>
                  <Button onClick={startGame} size="lg" className="gap-2">
                    <Play className="w-4 h-4" />
                    Start Game
                  </Button>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-lg">
                <div className="text-center space-y-4">
                  <div className="text-6xl">💥</div>
                  <h2 className="text-2xl font-bold">Game Over!</h2>
                  <p className="text-lg">Final Score: <span className="font-bold text-primary">{score}</span></p>
                  {score === highScore && score > 0 && (
                    <p className="text-yellow-500 font-semibold">🎉 New High Score!</p>
                  )}
                  <Button onClick={restartGame} size="lg" className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                  </Button>
                </div>
              </div>
            )}

            {isPaused && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
                <div className="text-center space-y-4">
                  <Pause className="w-16 h-16 mx-auto text-primary" />
                  <h2 className="text-2xl font-bold">Paused</h2>
                  <p className="text-muted-foreground">
                    Press <kbd className="px-2 py-1 bg-muted rounded">ESC</kbd> to resume
                  </p>
                  <Button onClick={() => setIsPaused(false)} size="lg" className="gap-2">
                    <Play className="w-4 h-4" />
                    Resume
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 text-sm text-muted-foreground flex-wrap">
            <span>Controls:</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd>
            <span>or</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Click</kbd>
            <span>to jump •</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs">ESC</kbd>
            <span>to pause</span>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-xs text-muted-foreground">Avoid textbooks</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl mb-2">☕</div>
            <p className="text-xs text-muted-foreground">Dodge coffee cups</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl mb-2">💤</div>
            <p className="text-xs text-muted-foreground">Skip stress clouds</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl mb-2">🧠</div>
            <p className="text-xs text-muted-foreground">Collect brains!</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudySprint;
