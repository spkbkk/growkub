"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  GitBranch,
  ArrowRight,
  Sparkles,
  Bot,
  Lock,
  Activity,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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
  const aiIcons = [Bot, Lock, Activity, Sparkles];

  const ai = dict.aiEngineeringSection;

  return (
    <Section id="about" spacing="lg" className="border-t border-border/40">
      <Container className="space-y-16">
        {/* Top Grid: Studio Overview & Tech Stack */}
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

        {/* ========================================================================= */}
        {/* NEW: AI-Powered Software Engineering & Enterprise Security Section */}
        {/* ========================================================================= */}
        <div className="relative pt-6">
          <Card className="p-8 sm:p-12 bg-gradient-to-b from-smoke-dark/95 via-smoke-dark/80 to-smoke-black border border-brand-orange/30 shadow-2xl relative overflow-hidden">
            {/* Background Ambient Glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none -mt-24" />
            <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mb-20" />

            {/* Header */}
            <div className="max-w-3xl space-y-4 mb-10 relative z-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" />
                  // {ai.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {ai.securityBadge}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-tight">
                {ai.title}
              </h2>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {ai.subtitle}
              </p>
            </div>

            {/* 4 Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
              {ai.features.map((feat, fIdx) => {
                const Icon = aiIcons[fIdx % aiIcons.length];
                return (
                  <div
                    key={fIdx}
                    className="p-5 rounded-2xl bg-smoke/80 hover:bg-smoke border border-border/80 hover:border-brand-orange/50 transition-all duration-200 flex flex-col justify-between group space-y-4 shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-smoke-black border border-border flex items-center justify-center text-brand-orange group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-smoke-black border border-border text-emerald-400">
                          {feat.tag}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-text-primary group-hover:text-brand-orange transition-colors">
                        {feat.title}
                      </h3>

                      <p className="text-xs text-text-secondary leading-relaxed font-normal">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Security Guarantee Bar */}
            <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted font-mono relative z-10">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{ai.securityGuarantee}</span>
              </div>

              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-1.5 text-brand-orange hover:underline font-semibold"
              >
                <span>{locale === "th" ? "ปรึกษาความปลอดภัย & วางแผนระบบ AI" : "Consult Security & AI Roadmap"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
};
