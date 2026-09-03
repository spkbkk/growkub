"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Project } from "@/lib/db";
import { Locale, Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface WorksListProps {
  locale: Locale;
  dict: Dictionary;
  projects: Project[];
}

export const WorksList: React.FC<WorksListProps> = ({
  locale,
  dict,
  projects,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { key: "all", label: dict.worksSection.allCategories },
    { key: "Live Commerce", label: "Live Commerce" },
    { key: "Business System", label: dict.worksSection.categoryBusiness },
    { key: "SaaS", label: dict.worksSection.categorySaas },
    { key: "Mobile App", label: dict.worksSection.categoryMobile },
  ];

  const filteredProjects = projects.filter((project) => {
    if (selectedCategory === "all") return true;
    return (
      project.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  });

  return (
    <div className="space-y-10">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setSelectedCategory(cat.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 whitespace-nowrap border",
              selectedCategory === cat.key
                ? "bg-brand-orange text-white border-brand-orange font-semibold shadow-glow"
                : "bg-smoke-dark text-text-secondary border-border hover:text-text-primary hover:bg-smoke"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {filteredProjects.map((project) => {
            const title = locale === "th" ? project.title_th : project.title_en;
            const shortDesc =
              locale === "th"
                ? project.short_description_th
                : project.short_description_en;

            return (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/${locale}/works/${project.slug}`}
                  className="block h-full group"
                >
                  <Card
                    hoverEffect
                    className="h-full p-0 overflow-hidden bg-smoke-dark/90 border-border group-hover:border-brand-orange/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Cover Screenshot */}
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

                    {/* Content */}
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
                          <span>{dict.common.viewCaseStudy}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
