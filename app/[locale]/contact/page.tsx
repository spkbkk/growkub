import React from "react";
import { notFound } from "next/navigation";
import { Mail, MapPin, Clock, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { ContactForm } from "@/components/contact/ContactForm";
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
  const title =
    locale === "th"
      ? "ติดต่อเรา / ส่งรายละเอียดโปรเจกต์ (Start a Project)"
      : "Contact Us & Project Request";
  const description =
    locale === "th"
      ? "เริ่มพัฒนา Digital Product หรือระบบซอฟต์แวร์ของคุณกับทีมงาน Growkub ส่งรายละเอียดเพื่อประเมินราคาได้ทันที"
      : "Start your project with Growkub. Send us your project details for a tailored roadmap and quote.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        th: "/th/contact",
        en: "/en/contact",
      },
    },
    openGraph: {
      title: `${title} | Growkub`,
      description,
      url: `/${locale}/contact`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Growkub`,
      description,
    },
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

  // Load live settings from database
  const settings = await db.getSettings();
  const fbSetting = settings.find((s) => s.key === "facebook_page_id");
  const facebookPageId = fbSetting?.value_en || fbSetting?.value_th || process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || "growkub";

  const lineSetting = settings.find((s) => s.key === "line_oa_url");
  const lineOaUrl = lineSetting?.value_en || lineSetting?.value_th || "https://lin.ee/8bzBi8O";

  const emailSetting = settings.find((s) => s.key === "contact_email");
  const directEmail = emailSetting?.value_en || emailSetting?.value_th || info.directEmail;

  const locSetting = settings.find((s) => s.key === "location");
  const location = (locale === "th" ? locSetting?.value_th : locSetting?.value_en) || locSetting?.value_th || info.location;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://growkub.com";

  return (
    <div className="w-full pt-12 pb-24 relative">
      <BreadcrumbJsonLd
        items={[
          { name: locale === "th" ? "หน้าหลัก" : "Home", url: `${baseUrl}/${locale}` },
          { name: locale === "th" ? "ติดต่อ" : "Contact", url: `${baseUrl}/${locale}/contact` },
        ]}
      />
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
            {/* LINE Official Account Direct Action Card */}
            <Card className="p-6 bg-gradient-to-b from-[#06C755]/15 via-smoke-dark to-smoke-dark border-[#06C755]/35 space-y-4 relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#06C755]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#06C755] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#06C755] animate-pulse" />
                  {locale === "th" ? "แชท LINE สะดวก รวดเร็ว" : "LINE Official Account"}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#06C755]/15 text-[#06C755] border border-[#06C755]/30">
                  Online
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <span>LINE Official Account</span>
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {locale === "th"
                    ? "เพิ่มเพื่อนและทักแชทสอบถามรายละเอียดหรือส่งสเปกงานผ่าน LINE ได้ทันที ตอบกลับไว"
                    : "Add our LINE OA to chat directly with developers, get quotes, or send project specs."}
                </p>
              </div>

              <a
                href={lineOaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#06C755] hover:bg-[#05b04c] text-white font-semibold text-xs shadow-md shadow-[#06C755]/20 flex items-center justify-center gap-2 transition-all group-hover:shadow-[#06C755]/40 active:scale-95"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                <span>{locale === "th" ? "แชทผ่าน LINE OA ทันที →" : "Chat on LINE OA →"}</span>
              </a>
            </Card>

            {/* Facebook Messenger Direct Action Card */}
            <Card className="p-6 bg-gradient-to-b from-blue-950/40 via-smoke-dark to-smoke-dark border-blue-500/30 space-y-4 relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  {locale === "th" ? "Facebook Messenger" : "Live Messenger"}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  Direct
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-text-primary">
                  Facebook Page Messenger
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {locale === "th"
                    ? "หากต้องการปรึกษาเร่งด่วน ทักข้อความคุยกับทีม Senior Developer ผ่าน Messenger ได้ทันที"
                    : "Need quick answers? Chat directly with our senior development team on Messenger."}
                </p>
              </div>

              <a
                href={`https://m.me/${facebookPageId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all group-hover:shadow-blue-500/40"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.512 3.734 7.209v3.533a.75.75 0 0 0 1.155.632l3.418-2.008c.552.095 1.118.146 1.693.146 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2Zm1.08 12.38-2.613-2.787-5.099 2.787 5.607-5.952 2.68 2.787 5.033-2.787-5.608 5.952Z" />
                </svg>
                <span>{locale === "th" ? "เปิด Messenger ทันที →" : "Chat on Messenger →"}</span>
              </a>
            </Card>

            {/* Direct Contact Card */}
            <Card className="p-6 sm:p-8 bg-smoke-dark border-border space-y-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">
                Direct Communication
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#06C755]/10 border border-[#06C755]/30 flex items-center justify-center text-[#06C755] shrink-0 mt-0.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block">LINE Official Account</span>
                    <a
                      href={lineOaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-text-primary hover:text-[#06C755] transition-colors"
                    >
                      {lineOaUrl}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-smoke border border-border flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.512 3.734 7.209v3.533a.75.75 0 0 0 1.155.632l3.418-2.008c.552.095 1.118.146 1.693.146 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2Zm1.08 12.38-2.613-2.787-5.099 2.787 5.607-5.952 2.68 2.787 5.033-2.787-5.608 5.952Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block">Facebook Messenger</span>
                    <a
                      href={`https://m.me/${facebookPageId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-text-primary hover:text-blue-400 transition-colors"
                    >
                      m.me/{facebookPageId}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-smoke border border-border flex items-center justify-center text-brand-orange shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block">Direct Email</span>
                    <a
                      href={`mailto:${directEmail}`}
                      className="text-sm font-semibold text-text-primary hover:text-brand-orange transition-colors"
                    >
                      {directEmail}
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
                      {location}
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
