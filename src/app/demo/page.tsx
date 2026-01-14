'use client';

import { SplitScreen } from '@/components/layout/SplitScreen';
import { LeftPanel } from '@/components/layout/LeftPanel';
import { RightPanel } from '@/components/layout/RightPanel';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0f0f2a] to-[#1a0a2a]">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="w-px h-6 bg-white/10" />
              <div>
                <h1 className="text-lg font-semibold text-white">
                  Omnichannel Intelligence Demo
                </h1>
                <p className="text-xs text-white/50">
                  See how Graphiti transforms raw data into authoritative facts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://circles.co"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
              >
                circles.co
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1800px] mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SplitScreen
            left={<LeftPanel />}
            right={<RightPanel />}
            className="h-[calc(100vh-120px)]"
          />
        </motion.div>
      </main>
    </div>
  );
}
