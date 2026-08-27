import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github, Mail } from "lucide-react";
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
              className="inline-flex items-center group select-none py-1"
              aria-label="Growkub Home"
            >
              <div className="relative h-10 flex items-center">
                <Image
                  src="/logo-white.png"
                  alt="Growkub Logo"
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain hidden dark:block transition-transform duration-200 group-hover:scale-105"
                />
                <Image
                  src="/logo.png"
                  alt="Growkub Logo"
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain block dark:hidden transition-transform duration-200 group-hover:scale-105"
                />
              </div>
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
                  href="https://m.me/growkub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-blue-400 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.512 3.734 7.209v3.533a.75.75 0 0 0 1.155.632l3.418-2.008c.552.095 1.118.146 1.693.146 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2Zm1.08 12.38-2.613-2.787-5.099 2.787 5.607-5.952 2.68 2.787 5.033-2.787-5.608 5.952Z" />
                  </svg>
                  <span>Facebook Messenger</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@growkub.com"
                  className="hover:text-brand-orange transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-text-muted" />
                  <span>contact@growkub.com</span>
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
          <p>© {currentYear} Growkub Studio. {dict.footer.rights}</p>
        </div>
      </Container>
    </footer>
  );
};
