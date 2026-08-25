import React from "react";
import Link from "next/link";
import { Terminal, ArrowUpRight, Github, Mail, Shield } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Locale, Dictionary } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export const Footer: React.FC<FooterProps> = ({ locale, dict }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-smoke-black/90 pt-16 pb-12 relative overflow-hidden">
      {/* Top subtle line glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent" />

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-12 border-b border-border/60">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2.5 group select-none"
              aria-label="HelmetDev Home"
            >
              <div className="w-8 h-8 rounded-lg bg-smoke border border-border flex items-center justify-center">
                <Terminal className="w-4 h-4 text-brand-orange" />
              </div>
              <span className="text-xl font-bold tracking-tight text-text-primary">
                Helmet<span className="text-text-secondary">Dev</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-orange ml-1" />
              </span>
            </Link>
            <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
              {dict.footer.tagline}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                Available for New Projects
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted">
              {dict.footer.navigationTitle}
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link
                  href={`/${locale}/services`}
                  className="hover:text-text-primary transition-colors flex items-center gap-1 group"
                >
                  <span>{dict.nav.services}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/works`}
                  className="hover:text-text-primary transition-colors flex items-center gap-1 group"
                >
                  <span>{dict.nav.works}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#process`}
                  className="hover:text-text-primary transition-colors flex items-center gap-1 group"
                >
                  <span>{dict.nav.process}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="hover:text-text-primary transition-colors flex items-center gap-1 group"
                >
                  <span>{dict.nav.about}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Inquiries */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted">
              {dict.footer.connectTitle}
            </h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li>
                <a
                  href="mailto:contact@helmetdev.com"
                  className="hover:text-brand-orange transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-text-muted" />
                  <span>contact@helmetdev.com</span>
                </a>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-brand-orange hover:text-brand-orangeHover font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>{dict.common.startProject}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-muted">
          <p>© {currentYear} HelmetDev Studio. {dict.footer.rights}</p>
          <div className="flex items-center gap-6">
            <Link
              href="/admin/login"
              className="hover:text-text-secondary transition-colors flex items-center gap-1"
              aria-label="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
