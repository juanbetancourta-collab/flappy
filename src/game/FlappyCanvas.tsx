import React, { useEffect, useRef, useCallback } from 'react';
import { BirdSkin, EnvironmentTheme, Difficulty, DIFFICULTY_SETTINGS, GameState } from '../types/game';
import { sounds } from '../audio/soundEffects';

interface FlappyCanvasProps {
  gameState: GameState;
  restartTrigger: number;
  onGameStateChange: (state: GameState) => void;
  onScoreUpdate: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onFlapCount: () => void;
  birdSkin: BirdSkin;
  theme: EnvironmentTheme;
  difficulty: Difficulty;
  isPaused: boolean;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  passed: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  decay: number;
  rotation?: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  alpha: number;
  vy: number;
}

const LOGICAL_WIDTH = 400;
const LOGICAL_HEIGHT = 620;
const GROUND_HEIGHT = 90;

export const FlappyCanvas: React.FC<FlappyCanvasProps> = ({
  gameState,
  restartTrigger,
  onGameStateChange,
  onScoreUpdate,
  onGameOver,
  onFlapCount,
  birdSkin,
  theme,
  difficulty,
  isPaused,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mutable game state in refs to guarantee 60fps without React render lag
  const stateRef = useRef({
    score: 0,
    birdY: LOGICAL_HEIGHT / 2 - 40,
    birdVelocity: 0,
    birdAngle: 0,
    flapPhase: 0,
    isDead: false,
    groundOffset: 0,
    bgOffset: 0,
    pipes: [] as Pipe[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    screenShake: 0,
    screenFlash: 0,
    lastFrameTime: performance.now(),
    deathTimestamp: 0,
  });

  const diffSettings = DIFFICULTY_SETTINGS[difficulty];

  // Reset bird and game world
  const resetWorld = useCallback(() => {
    stateRef.current.score = 0;
    stateRef.current.birdY = LOGICAL_HEIGHT / 2 - 50;
    stateRef.current.birdVelocity = 0;
    stateRef.current.birdAngle = 0;
    stateRef.current.flapPhase = 0;
    stateRef.current.isDead = false;
    stateRef.current.pipes = [];
    stateRef.current.particles = [];
    stateRef.current.floatingTexts = [];
    stateRef.current.screenShake = 0;
    stateRef.current.screenFlash = 0;
    stateRef.current.lastFrameTime = performance.now();
    stateRef.current.deathTimestamp = 0;
    onScoreUpdate(0);
  }, [onScoreUpdate]);

  // Handle external restart trigger from button/modal
  useEffect(() => {
    if (restartTrigger > 0) {
      resetWorld();
      stateRef.current.birdVelocity = diffSettings.jumpForce;
      stateRef.current.birdAngle = -0.35;
      sounds.playFlap();
      onFlapCount();
    }
  }, [restartTrigger, resetWorld, diffSettings.jumpForce, onFlapCount]);

  // Jump / Flap action
  const handleFlap = useCallback(() => {
    const now = Date.now();
    if (gameState === 'GAME_OVER') {
      // Allow restart after slight 200ms grace period to avoid instant accidental restart
      if (now - stateRef.current.deathTimestamp > 200) {
        resetWorld();
        onGameStateChange('PLAYING');
        stateRef.current.birdVelocity = diffSettings.jumpForce;
        stateRef.current.birdAngle = -0.35;
        sounds.playFlap();
        onFlapCount();
      }
      return;
    }

    if (gameState === 'IDLE') {
      onGameStateChange('PLAYING');
      stateRef.current.birdVelocity = diffSettings.jumpForce;
      sounds.playFlap();
      onFlapCount();
      return;
    }

    if (gameState === 'PLAYING' && !isPaused && !stateRef.current.isDead) {
      stateRef.current.birdVelocity = diffSettings.jumpForce;
      stateRef.current.birdAngle = -0.42; // tilt up sharply
      sounds.playFlap();
      onFlapCount();

      // Spawn puff / feather particles behind bird
      const birdX = 100;
      const birdY = stateRef.current.birdY;
      for (let i = 0; i < 4; i++) {
        stateRef.current.particles.push({
          x: birdX - 16 + (Math.random() * 6 - 3),
          y: birdY + (Math.random() * 10 - 5),
          vx: -(Math.random() * 2 + 1),
          vy: Math.random() * 2 - 1,
          radius: Math.random() * 3.5 + 2,
          alpha: 0.85,
          color: birdSkin.trailColor,
          decay: 0.035,
        });
      }
    }
  }, [gameState, isPaused, diffSettings.jumpForce, onGameStateChange, onFlapCount, birdSkin.trailColor, resetWorld]);

  // Key press listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        handleFlap();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleFlap]);

  // Reset when difficulty changes or game resets
  useEffect(() => {
    if (gameState === 'IDLE') {
      resetWorld();
    }
  }, [gameState, difficulty, resetWorld]);

  // Main Canvas render and physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gameLoop = (currentTime: number) => {
      animId = requestAnimationFrame(gameLoop);

      // Delta time normalization
      const dt = Math.min((currentTime - stateRef.current.lastFrameTime) / 1000, 0.1);
      stateRef.current.lastFrameTime = currentTime;

      const st = stateRef.current;
      const activeDifficulty = DIFFICULTY_SETTINGS[difficulty];

      // Update screen shake
      if (st.screenShake > 0) {
        st.screenShake -= dt * 30;
        if (st.screenShake < 0) st.screenShake = 0;
      }

      // Update screen flash
      if (st.screenFlash > 0) {
        st.screenFlash -= dt * 4;
        if (st.screenFlash < 0) st.screenFlash = 0;
      }

      // If playing and not paused, compute physics
      if (gameState === 'PLAYING' && !isPaused && !st.isDead) {
        // 1. Bird gravity & vertical movement
        st.birdVelocity += activeDifficulty.gravity * (dt * 60);
        if (st.birdVelocity > 10) st.birdVelocity = 10;
        st.birdY += st.birdVelocity * (dt * 60);

        // 2. Bird angle tilt
        if (st.birdVelocity > 0) {
          // Pointing down when falling
          st.birdAngle = Math.min(Math.PI / 2.2, st.birdAngle + 0.05 * (dt * 60));
        } else {
          st.birdAngle = Math.max(-0.45, st.birdAngle - 0.04 * (dt * 60));
        }

        // Flap animation phase
        st.flapPhase += dt * 14;

        // 3. Move background & ground
        st.groundOffset = (st.groundOffset + activeDifficulty.pipeSpeed * (dt * 60)) % 24;
        st.bgOffset = (st.bgOffset + activeDifficulty.pipeSpeed * 0.3 * (dt * 60)) % 400;

        // 4. Pipes logic
        // Spawn pipes if needed
        const pipes = st.pipes;
        const lastPipe = pipes[pipes.length - 1];
        if (!lastPipe || LOGICAL_WIDTH - lastPipe.x >= activeDifficulty.pipeSpacing) {
          const minPipeHeight = 65;
          const maxPipeHeight = LOGICAL_HEIGHT - GROUND_HEIGHT - activeDifficulty.pipeGap - minPipeHeight;
          const topH = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight);
          pipes.push({
            x: LOGICAL_WIDTH + 10,
            topHeight: topH,
            bottomY: topH + activeDifficulty.pipeGap,
            width: 58,
            passed: false,
          });
        }

        // Move and filter pipes
        const birdX = 100;
        const birdHitRadius = 11; // Forgiving hitbox for fair and enjoyable gameplay

        for (let i = pipes.length - 1; i >= 0; i--) {
          const pipe = pipes[i];
          pipe.x -= activeDifficulty.pipeSpeed * (dt * 60);

          // Check score trigger
          if (!pipe.passed && pipe.x + pipe.width < birdX) {
            pipe.passed = true;
            st.score += 1;
            onScoreUpdate(st.score);
            sounds.playScore();

            // Spawn floating +1 effect
            st.floatingTexts.push({
              x: birdX + 15,
              y: st.birdY - 10,
              text: '+1',
              alpha: 1,
              vy: -1.2,
            });

            // Sparkle particles
            for (let p = 0; p < 8; p++) {
              st.particles.push({
                x: birdX + 20,
                y: st.birdY,
                vx: Math.cos((p / 8) * Math.PI * 2) * 2.5,
                vy: Math.sin((p / 8) * Math.PI * 2) * 2.5,
                radius: 2.5,
                alpha: 1,
                color: '#FDE047',
                decay: 0.04,
              });
            }
          }

          // Collision detection with forgiving bird hitbox
          const birdY = st.birdY;
          // Top pipe collision
          const collidesTop =
            birdX + birdHitRadius > pipe.x &&
            birdX - birdHitRadius < pipe.x + pipe.width &&
            birdY - birdHitRadius < pipe.topHeight;

          // Bottom pipe collision
          const collidesBottom =
            birdX + birdHitRadius > pipe.x &&
            birdX - birdHitRadius < pipe.x + pipe.width &&
            birdY + birdHitRadius > pipe.bottomY;

          if (collidesTop || collidesBottom) {
            triggerDeath();
            break;
          }

          // Remove off-screen pipes
          if (pipe.x + pipe.width < -20) {
            pipes.splice(i, 1);
          }
        }

        // 5. Ceiling and Ground collision
        if (st.birdY - birdHitRadius <= 0) {
          st.birdY = birdHitRadius;
          st.birdVelocity = 0;
        }

        const maxGroundY = LOGICAL_HEIGHT - GROUND_HEIGHT - birdHitRadius;
        if (st.birdY >= maxGroundY) {
          st.birdY = maxGroundY;
          triggerDeath();
        }
      } else if (gameState === 'IDLE') {
        // Idle gentle hovering
        st.flapPhase += dt * 7;
        st.birdY = LOGICAL_HEIGHT / 2 - 50 + Math.sin(currentTime * 0.004) * 8;
        st.birdAngle = Math.sin(currentTime * 0.004) * 0.08;
        st.groundOffset = (st.groundOffset + 1.2 * (dt * 60)) % 24;
      } else if (gameState === 'GAME_OVER' && st.isDead) {
        // Tumble bird down to ground if in air
        const maxGroundY = LOGICAL_HEIGHT - GROUND_HEIGHT - 14;
        if (st.birdY < maxGroundY) {
          st.birdVelocity += 0.5 * (dt * 60);
          st.birdY += st.birdVelocity * (dt * 60);
          st.birdAngle = Math.min(Math.PI / 2, st.birdAngle + 0.15 * (dt * 60));
          if (st.birdY >= maxGroundY) {
            st.birdY = maxGroundY;
            sounds.playDie();
          }
        }
      }

      // Update particles
      for (let i = st.particles.length - 1; i >= 0; i--) {
        const p = st.particles[i];
        p.x += p.vx * (dt * 60);
        p.y += p.vy * (dt * 60);
        p.alpha -= p.decay * (dt * 60);
        if (p.alpha <= 0) {
          st.particles.splice(i, 1);
        }
      }

      // Update floating score texts
      for (let i = st.floatingTexts.length - 1; i >= 0; i--) {
        const ft = st.floatingTexts[i];
        ft.y += ft.vy * (dt * 60);
        ft.alpha -= 0.02 * (dt * 60);
        if (ft.alpha <= 0) {
          st.floatingTexts.splice(i, 1);
        }
      }

      // ================= DRAWING PHASE =================
      ctx.save();

      // Screen shake translation
      if (st.screenShake > 0) {
        const shakeX = (Math.random() * 2 - 1) * st.screenShake;
        const shakeY = (Math.random() * 2 - 1) * st.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Draw Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT - GROUND_HEIGHT);
      skyGrad.addColorStop(0, theme.skyTop);
      skyGrad.addColorStop(1, theme.skyBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

      // Night stars or daylight clouds
      if (theme.isNight) {
        drawStars(ctx, currentTime);
      } else {
        drawClouds(ctx, st.bgOffset);
      }

      // Distant city / hills silhouette
      drawDistantLayer(ctx, st.bgOffset, theme);

      // 2. Draw Pipes
      for (const pipe of st.pipes) {
        drawPipe(ctx, pipe, theme);
      }

      // 3. Draw Ground
      drawGround(ctx, st.groundOffset, theme);

      // 4. Draw Particles
      for (const p of st.particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Draw Bird
      drawBird(ctx, 100, st.birdY, st.birdAngle, st.flapPhase, birdSkin);

      // 6. Floating texts (+1 score)
      for (const ft of st.floatingTexts) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = 'bold 20px "Press Start 2P", monospace';
        ctx.fillStyle = '#FDE047';
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 4;
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      // 7. Screen flash on hit
      if (st.screenFlash > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(st.screenFlash, 0.65)})`;
        ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
      }

      ctx.restore();
    };

    const triggerDeath = () => {
      const st = stateRef.current;
      if (st.isDead) return;
      st.isDead = true;
      st.screenShake = 12;
      st.screenFlash = 0.8;
      st.birdVelocity = -3; // small bump before falling
      st.deathTimestamp = Date.now();
      sounds.playHit();
      onGameOver(st.score);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, isPaused, difficulty, birdSkin, theme, onScoreUpdate, onGameOver]);

  // Helper drawing functions
  const drawClouds = (ctx: CanvasRenderingContext2D, offset: number) => {
    ctx.save();
    ctx.fillStyle = theme.cloudColor;
    const cloudPositions = [
      { x: (50 - offset) % (LOGICAL_WIDTH + 150) - 50, y: 70, scale: 1 },
      { x: (240 - offset) % (LOGICAL_WIDTH + 150) - 50, y: 130, scale: 0.7 },
      { x: (380 - offset) % (LOGICAL_WIDTH + 150) - 50, y: 90, scale: 0.85 },
    ];
    for (const c of cloudPositions) {
      drawSingleCloud(ctx, c.x, c.y, c.scale);
    }
    ctx.restore();
  };

  const drawSingleCloud = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 22 * s, 0, Math.PI * 2);
    ctx.arc(x + 20 * s, y - 10 * s, 26 * s, 0, Math.PI * 2);
    ctx.arc(x + 45 * s, y - 6 * s, 22 * s, 0, Math.PI * 2);
    ctx.arc(x + 65 * s, y, 18 * s, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  };

  const drawStars = (ctx: CanvasRenderingContext2D, time: number) => {
    ctx.save();
    const starCoords = [
      [30, 45], [90, 80], [140, 30], [210, 60], [270, 35],
      [330, 75], [370, 40], [60, 140], [180, 130], [310, 150]
    ];
    for (let i = 0; i < starCoords.length; i++) {
      const [x, y] = starCoords[i];
      const twinkle = (Math.sin(time * 0.003 + i) + 1) * 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.6})`;
      ctx.fillRect(x, y, 2.5, 2.5);
    }
    ctx.restore();
  };

  const drawDistantLayer = (ctx: CanvasRenderingContext2D, offset: number, curTheme: EnvironmentTheme) => {
    ctx.save();
    const baseY = LOGICAL_HEIGHT - GROUND_HEIGHT;
    ctx.fillStyle = curTheme.isNight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.25)';

    // Distant mountain skyline
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= LOGICAL_WIDTH + 40; x += 40) {
      const shiftedX = x - (offset * 0.4) % 40;
      const height = Math.sin((x + offset * 0.4) * 0.015) * 28 + 50;
      ctx.lineTo(shiftedX, baseY - height);
    }
    ctx.lineTo(LOGICAL_WIDTH, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const drawPipe = (ctx: CanvasRenderingContext2D, pipe: Pipe, curTheme: EnvironmentTheme) => {
    const rimHeight = 24;
    const rimOverhang = 5;

    ctx.save();

    // Helper to draw shaded pipe cylinder
    const renderCylinder = (x: number, y: number, w: number, h: number) => {
      if (h <= 0) return;
      const grad = ctx.createLinearGradient(x, 0, x + w, 0);
      grad.addColorStop(0, curTheme.pipeShadow);
      grad.addColorStop(0.2, curTheme.pipeMain);
      grad.addColorStop(0.5, curTheme.pipeHighlight);
      grad.addColorStop(0.85, curTheme.pipeMain);
      grad.addColorStop(1, curTheme.pipeShadow);

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);

      // Stroke outline
      ctx.strokeStyle = curTheme.pipeRim;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x, y, w, h);
    };

    // 1. Top pipe shaft
    renderCylinder(pipe.x, 0, pipe.width, pipe.topHeight - rimHeight);

    // 2. Top pipe cap / rim
    renderCylinder(pipe.x - rimOverhang, pipe.topHeight - rimHeight, pipe.width + rimOverhang * 2, rimHeight);

    // 3. Bottom pipe cap / rim
    renderCylinder(pipe.x - rimOverhang, pipe.bottomY, pipe.width + rimOverhang * 2, rimHeight);

    // 4. Bottom pipe shaft
    const bottomShaftY = pipe.bottomY + rimHeight;
    const bottomShaftH = LOGICAL_HEIGHT - GROUND_HEIGHT - bottomShaftY;
    renderCylinder(pipe.x, bottomShaftY, pipe.width, bottomShaftH);

    ctx.restore();
  };

  const drawGround = (ctx: CanvasRenderingContext2D, offset: number, curTheme: EnvironmentTheme) => {
    ctx.save();
    const groundY = LOGICAL_HEIGHT - GROUND_HEIGHT;

    // Grass top border
    ctx.fillStyle = curTheme.groundTop;
    ctx.fillRect(0, groundY, LOGICAL_WIDTH, 14);

    // Ground dirt body
    ctx.fillStyle = curTheme.groundBottom;
    ctx.fillRect(0, groundY + 14, LOGICAL_WIDTH, GROUND_HEIGHT - 14);

    // Diagonal grass stripes for smooth scrolling illusion
    ctx.fillStyle = curTheme.groundStripe;
    for (let x = -30; x < LOGICAL_WIDTH + 30; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x - offset, groundY);
      ctx.lineTo(x + 12 - offset, groundY);
      ctx.lineTo(x + 4 - offset, groundY + 14);
      ctx.lineTo(x - 8 - offset, groundY + 14);
      ctx.closePath();
      ctx.fill();
    }

    // Top border line
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, groundY, LOGICAL_WIDTH, 2);

    ctx.restore();
  };

  const drawBird = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    flapPhase: number,
    skin: BirdSkin
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Glow aura around bird
    const glowGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, 24);
    glowGrad.addColorStop(0, skin.glowColor);
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();

    // 1. Bird Body (Egg-like rounded oval)
    ctx.fillStyle = skin.bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 17, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // 2. Belly plumage
    ctx.fillStyle = skin.bellyColor;
    ctx.beginPath();
    ctx.ellipse(-2, 4, 11, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // 3. Eye & Specular shine
    const eyeX = 7;
    const eyeY = -4;
    // Eye white
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pupil
    ctx.fillStyle = skin.eyeColor;
    ctx.beginPath();
    ctx.arc(eyeX + 1.5, eyeY, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Shine reflection
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(eyeX + 2.5, eyeY - 1.2, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // 4. Beak
    ctx.fillStyle = skin.beakColor;
    ctx.beginPath();
    ctx.moveTo(13, -2);
    ctx.lineTo(24, 1);
    ctx.lineTo(13, 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#9A3412';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Beak separation line
    ctx.beginPath();
    ctx.moveTo(13, 2);
    ctx.lineTo(22, 2);
    ctx.stroke();

    // 5. Wing (Flapping angle)
    ctx.save();
    const wingFlap = Math.sin(flapPhase) * 9;
    ctx.translate(-6, -1);
    ctx.rotate((wingFlap * Math.PI) / 180);

    ctx.fillStyle = skin.wingColor;
    ctx.beginPath();
    ctx.ellipse(-2, 0, 10, 6, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  };

  return (
    <div
      onClick={handleFlap}
      onTouchStart={(e) => {
        e.preventDefault();
        handleFlap();
      }}
      className="relative w-full max-w-[420px] aspect-[400/620] mx-auto select-none rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-950 cursor-pointer group focus:outline-none"
      tabIndex={0}
      role="button"
      aria-label="Área de juego de Flappy Bird"
    >
      <canvas
        ref={canvasRef}
        width={LOGICAL_WIDTH}
        height={LOGICAL_HEIGHT}
        className="game-canvas w-full h-full block"
      />
    </div>
  );
};
