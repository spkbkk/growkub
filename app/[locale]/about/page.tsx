import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Code2,
  ShieldCheck,
  Zap,
  Terminal,
  Layers,
  Sparkles,
  ArrowRight,
  Bot,
  Lock,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { BreadcrumbJsonLd, ProfessionalServiceJsonLd } from "@/components/seo/JsonLd";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? (params.locale as Locale) : "th";
  const title = locale === "th" ? "เกี่ยวกับเรา (About)" : "About Growkub";
  const description =
    locale === "th"
      ? "รู้จัก Growkub สตูดิโอผู้พัฒนา Digital Product และซอฟต์แวร์คุณภาพสูงสำหรับธุรกิจยุคใหม่"
      : "Growkub is a digital product studio focused on building high-performance software for modern businesses.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        th: "/th/about",
        en: "/en/about",
      },
    },
    openGraph: {
      title: `${title} | Growkub`,
      description,
      url: `/${locale}/about`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Growkub`,
      description,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  const engineeringPillars = [
    {
      title_th: "วิศวกรรมซอฟต์แวร์ที่เข้มงวด (Strict Engineering)",
      title_en: "Type-Safe & Scalable Architecture",
      description_th:
        "เราใช้ TypeScript แบบเข้มงวด, Server Components เพื่อประสิทธิภาพสูงสุด และการออกแบบฐานข้อมูลแบบ Normalized Database ที่พร้อมรองรับการขยายตัว",
      description_en:
        "We build on solid foundations using strict TypeScript, Next.js Server Components, and normalized PostgreSQL schemas designed for scale.",
      icon: Terminal,
    },
    {
      title_th: "UI/UX ที่เรียบง่ายและทรงพลัง (Minimal & Functional)",
      title_en: "Refined, Modern Aesthetics",
      description_th:
        "ออกแบบอินเทอร์เฟซที่ตัดความซับซ้อนที่ไม่จำเป็นออก เน้นความเร็วในการโหลด การอ่านที่สบายตา และประสบการณ์ผู้ใช้งานระดับสตูดิโอสากล",
      description_en:
        "We craft interfaces that eliminate clutter, prioritizing fast render times, legible typography, and intuitive interaction design.",
      icon: Sparkles,
    },
    {
      title_th: "การทำงานที่โปร่งใสและตรงไปตรงมา (Direct Collaboration)",
      title_en: "Direct Developer Communication",
      description_th:
        "ลูกค้าได้คุยและวางแผนระบบร่วมกับ Senior Developer โดยตรง ลดขั้นตอนของเอเจนซี่แบบดั้งเดิม ทำให้งานเสร็จไวและตรงโจทย์ 100%",
      description_en:
        "You work directly with the senior engineers designing and building your product, eliminating lost-in-translation agency bureaucracy.",
      icon: ShieldCheck,
    },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://growkub.com";

  return (
    <div className="w-full pt-12 pb-24 relative">
      <BreadcrumbJsonLd
        items={[
          { name: locale === "th" ? "หน้าหลัก" : "Home", url: `${baseUrl}/${locale}` },
          { name: locale === "th" ? "เกี่ยวกับเรา" : "About", url: `${baseUrl}/${locale}/about` },
        ]}
      />
      <ProfessionalServiceJsonLd
        name="Growkub"
        url={baseUrl}
        description={locale === "th" ? "Growkub คือ Digital Product Studio ผู้เชี่ยวชาญด้านการพัฒนาซอฟต์แวร์คุณภาพสูง" : "Growkub is a premium digital product and software engineering studio."}
        logo={`${baseUrl}/logo.png`}
        priceRange="$$"
        address={{
          addressLocality: "Bangkok",
          addressCountry: "TH",
        }}
      />
      <BackgroundGlow position="top" />

      <Container>
        {/* Main Intro */}
        <div className="max-w-3xl space-y-6 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-orange">
            // {dict.nav.about}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
            {locale === "th"
              ? "สร้างสรรค์ซอฟต์แวร์ด้วยความประณีตและมาตรฐานระดับสูง"
              : "Engineering Software with Precision and High Standards"}
          </h1>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {dict.aboutSection.leadText}
          </p>
        </div>

        {/* Story / Ethos Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-8 bg-smoke-dark/80 border-border space-y-4">
              <h2 className="text-xl font-bold text-text-primary">
                {locale === "th" ? "แนวทางการทำงานของเรา" : "Our Engineering Philosophy"}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed font-normal">
                {locale === "th"
                  ? "Growkub ก่อตั้งขึ้นจากความตั้งใจที่จะยกระดับการพัฒนาซอฟต์แวร์ในประเทศไทย โดยหลีกเลี่ยงการสร้างระบบที่เทอะทะหรือใช้เทมเพลตสำเร็จรูปราคาถูก เราเชื่อว่าซอฟต์แวร์ที่ดีต้องทำงานได้รวดเร็ว ปลอดภัย มีความเสถียร และช่วยสร้างความได้เปรียบในการแข่งขันให้แก่ธุรกิจของคุณอย่างแท้จริง"
                  : "Growkub was founded to bring modern, no-nonsense software craftsmanship to ambitious businesses. We reject bloated agency retainers and brittle low-code templates. Instead, we engineer custom, robust digital products built with clean code and long-term maintainability."}
              </p>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card className="p-8 bg-smoke-dark/60 border-border space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-text-muted">Studio Focus</span>
                <span className="text-brand-orange">Digital Products & Systems</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-text-muted">Primary Stack</span>
                <span className="text-text-primary">Next.js / TypeScript / Postgres</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-text-muted">Quality Standard</span>
                <span className="text-emerald-400">100% Type-Safe & Tested</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Headquarters</span>
                <span className="text-text-primary">Bangkok, Thailand</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="space-y-6 mb-20">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-orange">
              // CORE PRINCIPLES
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              {locale === "th"
                ? "หลักการสำคัญในการพัฒนาระบบ"
                : "Principles We Never Compromise On"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {engineeringPillars.map((p, pIdx) => {
              const title = locale === "th" ? p.title_th : p.title_en;
              const desc = locale === "th" ? p.description_th : p.description_en;
              const Icon = p.icon;
              return (
                <Card
                  key={pIdx}
                  className="p-8 bg-smoke-dark/80 border-border flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-smoke border border-border flex items-center justify-center text-brand-orange">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">
                      {title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* AI-Powered Engineering & Security Section */}
        <div className="mb-20">
          <Card className="p-8 sm:p-12 bg-gradient-to-b from-smoke-dark/95 via-smoke-dark/80 to-smoke-black border border-brand-orange/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none -mt-24" />
            <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mb-20" />

            <div className="max-w-3xl space-y-4 mb-10 relative z-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" />
                  // {dict.aiEngineeringSection.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {dict.aiEngineeringSection.securityBadge}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-tight">
                {dict.aiEngineeringSection.title}
              </h2>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {dict.aiEngineeringSection.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
              {dict.aiEngineeringSection.features.map((feat, fIdx) => {
                const aiIcons = [Bot, Lock, Activity, Sparkles];
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

            <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted font-mono relative z-10">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{dict.aiEngineeringSection.securityGuarantee}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <Card className="p-8 sm:p-12 bg-smoke-dark border-border text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            {dict.ctaSection.headline}
          </h2>
          <p className="text-sm text-text-secondary mb-6 max-w-lg mx-auto">
            {dict.ctaSection.subtext}
          </p>
          <Button href={`/${locale}/contact`} size="lg" variant="primary">
            {dict.common.startProject}
          </Button>
        </Card>
      </Container>
    </div>
  );
}
