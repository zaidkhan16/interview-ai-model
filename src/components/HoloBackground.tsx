import React, { useEffect, useRef } from 'react';
import type { ColorPalette, ThemeMode } from '../types/auth';

interface HoloBackgroundProps {
  palette?: ColorPalette;
  mode?: ThemeMode;
}

const HOLO_COLORS: Record<ColorPalette, { primary: string; secondary: string; grid: string }> = {
  nebula: {
    primary: '168, 85, 247',
    secondary: '99, 102, 241',
    grid: '147, 51, 234',
  },
  cyan: {
    primary: '6, 182, 212',
    secondary: '59, 130, 246',
    grid: '8, 145, 178',
  },
  emerald: {
    primary: '16, 185, 129',
    secondary: '20, 184, 166',
    grid: '5, 150, 105',
  },
  sunset: {
    primary: '244, 63, 94',
    secondary: '249, 115, 22',
    grid: '225, 29, 72',
  },
  platinum: {
    primary: '99, 102, 241',
    secondary: '139, 92, 246',
    grid: '79, 70, 229',
  },
};

export const HoloBackground: React.FC<HoloBackgroundProps> = ({ palette = 'nebula', mode = 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = HOLO_COLORS[palette] || HOLO_COLORS.nebula;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / width - 0.5) * 30;
      mouseRef.current.y = (e.clientY / height - 0.5) * 30;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Beacons
    const beacons = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.4 + 0.2,
      hex: `0x${Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')}`,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.015;

      const isLight = mode === 'light';
      const gridAlpha = isLight ? 0.04 : 0.07;
      const primaryColor = colors.primary;

      // Draw Perspective Spatial Grid
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = `rgba(${colors.grid}, ${gridAlpha})`;

      const gridSize = 64;
      const offsetX = (mouseRef.current.x * 0.4 + tick * 8) % gridSize;
      const offsetY = (mouseRef.current.y * 0.4) % gridSize;

      // Vertical lines
      for (let x = -gridSize; x <= width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + offsetX, 0);
        ctx.lineTo(x + offsetX, height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = -gridSize; y <= height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + offsetY);
        ctx.lineTo(width, y + offsetY);
        ctx.stroke();
      }

      // Draw Grid Intersections / Crosshairs
      for (let x = -gridSize; x <= width + gridSize; x += gridSize * 2) {
        for (let y = -gridSize; y <= height + gridSize; y += gridSize * 2) {
          const crossX = x + offsetX;
          const crossY = y + offsetY;
          if (crossX > 0 && crossX < width && crossY > 0 && crossY < height) {
            ctx.strokeStyle = `rgba(${primaryColor}, ${isLight ? 0.12 : 0.22})`;
            ctx.beginPath();
            ctx.moveTo(crossX - 4, crossY);
            ctx.lineTo(crossX + 4, crossY);
            ctx.moveTo(crossX, crossY - 4);
            ctx.lineTo(crossX, crossY + 4);
            ctx.stroke();
          }
        }
      }

      // Draw Quantum Beacons with coordinate labels
      beacons.forEach((b) => {
        b.y -= b.speed;
        if (b.y < -20) {
          b.y = height + 20;
          b.x = Math.random() * width;
        }

        const beaconX = b.x + mouseRef.current.x * 0.2;
        const pulse = Math.sin(tick * 2 + b.size) * 0.25 + 0.75;

        ctx.fillStyle = `rgba(${primaryColor}, ${b.alpha * pulse * (isLight ? 0.6 : 0.9)})`;
        ctx.beginPath();
        ctx.arc(beaconX, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();

        // Node hex label
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(${primaryColor}, ${b.alpha * 0.45 * (isLight ? 0.5 : 0.8)})`;
        ctx.fillText(b.hex, beaconX + 6, b.y + 3);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [palette, mode]);

  return (
    <div className="holo-bg-viewport pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvasRef} className="holo-canvas fixed inset-0" aria-hidden="true" />
      <div className="holo-scanlines" aria-hidden="true"></div>
      <div className="holo-vignette" aria-hidden="true"></div>
    </div>
  );
};
