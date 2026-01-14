'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Play, Sparkles, Database, Zap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Headline split text animation
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.hero-word');
        tl.fromTo(
          words,
          { opacity: 0, y: 50, rotateX: -90 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.1 },
          0.2
        );
      }

      // Subtext fade up
      if (subtextRef.current) {
        tl.fromTo(
          subtextRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.5
        );
      }

      // CTA buttons scale in
      if (ctaRef.current) {
        const buttons = ctaRef.current.querySelectorAll('a, button');
        tl.fromTo(
          buttons,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 },
          0.7
        );
      }

      // Floating orbs
      if (orbsRef.current) {
        const orbs = orbsRef.current.querySelectorAll('.hero-orb');
        tl.fromTo(
          orbs,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.8, stagger: 0.15 },
          1.0
        );

        // Continuous floating animation
        orbs.forEach((orb, i) => {
          gsap.to(orb, {
            y: `${Math.sin(i) * 20 + 10}`,
            duration: 3 + i * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity, y }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <HeroBackground />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300"
        >
          <Sparkles className="w-4 h-4" />
          Temporal Context Engine
        </motion.div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-5xl md:text-7xl font-bold leading-tight mb-6 perspective-1000"
        >
          <span className="hero-word inline-block text-white">Transform</span>{' '}
          <span className="hero-word inline-block text-white">Fragmented</span>{' '}
          <span className="hero-word inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Omnichannel
          </span>{' '}
          <span className="hero-word inline-block text-white">Data</span>{' '}
          <span className="hero-word inline-block text-white">Into</span>{' '}
          <span className="hero-word inline-block bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Authoritative
          </span>{' '}
          <span className="hero-word inline-block text-white">Facts</span>
        </h1>

        {/* Subtext */}
        <p
          ref={subtextRef}
          className="text-xl md:text-2xl text-white/60 mb-10 max-w-3xl mx-auto"
        >
          See how Circles.co&apos;s Graphiti engine resolves conflicting signals
          from voice, chat, and business systems into a single source of truth
          with full temporal history.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex items-center justify-center gap-4">
          <Link href="/demo">
            <Button
              size="lg"
              variant="primary"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="text-lg px-8 py-4"
            >
              Try the Demo
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            leftIcon={<Play className="w-5 h-5" />}
            className="text-lg px-8 py-4"
          >
            Watch Video
          </Button>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10"
        >
          <StatItem
            value="100ms"
            label="Resolution Time"
            icon={<Zap className="w-5 h-5 text-yellow-400" />}
          />
          <StatItem
            value="Bi-temporal"
            label="History Tracking"
            icon={<Database className="w-5 h-5 text-green-400" />}
          />
          <StatItem
            value="All Channels"
            label="Unified View"
            icon={<Sparkles className="w-5 h-5 text-purple-400" />}
          />
        </motion.div>
      </div>

      {/* Floating Orbs */}
      <div ref={orbsRef} className="absolute inset-0 pointer-events-none">
        <div className="hero-orb absolute top-1/4 left-1/6 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/40 to-purple-500/0 blur-sm" />
        <div className="hero-orb absolute top-1/3 right-1/5 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/40 to-cyan-500/0 blur-sm" />
        <div className="hero-orb absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-green-500/30 to-green-500/0 blur-sm" />
        <div className="hero-orb absolute bottom-1/4 right-1/4 w-14 h-14 rounded-full bg-gradient-to-br from-pink-500/40 to-pink-500/0 blur-sm" />
        <div className="hero-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/0 blur-md" />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/40">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1"
          >
            <div className="w-1.5 h-2.5 bg-white/40 rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}

function HeroBackground() {
  return (
    <div className="absolute inset-0">
      {/* Gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0f0f2a] to-[#1a0a2a]" />

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50" />
    </div>
  );
}

interface StatItemProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

function StatItem({ value, label, icon }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        {icon}
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <span className="text-sm text-white/50">{label}</span>
    </div>
  );
}
