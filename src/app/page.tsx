'use client';

import { HeroSection } from '@/components/animations';
import { ScrollReveal } from '@/components/animations';
import { motion } from 'framer-motion';
import {
  Database,
  MessageSquare,
  Phone,
  Mail,
  Zap,
  Clock,
  Shield,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-[#0a0a1a] via-[#0f0f2a] to-[#1a0a2a]">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              One Source of Truth for All Channels
            </h2>
            <p className="text-lg text-white/60 text-center mb-16 max-w-2xl mx-auto">
              Graphiti merges data from every customer touchpoint into
              authoritative temporal facts with complete history.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Phone className="w-6 h-6" />}
              title="Voice Calls"
              description="Transcribed conversations with sentiment analysis"
              color="purple"
              delay={0}
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="Chat Support"
              description="In-app and web chat interactions"
              color="cyan"
              delay={0.1}
            />
            <FeatureCard
              icon={<Mail className="w-6 h-6" />}
              title="Email"
              description="Customer email threads and responses"
              color="pink"
              delay={0.2}
            />
            <FeatureCard
              icon={<Database className="w-6 h-6" />}
              title="BSS Events"
              description="Billing, provisioning, and system events"
              color="green"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-32 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              How Graphiti Works
            </h2>
            <p className="text-lg text-white/60 text-center mb-16 max-w-2xl mx-auto">
              Three simple steps to transform chaos into clarity
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              step={1}
              title="Ingest"
              description="Raw data from all channels flows into the system"
              icon={<Zap className="w-8 h-8" />}
              delay={0}
            />
            <StepCard
              step={2}
              title="Resolve"
              description="Graphiti resolves conflicts using temporal rules"
              icon={<Clock className="w-8 h-8" />}
              delay={0.15}
            />
            <StepCard
              step={3}
              title="Retrieve"
              description="Get the authoritative state at any point in time"
              icon={<Shield className="w-8 h-8" />}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to See It in Action?
            </h2>
            <p className="text-xl text-white/60 mb-10">
              Try our interactive demo and see how Graphiti transforms your
              omnichannel data.
            </p>
            <Link href="/demo">
              <Button
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="text-lg px-10 py-5"
              >
                Launch Demo
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Circles.co. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://circles.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              circles.co
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'purple' | 'cyan' | 'pink' | 'green';
  delay: number;
}

function FeatureCard({
  icon,
  title,
  description,
  color,
  delay,
}: FeatureCardProps) {
  const colorMap = {
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30',
    pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/30',
    green: 'from-green-500/20 to-green-500/5 border-green-500/30',
  };

  const iconColorMap = {
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
    pink: 'text-pink-400',
    green: 'text-green-400',
  };

  return (
    <ScrollReveal delay={delay}>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className={`p-6 rounded-2xl border bg-gradient-to-br ${colorMap[color]} backdrop-blur-xl`}
      >
        <div className={`mb-4 ${iconColorMap[color]}`}>{icon}</div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/60">{description}</p>
      </motion.div>
    </ScrollReveal>
  );
}

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

function StepCard({ step, title, description, icon, delay }: StepCardProps) {
  return (
    <ScrollReveal delay={delay}>
      <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
          {step}
        </div>
        <div className="text-purple-400 mb-4 flex justify-center">{icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/60">{description}</p>
      </div>
    </ScrollReveal>
  );
}
