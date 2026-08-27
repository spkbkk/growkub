import React from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MessengerFloatingWidget } from "@/components/ui/MessengerFloatingWidget";
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

  // Load live Facebook page ID from DB
  const settings = await db.getSettings();
  const fbSetting = settings.find((s) => s.key === "facebook_page_id");
  const facebookPageUsername = fbSetting?.value_en || fbSetting?.value_th || process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || "growkub";

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-smoke-black">
      <Navbar locale={locale} dict={dict} />
      <main className="flex-1 w-full">{children}</main>
      <Footer locale={locale} dict={dict} />
      <MessengerFloatingWidget
        locale={locale}
        dict={dict}
        facebookPageUsername={facebookPageUsername}
      />
    </div>
  );
}
