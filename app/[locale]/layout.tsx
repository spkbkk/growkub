import React from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-smoke-black">
      <Navbar locale={locale} dict={dict} />
      <main className="flex-1 w-full">{children}</main>
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
