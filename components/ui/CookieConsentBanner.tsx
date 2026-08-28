"use client";

import React, { useState, useEffect } from "react";
import { Cookie, Shield, Check, Settings, X } from "lucide-react";
import { Locale } from "@/lib/i18n";

interface CookieConsentBannerProps {
  locale: Locale;
}

export function CookieConsentBanner({ locale }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(true);

  useEffect(() => {
    // Check if consent has already been saved
    const saved = localStorage.getItem("growkub_cookie_consent");
    if (!saved) {
      // Delay display slightly for smooth page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("growkub_cookie_consent", JSON.stringify(consent));
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    const consent = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("growkub_cookie_consent", JSON.stringify(consent));
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    const consent = {
      essential: true,
      analytics: analyticsEnabled,
      marketing: marketingEnabled,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("growkub_cookie_consent", JSON.stringify(consent));
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  const isTh = locale === "th";

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-5 sm:p-6 rounded-2xl bg-smoke-dark/95 backdrop-blur-xl border border-brand-orange/40 shadow-2xl shadow-black/80 text-text-primary space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center text-brand-orange shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary tracking-tight">
                {isTh
                  ? "เว็บไซต์นี้ใช้งานคุกกี้ (Cookie Policy)"
                  : "We Value Your Privacy & Cookies"}
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">
                PDPA & GDPR Compliant
              </span>
            </div>
          </div>
          <button
            onClick={handleAcceptEssential}
            className="text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-smoke transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-xs text-text-secondary leading-relaxed">
          {isTh
            ? "เราใช้คุกกี้ที่จำเป็นต่อการทำงานของเว็บไซต์ และคุกกี้เพื่อการวิเคราะห์เพื่อปรับปรุงประสิทธิภาพการให้บริการ ท่านสามารถศึกษานโยบายความปลอดภัยและจัดการความยินยอมได้ตลอดเวลา"
            : "We use essential cookies to make our site work and optional analytics cookies to help us improve your browsing experience and performance."}
        </p>

        {/* Detailed Settings Panel */}
        {showSettings && (
          <div className="p-3.5 rounded-xl bg-smoke-black/70 border border-border/80 space-y-3 text-xs font-mono">
            {/* Essential */}
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-text-primary">
                  {isTh ? "คุกกี้ที่จำเป็น (Essential)" : "Strictly Necessary"}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">
                {isTh ? "เปิดใช้งานเสมอ" : "Always Active"}
              </span>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <div>
                <span className="text-text-primary">
                  {isTh ? "คุกกี้เพื่อการวิเคราะห์" : "Analytics & Performance"}
                </span>
              </div>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-brand-orange focus:ring-brand-orange border-border bg-smoke"
              />
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-text-primary">
                  {isTh ? "คุกกี้เพื่อการตลาด" : "Marketing & Preferences"}
                </span>
              </div>
              <input
                type="checkbox"
                checked={marketingEnabled}
                onChange={(e) => setMarketingEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-brand-orange focus:ring-brand-orange border-border bg-smoke"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {showSettings ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveCustom}
                className="flex-1 py-2 px-3 rounded-lg bg-brand-orange hover:bg-brand-orangeHover text-smoke-black font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-brand-orange/20"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isTh ? "บันทึกการตั้งค่า" : "Save Preferences"}</span>
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="py-2 px-3 rounded-lg bg-smoke hover:bg-border text-text-secondary text-xs transition-colors"
              >
                {isTh ? "ย้อนกลับ" : "Back"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={handleAcceptAll}
                className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-smoke-black font-bold text-xs transition-all shadow-md shadow-brand-orange/20 flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isTh ? "ยอมรับทั้งหมด" : "Accept All"}</span>
              </button>
              <button
                onClick={handleAcceptEssential}
                className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-smoke hover:bg-smoke-dark border border-border text-text-primary text-xs font-medium transition-colors"
              >
                {isTh ? "จำเป็นเท่านั้น" : "Essential Only"}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2.5 rounded-xl bg-smoke hover:bg-smoke-dark border border-border text-text-secondary hover:text-text-primary text-xs transition-colors flex items-center justify-center shrink-0"
                title={isTh ? "ตั้งค่าคุกกี้" : "Cookie Preferences"}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
