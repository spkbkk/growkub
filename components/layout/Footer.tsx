import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Locale, Dictionary } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
  facebookPageUsername?: string;
  lineOaUrl?: string;
  contactEmail?: string;
  heroTagline?: string;
}

export const Footer: React.FC<FooterProps> = ({
  locale,
  dict,
  facebookPageUsername = "growkub",
  lineOaUrl = "https://lin.ee/8bzBi8O",
  contactEmail = "contact@growkub.com",
  heroTagline,
}) => {
  const currentYear = new Date().getFullYear();
  const displayTagline = heroTagline || dict.footer.tagline;

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
              {displayTagline}
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
                  href={lineOaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#06C755] transition-colors flex items-center gap-2 group text-[#06C755] font-medium"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-[#06C755] shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  <span>LINE Official Account</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href={`https://m.me/${facebookPageUsername}`}
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
                  href={`mailto:${contactEmail}`}
                  className="hover:text-brand-orange transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-text-muted" />
                  <span>{contactEmail}</span>
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
