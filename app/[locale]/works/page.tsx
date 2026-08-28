import React from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { WorksList } from "@/components/works/WorksList";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { db } from "@/lib/db";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? (params.locale as Locale) : "th";
  const title = locale === "th" ? "ผลงานทั้งหมด (Selected Works)" : "Selected Works & Case Studies";
  const description =
    locale === "th"
      ? "รวมผลงานและเคสศึกษาการพัฒนาระบบ Web Application, Mobile App และระบบองค์กรโดย Growkub"
      : "Explore case studies and software products engineered by Growkub Studio.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/works`,
      languages: {
        th: "/th/works",
        en: "/en/works",
      },
    },
    openGraph: {
      title: `${title} | Growkub`,
      description,
      url: `/${locale}/works`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Growkub`,
      description,
    },
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://growkub.com";

  return (
    <div className="w-full pt-12 pb-24 relative">
      <BreadcrumbJsonLd
        items={[
          { name: locale === "th" ? "หน้าหลัก" : "Home", url: `${baseUrl}/${locale}` },
          { name: locale === "th" ? "ผลงาน" : "Works", url: `${baseUrl}/${locale}/works` },
        ]}
      />
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
