import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  maxOpacity: number;
  fadeSpeed: number;
  hue: number;
}

export const FloatingCandleEmbers: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create subtle warm ember particles
    const particleCount = isDark ? 28 : 16;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        speedY: -(Math.random() * 0.45 + 0.15),
        speedX: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.5,
        maxOpacity: Math.random() * 0.45 + (isDark ? 0.35 : 0.2),
        fadeSpeed: Math.random() * 0.005 + 0.002,
        hue: Math.random() * 25 + 35 // Amber/Golden 35-60
      });
    }

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          p.y += p.speedY;
          p.x += p.speedX + Math.sin(p.y * 0.01) * 0.15;
          p.opacity += p.fadeSpeed;

          if (p.opacity > p.maxOpacity || p.opacity < 0.05) {
            p.fadeSpeed = -p.fadeSpeed;
          }

          // Reset particle if it reaches top or leaves bounds
          if (p.y < -10 || p.x < -10 || p.x > width + 10) {
            p.y = height + Math.random() * 20;
            p.x = Math.random() * width;
            p.opacity = 0.05;
          }

          // Draw gentle glowing particle
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${Math.max(0, p.opacity)})`;
          ctx.shadowBlur = isDark ? 8 : 4;
          ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${p.opacity * 0.8})`;
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      style={{ opacity: isDark ? 0.85 : 0.55 }}
    />
  );
};
