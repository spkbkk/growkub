import React from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MessengerFloatingWidget } from "@/components/ui/MessengerFloatingWidget";
import { CookieConsentBanner } from "@/components/ui/CookieConsentBanner";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { db } from "@/lib/db";
import { getDictionary, isValidLocale, Locale, locales } from "@/lib/i18n";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  // Load live settings from DB
  const settings = await db.getSettings();
  const fbSetting = settings.find((s) => s.key === "facebook_page_id");
  const facebookPageUsername = fbSetting?.value_en || fbSetting?.value_th || process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || "growkub";

  const emailSetting = settings.find((s) => s.key === "contact_email");
  const contactEmail = emailSetting?.value_en || emailSetting?.value_th || "contact@growkub.com";

  const heroSetting = settings.find((s) => s.key === "hero_tagline");
  const heroTagline = locale === "th" ? heroSetting?.value_th : heroSetting?.value_en;

  const cookieConsentSetting = settings.find((s) => s.key === "cookie_consent_enabled");
  const isCookieConsentEnabled = cookieConsentSetting ? cookieConsentSetting.value_th === "true" || cookieConsentSetting.value_en === "true" : true;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://growkub.com";

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-smoke-black">
      {/* Invisible Visitor Analytics Tracker (Recorded in backend only) */}
      <VisitorTracker />
      <OrganizationJsonLd
        name="Growkub"
        url={baseUrl}
        logo={`${baseUrl}/logo.png`}
        description="Growkub is a premium digital product and software engineering studio based in Bangkok, Thailand."
        email={contactEmail}
        sameAs={[
          `https://www.facebook.com/${facebookPageUsername}`,
        ]}
        address={{
          addressLocality: "Bangkok",
          addressCountry: "TH",
        }}
      />
      <WebSiteJsonLd
        name="Growkub"
        url={baseUrl}
        description="Digital Product & Software Development Studio"
        inLanguage={["th", "en"]}
      />
      <Navbar locale={locale} dict={dict} />
      <main className="flex-1 w-full">{children}</main>
      <Footer
        locale={locale}
        dict={dict}
        facebookPageUsername={facebookPageUsername}
        contactEmail={contactEmail}
        heroTagline={heroTagline}
      />
      <MessengerFloatingWidget
        locale={locale}
        dict={dict}
        facebookPageUsername={facebookPageUsername}
      />
      {isCookieConsentEnabled && <CookieConsentBanner locale={locale} />}
    </div>
  );
}
