"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Sparkles, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { Locale, Dictionary } from "@/lib/i18n";

interface HeroSectionProps {
  locale: Locale;
  dict: Dictionary;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ locale, dict }) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden">
      {/* Ambient background effects */}
      <BackgroundGlow position="top" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 -z-10" />

      {/* Subtle emerald ambient mesh glow */}
      <div className="pointer-events-none absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -z-10" />

      <Container>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Studio Badge with Emerald Live Status */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-smoke-dark border border-border text-xs font-mono text-text-secondary shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow-green" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Available for Projects</span>
              <span className="text-border">|</span>
              <span className="text-text-primary font-medium">{dict.hero.badge}</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-1"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-text-primary leading-[1.08]">
              <span className="block">{dict.hero.headlineLine1}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-text-primary via-text-primary to-text-secondary">
                {dict.hero.headlineLine2}
              </span>
              <span className="block text-brand-orange orange-glow-text">
                {dict.hero.headlineLine3}
              </span>
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {dict.hero.subtext}
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Button
              href={`/${locale}/contact`}
              size="lg"
              variant="primary"
              className="w-full sm:w-auto font-semibold shadow-glow"
            >
              <span>{dict.hero.ctaPrimary}</span>
            </Button>
            <Button
              href={`/${locale}/works`}
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <span>{dict.hero.ctaSecondary}</span>
            </Button>
          </motion.div>

          {/* Value Props Strip with Emerald Checkmarks */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-text-muted"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Full-Stack Architecture</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Direct Engineering Contact</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Production Guarantee</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
