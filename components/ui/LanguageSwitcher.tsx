"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  className,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (targetLocale: Locale) => {
    if (targetLocale === currentLocale) return;

    if (!pathname) {
      router.push(`/${targetLocale}`);
      return;
    }

    const segments = pathname.split("/").filter(Boolean);

    if (segments.length > 0 && (segments[0] === "th" || segments[0] === "en")) {
      segments[0] = targetLocale;
      router.push("/" + segments.join("/"));
    } else {
      router.push(`/${targetLocale}${pathname}`);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center p-0.5 rounded-lg bg-smoke-dark border border-border text-xs font-mono select-none",
        className
      )}
    >
      <button
        type="button"
        onClick={() => handleLanguageChange("th")}
        className={cn(
          "px-2.5 py-1 rounded-md transition-all duration-200 font-medium",
          currentLocale === "th"
            ? "bg-brand-orange text-white shadow-sm font-semibold"
            : "text-text-secondary hover:text-text-primary"
        )}
      >
        TH
      </button>
      <span className="text-border px-0.5">|</span>
      <button
        type="button"
        onClick={() => handleLanguageChange("en")}
        className={cn(
          "px-2.5 py-1 rounded-md transition-all duration-200 font-medium",
          currentLocale === "en"
            ? "bg-brand-orange text-white shadow-sm font-semibold"
            : "text-text-secondary hover:text-text-primary"
        )}
      >
        EN
      </button>
    </div>
  );
};
