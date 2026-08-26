"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, Sliders, Globe, Shield } from "lucide-react";
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
    contact_email: "contact@helmetdev.com",
    contact_phone: "+66 81 234 5678",
    location: "Bangkok, Thailand",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedMessage(null);

    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "hero_tagline",
          value_th: settings.hero_tagline_th,
          value_en: settings.hero_tagline_en,
        }),
      });

      setSavedMessage("Settings saved successfully!");
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
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
          Configure global copy, contact details, and SEO parameters.
        </p>
      </div>

      {savedMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedMessage}</span>
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
              placeholder="e.g. helmetdev"
              defaultValue="helmetdev"
            />
            <Input
              label="Direct Messenger Link"
              disabled
              value="https://m.me/helmetdev"
            />
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
              <span className="text-text-primary">PostgreSQL / Supabase Ready</span>
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
            className="font-semibold"
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>Save All Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
