import React, { useEffect, useRef } from 'react';
import type { ColorPalette, ThemeMode } from '../types/auth';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  color: string;
}

interface BackgroundCanvasProps {
  palette?: ColorPalette;
  mode?: ThemeMode;
}

const PALETTE_COLORS: Record<ColorPalette, { particles: string[]; line: string }> = {
  nebula: {
    particles: [
      'rgba(168, 85, 247, ', // Purple
      'rgba(99, 102, 241, ', // Indigo
      'rgba(236, 72, 153, ', // Pink
      'rgba(192, 132, 252, ', // Light Violet
    ],
    line: '168, 85, 247',
  },
  cyan: {
    particles: [
      'rgba(6, 182, 212, ',  // Cyan
      'rgba(59, 130, 246, ', // Sapphire Blue
      'rgba(16, 185, 129, ', // Emerald
      'rgba(56, 189, 248, ', // Sky
    ],
    line: '6, 182, 212',
  },
  emerald: {
    particles: [
      'rgba(16, 185, 129, ', // Emerald
      'rgba(20, 184, 166, ', // Teal
      'rgba(132, 204, 22, ', // Lime
      'rgba(52, 211, 153, ', // Light Green
    ],
    line: '16, 185, 129',
  },
  sunset: {
    particles: [
      'rgba(244, 63, 94, ',  // Rose Red
      'rgba(249, 115, 22, ', // Orange Tangerine
      'rgba(251, 191, 36, ', // Amber
      'rgba(236, 72, 153, ', // Pink
    ],
    line: '244, 63, 94',
  },
  platinum: {
    particles: [
      'rgba(99, 102, 241, ', // Indigo
      'rgba(139, 92, 246, ', // Purple
      'rgba(2, 132, 199, ',  // Deep Sky
      'rgba(79, 70, 229, ',  // Dark Indigo
    ],
    line: '99, 102, 241',
  },
};

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ palette = 'nebula', mode = 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null; radius: number }>({
    x: null,
    y: null,
    radius: 140,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const activeConfig = PALETTE_COLORS[palette] || PALETTE_COLORS.nebula;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    let particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 16000), 75);

    const initParticles = () => {
      particles = [];
      const alphaBoost = mode === 'light' ? 0.35 : 0.25;
      for (let i = 0; i < particleCount; i++) {
        const color = activeConfig.particles[Math.floor(Math.random() * activeConfig.particles.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          radius: Math.random() * 2 + 1.2,
          baseAlpha: Math.random() * 0.4 + alphaBoost,
          color,
        });
      }
    };

    initParticles();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction
        if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRef.current.radius) {
            const force = (mouseRef.current.radius - dist) / mouseRef.current.radius;
            const angle = Math.atan2(dy, dx);
            p.x -= Math.cos(angle) * force * 1.5;
            p.y -= Math.sin(angle) * force * 1.5;
          }
        }

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.baseAlpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `${p.color}0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${activeConfig.line}, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [palette, mode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 dynamic-canvas"
      aria-hidden="true"
    />
  );
};
