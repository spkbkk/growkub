"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Smartphone, Layers, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Locale, Dictionary } from "@/lib/i18n";

interface ServicesSectionProps {
  locale: Locale;
  dict: Dictionary;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  locale,
  dict,
}) => {
  const serviceIcons = [Globe, Smartphone, Layers];

  return (
    <Section id="services" spacing="lg" className="border-t border-border">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-orange">
              // {dict.servicesSection.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
              {dict.servicesSection.title}
            </h2>
          </div>
          <p className="text-sm text-text-secondary max-w-sm">
            {dict.servicesSection.subtitle}
          </p>
        </div>

        {/* 3 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dict.servicesSection.items.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <motion.div
                key={service.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/${locale}/services`}
                  className="block h-full group"
                >
                  <Card
                    hoverEffect
                    className="h-full flex flex-col justify-between p-8 bg-smoke-dark group-hover:border-brand-orange/50 transition-all duration-300"
                  >
                    <div>
                      {/* Top Header in Card */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 rounded-lg bg-smoke border border-border flex items-center justify-center group-hover:border-brand-orange/40 group-hover:text-brand-orange transition-colors text-text-secondary">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-mono font-bold text-text-muted/40 group-hover:text-brand-orange/60 transition-colors">
                          {service.number}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-brand-orange transition-colors mb-3">
                        {service.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed mb-6 font-normal">
                        {service.description}
                      </p>
                    </div>

                    {/* Features List & Arrow */}
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <ul className="space-y-1.5 text-xs text-text-muted font-mono">
                        {service.features.map((feat, fIndex) => (
                          <li key={fIndex} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="w-8 h-8 rounded-full bg-smoke flex items-center justify-center text-text-secondary group-hover:text-white group-hover:bg-brand-orange transition-all duration-200 shrink-0 ml-2">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};
