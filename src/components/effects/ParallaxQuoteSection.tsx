import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { FloatingCandleEmbers } from './FloatingCandleEmbers';

export const ParallaxQuoteSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isDark } = useTheme();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['25px', '-25px']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden py-24 sm:py-32 my-8 border-y border-stone-800/40"
    >
      {/* Parallax Background Layer */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -top-20 -bottom-20 scale-110 pointer-events-none"
      >
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-radial-at-c from-stone-900 via-stone-950 to-black' 
            : 'bg-radial-at-c from-stone-200 via-stone-100 to-stone-200'
        }`} />
        
        {/* Soft atmospheric gradient glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full ${
          isDark ? 'bg-amber-600/10' : 'bg-amber-500/10'
        } blur-[120px] pointer-events-none`} />

        {/* Ambient Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </motion.div>

      {/* Floating candle embers inside parallax banner */}
      <FloatingCandleEmbers />

      {/* Content Container */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative max-w-4xl mx-auto px-6 text-center z-10 space-y-6"
      >
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-serif tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>Homenaje & Memoria Perpetua</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        </div>

        <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-relaxed tracking-wide text-stone-900 dark:text-stone-100 italic">
          &ldquo;Quienes amamos nunca se van del todo; caminan a nuestro lado cada día, invisibles y silenciosos, pero siempre presentes en nuestro recuerdo y en nuestro amor eterno.&rdquo;
        </blockquote>

        <div className="flex items-center justify-center gap-3 pt-2">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
          <Heart className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500/20" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
        </div>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light tracking-wide">
          Cochería J.V. González • Cuatro décadas de vocación de servicio, respeto y contención.
        </p>
      </motion.div>
    </section>
  );
};
