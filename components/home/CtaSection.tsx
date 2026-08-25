"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Locale, Dictionary } from "@/lib/i18n";

interface CtaSectionProps {
  locale: Locale;
  dict: Dictionary;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ locale, dict }) => {
  return (
    <Section spacing="lg" className="border-t border-border/40 relative overflow-hidden">
      {/* Subtle orange mesh gradient glow */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-80 pointer-events-none" />

      <Container>
        <div className="relative rounded-2xl bg-smoke-dark border border-border p-8 sm:p-12 md:p-16 text-center max-w-4xl mx-auto overflow-hidden shadow-card">
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-brand-orange to-transparent" />

          <div className="space-y-6 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{dict.ctaSection.badge}</span>
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
              {dict.ctaSection.headline}
            </h2>

            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              {dict.ctaSection.subtext}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                href={`/${locale}/contact`}
                size="lg"
                variant="primary"
                className="w-full sm:w-auto font-semibold shadow-glow"
              >
                <span>{dict.ctaSection.button}</span>
              </Button>
              <Button
                href={`/${locale}/works`}
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <span>{dict.common.viewWorks}</span>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
