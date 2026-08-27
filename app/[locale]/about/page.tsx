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
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? (params.locale as Locale) : "th";
  return {
    title: locale === "th" ? "เกี่ยวกับเรา (About)" : "About Growkub",
    description:
      locale === "th"
        ? "รู้จัก Growkub สตูดิโอผู้พัฒนา Digital Product และซอฟต์แวร์คุณภาพสูงสำหรับธุรกิจยุคใหม่"
        : "Growkub is a digital product studio focused on building high-performance software for modern businesses.",
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

  return (
    <div className="w-full pt-12 pb-24 relative">
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
