"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
        {/* Hero text - centered */}
        <div className="max-w-5xl mx-auto text-center space-y-5 sm:space-y-6">
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary leading-tight inline-flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3">
              <span>{dict.hero.headlineLine1}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-primary via-text-primary to-text-secondary">
                {dict.hero.headlineLine2}
              </span>
              <span className="text-brand-orange orange-glow-text">
                {dict.hero.headlineLine3}
              </span>
            </h1>
          </motion.div>
        </div>

        {/* Showcase Cards - full width after headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 md:mt-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {[
              { image: "/images/showcase-webapp.jpg", label: "Web Application" },
              { image: "/images/showcase-mobileapp.jpg", label: "Mobile App" },
              { image: "/images/showcase-business.jpg", label: "Business System" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative"
              >
                <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-white shadow-card transition-all duration-500 group-hover:border-brand-orange/40 group-hover:shadow-[0_20px_60px_-15px_rgba(255,106,0,0.18)] group-hover:-translate-y-1.5">
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={index === 0}
                    />
                    {/* Subtle shine sweep on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  </div>

                  {/* Bottom label */}
                  <div className="px-4 py-3 bg-white border-t border-border/40 flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-secondary font-mono tracking-wide uppercase">
                      {item.label}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-smoke flex items-center justify-center text-text-muted group-hover:text-brand-orange group-hover:bg-brand-orangeMuted transition-all duration-300">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Subtext & CTAs - back to centered */}
        <div className="max-w-4xl mx-auto text-center space-y-8 mt-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {dict.hero.subtext}
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
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
            transition={{ duration: 0.8, delay: 0.7 }}
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
