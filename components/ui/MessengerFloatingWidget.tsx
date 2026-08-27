"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Locale, Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Official Facebook Messenger SVG Icon
export const MessengerIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.512 3.734 7.209v3.533a.75.75 0 0 0 1.155.632l3.418-2.008c.552.095 1.118.146 1.693.146 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2Zm1.08 12.38-2.613-2.787-5.099 2.787 5.607-5.952 2.68 2.787 5.033-2.787-5.608 5.952Z" />
  </svg>
);

interface MessengerFloatingWidgetProps {
  locale: Locale;
  dict: Dictionary;
  facebookPageUsername?: string;
}

export const MessengerFloatingWidget: React.FC<MessengerFloatingWidgetProps> = ({
  locale,
  dict,
  facebookPageUsername = "growkub",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  const messengerUrl = `https://m.me/${facebookPageUsername}`;
  const t = dict.messengerWidget;

  // Auto show subtle prompt tooltip after 3.5 seconds once per session
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenMessenger = () => {
    window.open(messengerUrl, "_blank", "noopener,noreferrer");
  };

  const handleSelectTopic = () => {
    window.open(messengerUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <aside aria-label="Live Chat & Messenger" className="fixed bottom-5 right-5 z-40 select-none">
      {/* Floating Popover Hub */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.94 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[380px] rounded-2xl bg-smoke-dark/95 border border-border/80 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col font-sans"
            style={{
              boxShadow:
                "0 20px 40px -15px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), 0 0 25px -5px rgba(255,106,0,0.15)",
            }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-smoke to-smoke-dark border-b border-border/70 flex items-center justify-between relative overflow-hidden">
              {/* Subtle orange accent glow line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-orange via-blue-500 to-brand-orange" />

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-smoke-black border border-border p-1.5 flex items-center justify-center shadow-inner">
                    <Image
                      src="/logo-icon.png"
                      alt="Growkub"
                      width={28}
                      height={28}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-smoke-black flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-text-primary tracking-tight">
                      {t.title}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                      Studio
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    {t.onlineStatus}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-smoke-black/60 hover:bg-smoke border border-border/50 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                aria-label={t.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Studio Message Bubble */}
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <MessengerIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="p-3.5 rounded-2xl rounded-tl-sm bg-smoke border border-border/70 text-xs text-text-secondary leading-relaxed shadow-sm">
                    <p className="text-text-primary font-medium mb-1">
                      {locale === "th"
                        ? "ยินดีต้อนรับสู่ Growkub"
                        : "Welcome to Growkub"}
                    </p>
                    {t.greeting}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-text-muted px-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      {t.chatWithDeveloper}
                    </span>
                    <span>
                      {locale === "th" ? "ออนไลน์ตอนนี้" : "Available now"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Topics */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted block">
                  {t.quickQuestionsTitle}
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {t.quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectTopic()}
                      className="group w-full p-2.5 rounded-xl bg-smoke/80 hover:bg-smoke hover:border-brand-orange/40 border border-border/60 text-left transition-all duration-150 flex items-center justify-between gap-2 text-xs text-text-secondary hover:text-text-primary"
                    >
                      <span className="font-medium">{q.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Direct Messenger Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenMessenger()}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all duration-150 group active:scale-[0.98]"
                >
                  <MessengerIcon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{t.openMessenger}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 shrink-0" />
                </button>
              </div>

              {/* Alternative Project Request link */}
              <div className="pt-1 text-center">
                <Link
                  href={`/${locale}/contact`}
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] text-text-muted hover:text-brand-orange transition-colors inline-flex items-center gap-1 font-mono"
                >
                  <span>{t.otherChannels}</span>
                  <span className="text-brand-orange">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button / Toggle Bar */}
      <div className="flex items-center gap-2 justify-end">
        {/* Floating Tooltip Callout (Visible before opening if not opened) */}
        <AnimatePresence>
          {!isOpen && hasPrompted && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="hidden sm:flex items-center gap-2 py-2 px-3.5 rounded-full bg-smoke-dark/95 border border-border hover:border-brand-orange/40 text-xs text-text-primary shadow-xl backdrop-blur-md cursor-pointer transition-all hover:scale-105"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block shrink-0" />
              <span className="font-medium">{t.floatingTooltip}</span>
              <MessengerIcon className="w-3.5 h-3.5 text-blue-400" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Messenger FAB Button */}
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-expanded={isOpen}
          aria-label="Toggle Facebook Messenger Chat"
          className={cn(
            "relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none",
            isOpen
              ? "bg-smoke-dark border-2 border-brand-orange text-text-primary shadow-glow"
              : "bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50"
          )}
        >
          {/* Subtle surrounding ring glow */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping -z-10" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 text-brand-orange" />
          ) : (
            <MessengerIcon className="w-7 h-7 text-white" />
          )}

          {/* Active online green dot */}
          {!isOpen && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-smoke-black flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          )}
        </motion.button>
      </div>
    </aside>
  );
};
