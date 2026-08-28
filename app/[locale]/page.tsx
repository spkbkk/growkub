import React from "react";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WorksSection } from "@/components/home/WorksSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { AboutSection } from "@/components/home/AboutSection";
import { CtaSection } from "@/components/home/CtaSection";
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
  
  if (locale === "th") {
    return {
      title: "Growkub | รับพัฒนาระบบ Web Application และ Software คุณภาพสูง",
      description: "Growkub คือ Digital Product Studio ผู้เชี่ยวชาญด้านการพัฒนา Web Application, Mobile App และ Business Backend สำหรับธุรกิจยุคใหม่",
      alternates: {
        canonical: `/th`,
        languages: {
          th: `/th`,
          en: `/en`,
        },
      },
    };
  }

  return {
    title: "Growkub | Digital Product & Software Development",
    description: "Growkub is a premier software engineering and digital product studio. We build scalable web applications, mobile apps, and custom business backends.",
    alternates: {
      canonical: `/en`,
      languages: {
        th: `/th`,
        en: `/en`,
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const featuredProjects = await db.getProjects({
    publishedOnly: true,
    featuredOnly: true,
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://growkub.com";

  return (
    <div className="w-full">
      <BreadcrumbJsonLd
        items={[
          { name: locale === "th" ? "หน้าหลัก" : "Home", url: `${baseUrl}/${locale}` },
        ]}
      />
      <HeroSection locale={locale} dict={dict} />
      <ServicesSection locale={locale} dict={dict} />
      <WorksSection locale={locale} dict={dict} projects={featuredProjects} />
      <ProcessSection locale={locale} dict={dict} />
      <AboutSection locale={locale} dict={dict} />
      <CtaSection locale={locale} dict={dict} />
    </div>
  );
}
