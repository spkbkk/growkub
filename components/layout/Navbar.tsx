"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Locale, Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface NavbarProps {
  locale: Locale;
  dict: Dictionary;
}

export const Navbar: React.FC<NavbarProps> = ({ locale, dict }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/works`, label: dict.nav.works },
    { href: `/${locale}#process`, label: dict.nav.process },
    { href: `/${locale}/about`, label: dict.nav.about },
  ];

  const isLinkActive = (href: string) => {
    if (href.includes("#")) return false;
    return pathname === href;
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-smoke-black/85 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent py-4 sm:py-5"
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 group select-none"
            aria-label="HelmetDev Home"
          >
            <div className="relative w-8 h-8 rounded-lg bg-smoke-dark/90 border border-border/80 p-1 flex items-center justify-center group-hover:border-brand-orange/50 transition-all duration-200 group-hover:shadow-[0_0_12px_rgba(255,106,0,0.25)]">
              <Image
                src="/logo-icon.png"
                alt="HelmetDev Logo"
                width={28}
                height={28}
                priority
                className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-text-primary flex items-center leading-none">
                Helmet<span className="text-brand-orange ml-0.5">Dev</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-orange ml-1 animate-pulse" />
              </span>
              <span className="text-[9px] font-mono tracking-widest text-text-muted uppercase mt-0.5 leading-none">
                Digital Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "text-text-primary bg-smoke-dark border border-border shadow-sm"
                      : "text-text-secondary hover:text-text-primary hover:bg-smoke-dark/50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-2.5">
            <ThemeToggle />
            <LanguageSwitcher currentLocale={locale} />
            <Button
              href={`/${locale}/contact`}
              size="sm"
              variant="primary"
              className="font-semibold ml-1"
            >
              <span>{dict.common.startProject}</span>
            </Button>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher currentLocale={locale} />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-smoke-dark border border-border text-text-secondary hover:text-text-primary focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-4 pb-6 border-t border-border bg-smoke-dark/95 backdrop-blur-lg rounded-xl p-4 shadow-xl border animate-in fade-in-50 duration-200">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between",
                      active
                        ? "text-brand-orange bg-smoke font-semibold border border-brand-orange/20"
                        : "text-text-secondary hover:text-text-primary hover:bg-smoke"
                    )}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}
              <div className="pt-3 mt-1 border-t border-border/50">
                <Button
                  href={`/${locale}/contact`}
                  variant="primary"
                  className="w-full justify-center"
                >
                  {dict.common.startProject}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};
