import React from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { WorksList } from "@/components/works/WorksList";
import { db } from "@/lib/db";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? (params.locale as Locale) : "th";
  return {
    title: locale === "th" ? "ผลงานทั้งหมด (Selected Works)" : "Selected Works & Case Studies",
    description:
      locale === "th"
        ? "รวมผลงานและเคสศึกษาการพัฒนาระบบ Web Application, Mobile App และระบบองค์กรโดย Growkub"
        : "Explore case studies and software products engineered by Growkub Studio.",
  };
}

export default async function WorksPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const projects = await db.getProjects({ publishedOnly: true });

  return (
    <div className="w-full pt-12 pb-24 relative">
      <BackgroundGlow position="top" />

      <Container>
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-orange">
            // {dict.nav.works}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary">
            {locale === "th" ? "ผลงานและกรณีศึกษา" : "Selected Works & Case Studies"}
          </h1>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {locale === "th"
              ? "ตัวอย่างโครงการและระบบซอฟต์แวร์ที่เราได้สร้างสรรค์และส่งมอบจริงให้แก่ลูกค้าในหลากหลายอุตสาหกรรม"
              : "A curated collection of digital products and mission-critical systems engineered for our clients."}
          </p>
        </div>

        {/* Works List with Category Filters */}
        <WorksList locale={locale} dict={dict} projects={projects} />
      </Container>
    </div>
  );
}
