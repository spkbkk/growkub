"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Cpu, GitBranch, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Locale, Dictionary } from "@/lib/i18n";

interface AboutSectionProps {
  locale: Locale;
  dict: Dictionary;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ locale, dict }) => {
  const technologies = [
    { name: "Next.js 14+", category: "Frontend & SSR" },
    { name: "TypeScript", category: "Strict Type Safety" },
    { name: "Node.js & Python", category: "High Concurrency API" },
    { name: "PostgreSQL & Redis", category: "Relational & Cache DB" },
    { name: "Docker & Cloud", category: "DevOps & Infrastructure" },
    { name: "Flutter & React Native", category: "Cross-Platform Mobile" },
  ];

  const principleIcons = [ShieldCheck, Cpu, GitBranch];

  return (
    <Section id="about" spacing="lg" className="border-t border-border/40">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Mission & Statement */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-orange">
              // {dict.aboutSection.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-tight">
              {dict.aboutSection.title}
            </h2>
            <p className="text-base text-text-primary font-medium leading-relaxed">
              {dict.aboutSection.leadText}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed font-normal">
              {dict.aboutSection.description}
            </p>

            <div className="pt-2">
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-orange hover:text-brand-orangeHover transition-colors"
              >
                <span>{dict.common.learnMore}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Principles & Tech Stack */}
          <div className="lg:col-span-7 space-y-8">
            {/* 3 Engineering Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dict.aboutSection.principles.map((p, idx) => {
                const Icon = principleIcons[idx % principleIcons.length];
                return (
                  <Card
                    key={idx}
                    className="p-5 bg-smoke-dark/80 border-border space-y-3"
                  >
                    <div className="w-8 h-8 rounded-md bg-smoke border border-border flex items-center justify-center text-brand-orange">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-text-primary">
                      {p.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {p.description}
                    </p>
                  </Card>
                );
              })}
            </div>

            {/* Technologies Grid */}
            <Card className="p-6 bg-smoke-dark/60 border-border space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">
                {dict.aboutSection.techHeadline}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {technologies.map((tech) => (
                  <div
                    key={tech.name}
                    className="p-3 rounded-lg bg-smoke border border-border/70 hover:border-brand-orange/40 transition-colors"
                  >
                    <div className="text-xs font-mono font-bold text-text-primary">
                      {tech.name}
                    </div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      {tech.category}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};
