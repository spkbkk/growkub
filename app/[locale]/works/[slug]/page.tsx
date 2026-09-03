import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  Building,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { BreadcrumbJsonLd, CaseStudyJsonLd } from "@/components/seo/JsonLd";
import { db } from "@/lib/db";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const projects = await db.getProjects({ publishedOnly: true });
    const locales = ["th", "en"];
    return locales.flatMap((locale) =>
      projects.map((p) => ({
        locale,
        slug: p.slug,
      }))
    );
  } catch (e) {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const project = await db.getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found" };

  const locale = isValidLocale(params.locale) ? (params.locale as Locale) : "th";
  const title = locale === "th" ? project.title_th : project.title_en;
  const description =
    locale === "th" ? project.short_description_th : project.short_description_en;

  return {
    title: `${title} | Growkub Case Study`,
    description,
    alternates: {
      canonical: `/${locale}/works/${params.slug}`,
      languages: {
        th: `/th/works/${params.slug}`,
        en: `/en/works/${params.slug}`,
      },
    },
    openGraph: {
      title: `${title} | Growkub`,
      description,
      images: [project.cover_image],
      url: `/${locale}/works/${params.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Growkub`,
      description,
      images: [project.cover_image],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isValidLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const project = await db.getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const title = locale === "th" ? project.title_th : project.title_en;
  const shortDesc =
    locale === "th" ? project.short_description_th : project.short_description_en;
  const fullDesc =
    locale === "th" ? project.description_th : project.description_en;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://growkub.com";

  return (
    <div className="w-full pt-10 pb-24 relative">
      <BreadcrumbJsonLd
        items={[
          { name: locale === "th" ? "หน้าหลัก" : "Home", url: `${baseUrl}/${locale}` },
          { name: locale === "th" ? "ผลงาน" : "Works", url: `${baseUrl}/${locale}/works` },
          { name: title, url: `${baseUrl}/${locale}/works/${project.slug}` },
        ]}
      />
      <CaseStudyJsonLd
        name={title}
        description={shortDesc}
        url={`${baseUrl}/${locale}/works/${project.slug}`}
        image={project.cover_image}
        datePublished={new Date(project.created_at).toISOString()}
        dateModified={new Date(project.updated_at).toISOString()}
        author={{ name: "Growkub", url: baseUrl }}
        technologies={project.technologies}
        clientName={project.client_name}
      />
      <BackgroundGlow position="top" />

      <Container>
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href={`/${locale}/works`}
            className="inline-flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-brand-orange transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{dict.common.backToWorks}</span>
          </Link>
        </div>

        {/* Project Header Info */}
        <div className="space-y-6 max-w-4xl mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="orange">{project.category}</Badge>
            <Badge variant="green">{project.project_year}</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
            {shortDesc}
          </p>

          {/* Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-b border-border py-4 text-xs font-mono">
            <div>
              <span className="text-text-muted block uppercase">Client</span>
              <span className="text-text-primary font-medium mt-1 block">
                {project.client_name}
              </span>
            </div>
            <div>
              <span className="text-text-muted block uppercase">Year</span>
              <span className="text-text-primary font-medium mt-1 block">
                {project.project_year}
              </span>
            </div>
            <div>
              <span className="text-text-muted block uppercase">Category</span>
              <span className="text-text-primary font-medium mt-1 block">
                {project.category}
              </span>
            </div>
            <div>
              <span className="text-text-muted block uppercase">Delivery Status</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live in Production
              </span>
            </div>
          </div>
        </div>

        {/* Hero Screenshot / Visual Asset */}
        <div className="relative w-full aspect-[16/9] max-h-[650px] bg-smoke rounded-2xl overflow-hidden border border-border shadow-card mb-16">
          <Image
            src={project.cover_image}
            alt={title}
            fill
            priority
            className="object-cover object-top"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>

        {/* Case Study Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
          {/* Left Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <section className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-widest text-brand-orange">
                // {dict.caseStudy.overview}
              </h2>
              <p className="text-sm sm:text-base text-text-primary leading-relaxed">
                {fullDesc}
              </p>
            </section>

            {/* Core Features */}
            {project.features && project.features.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-xs font-mono uppercase tracking-widest text-brand-orange">
                  // {dict.caseStudy.keyFeatures}
                </h2>
                <div className="space-y-4">
                  {project.features.map((feat, fIdx) => {
                    const fTitle =
                      locale === "th" ? feat.title_th : feat.title_en;
                    const fDesc =
                      locale === "th" ? feat.description_th : feat.description_en;
                    return (
                      <Card
                        key={feat.id || fIdx}
                        className="p-6 bg-smoke-dark border-border"
                      >
                        <div className="flex items-start gap-3.5">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h3 className="text-base font-bold text-text-primary">
                              {fTitle}
                            </h3>
                            <p className="text-sm text-text-secondary leading-relaxed">
                              {fDesc}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Gallery Screenshots */}
            {project.images && project.images.length > 1 && (
              <section className="space-y-6">
                <h2 className="text-xs font-mono uppercase tracking-widest text-brand-orange">
                  // {dict.caseStudy.screenshots}
                </h2>
                <div className="space-y-6">
                  {project.images.slice(1).map((img, imgIdx) => {
                    const alt =
                      locale === "th" ? img.alt_th : img.alt_en;
                    return (
                      <div
                        key={img.id || imgIdx}
                        className="relative w-full aspect-[16/9] bg-smoke rounded-xl overflow-hidden border border-border"
                      >
                        <Image
                          src={img.image_url}
                          alt={alt || title}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 1200px) 100vw, 800px"
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar: Tech Stack & Key Deliverables */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <Card className="p-6 bg-smoke-dark border-border space-y-6">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
                  {dict.caseStudy.technologies}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="default" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2">
                  Architecture Highlights
                </h3>
                <ul className="space-y-2 text-xs font-mono text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Next.js App Router Architecture</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>PostgreSQL Normalized Schema</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Zero Downtime High-Concurrency</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <Button
                  href={`/${locale}/contact`}
                  size="md"
                  variant="primary"
                  className="w-full font-semibold shadow-glow"
                >
                  <span>{dict.common.startProject}</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Similar Project CTA */}
        <Card className="p-8 sm:p-12 bg-smoke-dark border-border text-center max-w-3xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
              {dict.caseStudy.ctaHeadline}
            </h2>
            <p className="text-sm text-text-secondary max-w-lg mx-auto">
              {dict.caseStudy.ctaSubtext}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Button href={`/${locale}/contact`} size="lg" variant="primary">
                {dict.caseStudy.ctaButton}
              </Button>
              <Button href={`/${locale}/works`} size="lg" variant="secondary">
                {dict.common.allWorks}
              </Button>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
