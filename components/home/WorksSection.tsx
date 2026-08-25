"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Project } from "@/lib/db";
import { Locale, Dictionary } from "@/lib/i18n";

interface WorksSectionProps {
  locale: Locale;
  dict: Dictionary;
  projects: Project[];
}

export const WorksSection: React.FC<WorksSectionProps> = ({
  locale,
  dict,
  projects,
}) => {
  return (
    <Section id="works" spacing="lg" className="border-t border-border/40">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 md:mb-16 gap-4">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-orange">
              // {dict.worksSection.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
              {dict.worksSection.title}
            </h2>
          </div>
          <Link
            href={`/${locale}/works`}
            className="text-sm font-medium text-brand-orange hover:text-brand-orangeHover transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>{dict.worksSection.viewAllWorks}</span>
          </Link>
        </div>

        {/* Selected Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const title = locale === "th" ? project.title_th : project.title_en;
            const shortDesc =
              locale === "th"
                ? project.short_description_th
                : project.short_description_en;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/${locale}/works/${project.slug}`}
                  className="block h-full group"
                >
                  <Card
                    hoverEffect
                    className="h-full p-0 overflow-hidden bg-smoke-dark/90 border-border group-hover:border-brand-orange/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Visual Screenshot Area */}
                    <div className="relative w-full aspect-[16/9] bg-smoke overflow-hidden border-b border-border">
                      <Image
                        src={project.cover_image}
                        alt={title}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <Badge variant="orange" size="sm">
                          {project.category}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4 z-10">
                        <Badge variant="muted" size="sm">
                          {project.project_year}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-text-primary group-hover:text-brand-orange transition-colors mb-2">
                          {title}
                        </h3>
                        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                          {shortDesc}
                        </p>
                      </div>

                      {/* Tech stack & Action link */}
                      <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-smoke text-text-muted"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="text-[11px] font-mono px-1.5 py-0.5 text-text-muted">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-mono text-text-secondary group-hover:text-brand-orange transition-colors flex items-center gap-1 shrink-0">
                          <span>Case Study</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
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
