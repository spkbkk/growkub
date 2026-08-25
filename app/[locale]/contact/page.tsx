import React from "react";
import { notFound } from "next/navigation";
import { Mail, MapPin, Clock, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { ContactForm } from "@/components/contact/ContactForm";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? (params.locale as Locale) : "th";
  return {
    title:
      locale === "th"
        ? "ติดต่อเรา / ส่งรายละเอียดโปรเจกต์ (Start a Project)"
        : "Contact Us & Project Request",
    description:
      locale === "th"
        ? "เริ่มพัฒนา Digital Product หรือระบบซอฟต์แวร์ของคุณกับทีมงาน HelmetDev ส่งรายละเอียดเพื่อประเมินราคาได้ทันที"
        : "Start your project with HelmetDev. Send us your project details for a tailored roadmap and quote.",
  };
}

export default async function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const info = dict.contactPage.info;

  return (
    <div className="w-full pt-12 pb-24 relative">
      <BackgroundGlow position="top" />

      <Container>
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-orange">
            // {dict.contactPage.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
            {dict.contactPage.title}
          </h1>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {dict.contactPage.subtitle}
          </p>
        </div>

        {/* 2 Column Layout: Form Left, Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Form */}
          <div className="lg:col-span-8">
            <ContactForm locale={locale} dict={dict} />
          </div>

          {/* Right Info Cards */}
          <div className="lg:col-span-4 space-y-6">
            {/* Direct Contact Card */}
            <Card className="p-6 sm:p-8 bg-smoke-dark border-border space-y-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">
                Direct Communication
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-smoke border border-border flex items-center justify-center text-brand-orange shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block">Direct Email</span>
                    <a
                      href={`mailto:${info.directEmail}`}
                      className="text-sm font-semibold text-text-primary hover:text-brand-orange transition-colors"
                    >
                      {info.directEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-smoke border border-border flex items-center justify-center text-brand-orange shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block">Location</span>
                    <span className="text-sm text-text-secondary">
                      {info.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-smoke border border-border flex items-center justify-center text-brand-orange shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block">Working Hours</span>
                    <span className="text-sm text-text-secondary">
                      {info.workingHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fast Response Badge in Emerald */}
              <div className="pt-4 border-t border-border">
                <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{info.responseGuarantee}</span>
                </div>
              </div>
            </Card>

            {/* Quick Process Note */}
            <Card className="p-6 bg-smoke-dark/70 border-border space-y-3 font-mono text-xs text-text-secondary">
              <div className="text-text-primary font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Next Steps After Inquiry:</span>
              </div>
              <ol className="space-y-2 list-decimal list-inside text-text-muted pl-1">
                <li>Scope & feasibility review (Within 24h)</li>
                <li>Online technical discovery call</li>
                <li>Clear architectural proposal & quote</li>
              </ol>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
