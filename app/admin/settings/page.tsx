"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, Sliders, Globe, Shield, Cookie } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    hero_tagline_th:
      "เปลี่ยนไอเดียให้กลายเป็น Digital Product ที่สร้างผลลัพธ์จริง",
    hero_tagline_en:
      "We design and build high-performance software for modern businesses.",
    ai_headline_th:
      "พัฒนาซอฟต์แวร์ด้วยพลัง AI ยกระดับความปลอดภัยและเสถียรภาพสูงสุด",
    ai_headline_en:
      "Engineering with AI: Uncompromising Security & Stability",
    ai_security_statement_th:
      "รักษาความลับของธุรกิจ 100% ข้อมูลและ Source Code ของลูกค้าจะไม่ถูกนำไปเทรน AI สาธารณะ พร้อมเข้ารหัส End-to-End ตามมาตรฐาน OWASP และรับประกันเสถียรภาพ 99.99% Uptime",
    ai_security_statement_en:
      "100% data confidentiality. Your proprietary business logic and source code are strictly isolated and never fed into public AI training sets. End-to-end encrypted with 99.99% Uptime.",
    cookie_consent_enabled: "true",
    cookie_consent_title_th: "เว็บไซต์นี้มีการใช้งานคุกกี้ (Cookie Policy)",
    cookie_consent_title_en: "We Value Your Privacy & Cookies",
    cookie_consent_message_th:
      "เราใช้คุกกี้ที่จำเป็นและคุกกี้เพื่อการวิเคราะห์เพื่อมอบประสบการณ์การใช้งานที่ราบรื่นและปลอดภัยตามมาตรฐาน PDPA",
    cookie_consent_message_en:
      "We use essential and analytics cookies to optimize performance and deliver a secure browsing experience in compliance with PDPA standards.",
    contact_email: "contact@growkub.com",
    contact_phone: "+66 81 234 5678",
    location: "Bangkok, Thailand",
    facebook_page_id: "growkub",
    line_oa_url: "https://lin.ee/8bzBi8O",
  });

  const [dbStatus, setDbStatus] = useState<{ connected: boolean; mode: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch("/api/admin/health");
      const data = await res.json();
      if (data.health) {
        setDbStatus(data.health);
      }
    } catch (err) {
      console.error("Failed to check health:", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && Array.isArray(data.settings)) {
        const newSettings = { ...settings };
        data.settings.forEach((s: any) => {
          if (s.key === "hero_tagline") {
            newSettings.hero_tagline_th = s.value_th || newSettings.hero_tagline_th;
            newSettings.hero_tagline_en = s.value_en || newSettings.hero_tagline_en;
          } else if (s.key === "ai_headline") {
            newSettings.ai_headline_th = s.value_th || newSettings.ai_headline_th;
            newSettings.ai_headline_en = s.value_en || newSettings.ai_headline_en;
          } else if (s.key === "ai_security_statement") {
            newSettings.ai_security_statement_th = s.value_th || newSettings.ai_security_statement_th;
            newSettings.ai_security_statement_en = s.value_en || newSettings.ai_security_statement_en;
          } else if (s.key === "cookie_consent_enabled") {
            newSettings.cookie_consent_enabled = s.value_th || s.value_en || "true";
          } else if (s.key === "cookie_consent_title") {
            newSettings.cookie_consent_title_th = s.value_th || newSettings.cookie_consent_title_th;
            newSettings.cookie_consent_title_en = s.value_en || newSettings.cookie_consent_title_en;
          } else if (s.key === "cookie_consent_message") {
            newSettings.cookie_consent_message_th = s.value_th || newSettings.cookie_consent_message_th;
            newSettings.cookie_consent_message_en = s.value_en || newSettings.cookie_consent_message_en;
          } else if (s.key === "contact_email") {
            newSettings.contact_email = s.value_en || s.value_th || newSettings.contact_email;
          } else if (s.key === "contact_phone") {
            newSettings.contact_phone = s.value_en || s.value_th || newSettings.contact_phone;
          } else if (s.key === "location") {
            newSettings.location = s.value_en || s.value_th || newSettings.location;
          } else if (s.key === "facebook_page_id") {
            newSettings.facebook_page_id = s.value_en || s.value_th || newSettings.facebook_page_id;
          } else if (s.key === "line_oa_url") {
            newSettings.line_oa_url = s.value_en || s.value_th || newSettings.line_oa_url;
          }
        });
        setSettings(newSettings);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedMessage(null);
    setErrorMessage(null);

    try {
      const responses = await Promise.all([
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "hero_tagline",
            value_th: settings.hero_tagline_th,
            value_en: settings.hero_tagline_en,
          }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "ai_headline",
            value_th: settings.ai_headline_th,
            value_en: settings.ai_headline_en,
          }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "ai_security_statement",
            value_th: settings.ai_security_statement_th,
            value_en: settings.ai_security_statement_en,
          }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "cookie_consent_enabled",
            value_th: settings.cookie_consent_enabled,
            value_en: settings.cookie_consent_enabled,
          }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "cookie_consent_title",
            value_th: settings.cookie_consent_title_th,
            value_en: settings.cookie_consent_title_en,
          }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "cookie_consent_message",
            value_th: settings.cookie_consent_message_th,
            value_en: settings.cookie_consent_message_en,
          }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "contact_email",
            value_th: settings.contact_email,
            value_en: settings.contact_email,
          }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "contact_phone",
            value_th: settings.contact_phone,
            value_en: settings.contact_phone,
          }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "location",
            value_th: settings.location,
            value_en: settings.location,
          }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "facebook_page_id",
            value_th: settings.facebook_page_id,
            value_en: settings.facebook_page_id,
          }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "line_oa_url",
            value_th: settings.line_oa_url,
            value_en: settings.line_oa_url,
          }),
        }),
      ]);

      const allOk = responses.every((r) => r.ok);
      if (allOk) {
        setSavedMessage("บันทึกการตั้งค่าทั้งหมดลงฐานข้อมูลเรียบร้อยแล้ว (Saved successfully!)");
        await fetchSettings();
        await fetchHealth();
      } else {
        setErrorMessage("มีบางรายการบันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อ: " + err.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setSavedMessage(null);
        setErrorMessage(null);
      }, 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Site Configuration & Settings
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Configure global copy, Cookie consent (PDPA), contact details, and SEO parameters.
        </p>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3 shadow-lg shadow-emerald-950/30 transition-all">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{savedMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-3 shadow-lg shadow-rose-950/30 transition-all">
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Global Studio Hero Settings */}
        <Card className="p-6 bg-smoke-dark/90 border-border space-y-5">
          <h3 className="text-sm font-bold font-mono text-brand-orange uppercase flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <span>Studio Hero Tagline (TH & EN)</span>
          </h3>

          <Textarea
            label="Hero Tagline (Thai)"
            rows={2}
            value={settings.hero_tagline_th}
            onChange={(e) =>
              setSettings({ ...settings, hero_tagline_th: e.target.value })
            }
          />

          <Textarea
            label="Hero Tagline (English)"
            rows={2}
            value={settings.hero_tagline_en}
            onChange={(e) =>
              setSettings({ ...settings, hero_tagline_en: e.target.value })
            }
          />
        </Card>

        {/* AI-Powered Engineering & Security Statement Settings */}
        <Card className="p-6 bg-smoke-dark/90 border-border space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-emerald-400 uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>AI-Powered Software Development & Security Statement</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Homepage & About Section
            </span>
          </div>

          <p className="text-xs text-text-secondary">
            ข้อความแสดงจุดยืนเรื่องการพัฒนาซอฟต์แวร์ด้วย AI ความปลอดภัยของข้อมูลลูกค้า (Zero-Trust) และความเสถียรของระบบ 99.99% Uptime
          </p>

          <div className="space-y-4">
            <Input
              label="AI Headline (Thai)"
              value={settings.ai_headline_th}
              onChange={(e) =>
                setSettings({ ...settings, ai_headline_th: e.target.value })
              }
            />

            <Input
              label="AI Headline (English)"
              value={settings.ai_headline_en}
              onChange={(e) =>
                setSettings({ ...settings, ai_headline_en: e.target.value })
              }
            />

            <Textarea
              label="Security & Stability Policy Statement (Thai)"
              rows={2}
              value={settings.ai_security_statement_th}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  ai_security_statement_th: e.target.value,
                })
              }
            />

            <Textarea
              label="Security & Stability Policy Statement (English)"
              rows={2}
              value={settings.ai_security_statement_en}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  ai_security_statement_en: e.target.value,
                })
              }
            />
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* Cookie Consent & PDPA Banner Settings */}
        {/* ========================================================================= */}
        <Card className="p-6 bg-smoke-dark/90 border-border space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-amber-400 uppercase flex items-center gap-2">
              <Cookie className="w-4 h-4 text-amber-400" />
              <span>Cookie Policy & PDPA Consent Banner (การจัดการคุกกี้)</span>
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.cookie_consent_enabled === "true"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cookie_consent_enabled: e.target.checked ? "true" : "false",
                  })
                }
                className="w-4 h-4 rounded text-brand-orange focus:ring-brand-orange border-border bg-smoke"
              />
              <span className="text-xs font-mono text-text-primary">
                {settings.cookie_consent_enabled === "true" ? "เปิดใช้งาน (Active)" : "ปิดการแสดงผล"}
              </span>
            </label>
          </div>

          <p className="text-xs text-text-secondary">
            แถบแจ้งเตือนการใช้งานคุกกี้ที่แสดงที่หน้าเว็บตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Cookie Banner Title (Thai)"
                value={settings.cookie_consent_title_th}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cookie_consent_title_th: e.target.value,
                  })
                }
              />
              <Input
                label="Cookie Banner Title (English)"
                value={settings.cookie_consent_title_en}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cookie_consent_title_en: e.target.value,
                  })
                }
              />
            </div>

            <Textarea
              label="Cookie Policy Message (Thai)"
              rows={2}
              value={settings.cookie_consent_message_th}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  cookie_consent_message_th: e.target.value,
                })
              }
            />

            <Textarea
              label="Cookie Policy Message (English)"
              rows={2}
              value={settings.cookie_consent_message_en}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  cookie_consent_message_en: e.target.value,
                })
              }
            />
          </div>
        </Card>

        {/* Global Contact Info */}
        <Card className="p-6 bg-smoke-dark/90 border-border space-y-5">
          <h3 className="text-sm font-bold font-mono text-brand-orange uppercase flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Contact & Inquiries Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              value={settings.contact_email}
              onChange={(e) =>
                setSettings({ ...settings, contact_email: e.target.value })
              }
            />

            <Input
              label="Contact Phone / Hotline"
              value={settings.contact_phone}
              onChange={(e) =>
                setSettings({ ...settings, contact_phone: e.target.value })
              }
            />
          </div>

          <Input
            label="Location & Office City"
            value={settings.location}
            onChange={(e) =>
              setSettings({ ...settings, location: e.target.value })
            }
          />
        </Card>

        {/* Facebook Page & Live Messenger Settings */}
        <Card className="p-6 bg-smoke-dark/90 border-border space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-blue-400 uppercase flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-blue-400"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.512 3.734 7.209v3.533a.75.75 0 0 0 1.155.632l3.418-2.008c.552.095 1.118.146 1.693.146 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2Zm1.08 12.38-2.613-2.787-5.099 2.787 5.607-5.952 2.68 2.787 5.033-2.787-5.608 5.952Z" />
              </svg>
              <span>Facebook Page & Messenger Integration</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Active Widget
            </span>
          </div>

          <p className="text-xs text-text-secondary">
            ตั้งค่าชื่อเพจ Facebook เพื่อให้ระบบสร้างลิงก์แชท m.me อัตโนมัติสำหรับ Floating Widget และหน้าติดต่อ
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Facebook Page Username / ID"
              placeholder="e.g. growkub"
              value={settings.facebook_page_id}
              onChange={(e) =>
                setSettings({ ...settings, facebook_page_id: e.target.value })
              }
            />
            <Input
              label="Direct Messenger Link"
              disabled
              value={`https://m.me/${settings.facebook_page_id || "growkub"}`}
            />
          </div>
        </Card>

        {/* LINE Official Account Settings */}
        <Card className="p-6 bg-smoke-dark/90 border-border space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-[#06C755] uppercase flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-[#06C755]"
                aria-hidden="true"
              >
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
              <span>LINE Official Account (LINE OA) Integration</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#06C755]/15 text-[#06C755] border border-[#06C755]/30">
              Active Widget & Contact
            </span>
          </div>

          <p className="text-xs text-text-secondary">
            ตั้งค่าลิงก์เพิ่มเพื่อน / แชท LINE OA (เช่น https://lin.ee/8bzBi8O) เพื่อแสดงใน Floating Widget, หน้าติดต่อ และส่วนท้ายเว็บ
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="LINE OA Add Friend URL (เช่น https://lin.ee/xxxx)"
              placeholder="https://lin.ee/8bzBi8O"
              value={settings.line_oa_url}
              onChange={(e) =>
                setSettings({ ...settings, line_oa_url: e.target.value })
              }
            />
            <div className="flex items-end">
              <a
                href={settings.line_oa_url || "https://lin.ee/8bzBi8O"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-lg bg-[#06C755]/15 hover:bg-[#06C755]/25 border border-[#06C755]/40 text-[#06C755] font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>ทดสอบเปิดลิงก์ LINE OA ↗</span>
              </a>
            </div>
          </div>
        </Card>

        {/* Database & Environment Info */}
        <Card className="p-6 bg-smoke-dark/60 border-border space-y-4">
          <h3 className="text-sm font-bold font-mono text-text-muted uppercase flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Database & Environment Status</span>
          </h3>
          <div className="text-xs font-mono space-y-2 text-text-secondary">
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-text-muted">Database Engine:</span>
              <span className="text-text-primary">
                {dbStatus?.connected && dbStatus.mode === "postgresql"
                  ? "PostgreSQL / Supabase (Connected 🟢)"
                  : "PostgreSQL / Supabase Ready"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-text-muted">Data Layer:</span>
              <span className="text-emerald-400">Universal Repository Pattern Active</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-text-muted">Admin Authentication:</span>
              <span className="text-emerald-400">Secure HTTP-Only JWT Session Active</span>
            </div>
          </div>
        </Card>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            size="md"
            variant="primary"
            isLoading={isSaving}
            className="font-semibold px-6 py-2.5 shadow-lg shadow-brand-orange/20"
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>Save All Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
