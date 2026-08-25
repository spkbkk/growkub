"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Compass, Terminal, Rocket } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Locale, Dictionary } from "@/lib/i18n";

interface ProcessSectionProps {
  locale: Locale;
  dict: Dictionary;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({
  locale,
  dict,
}) => {
  const stepIcons = [Search, Compass, Terminal, Rocket];

  return (
    <Section id="process" spacing="lg" className="border-t border-border bg-smoke-black/50">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-orange">
              // {dict.processSection.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
              {dict.processSection.title}
            </h2>
          </div>
          <p className="text-sm text-text-secondary max-w-sm">
            {dict.processSection.subtitle}
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dict.processSection.steps.map((step, index) => {
            const Icon = stepIcons[index % stepIcons.length];
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full p-6 sm:p-7 bg-smoke-dark border-border relative flex flex-col justify-between group hover:border-brand-orange/40 transition-colors">
                  <div className="space-y-4">
                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-mono font-extrabold text-brand-orange">
                        {step.number}
                      </span>
                      <div className="w-10 h-10 rounded-lg bg-smoke border border-border flex items-center justify-center text-text-secondary group-hover:text-emerald-500 group-hover:border-emerald-500/30 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Step Titles */}
                    <div>
                      <h3 className="text-lg font-bold tracking-wide text-text-primary font-mono">
                        {step.title}
                      </h3>
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {step.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>

                  {/* Progress indicator bottom strip */}
                  <div className="pt-6 mt-4 border-t border-border flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-mono text-text-muted">
                      Phase {step.number} Active
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};
