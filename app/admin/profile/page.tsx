"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  KeyRound,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AdminProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Profile Edit State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/profile");
      const data = await res.json();
      if (data && data.user) {
        setProfile(data.user);
        setName(data.user.name || "");
        setEmail(data.user.email || "");
      }
    } catch (err: any) {
      setProfileError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setProfile(data.user);
      setProfileSuccess(data.message || "อัปเดตโปรไฟล์สำเร็จแล้ว");
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSuccess(null);
    setPassError(null);

    if (!currentPassword) {
      setPassError("กรุณาระบุรหัสผ่านปัจจุบัน");
      return;
    }

    if (newPassword.length < 6) {
      setPassError("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setIsChangingPass(true);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setPassSuccess("เปลี่ยนรหัสผ่านสำเร็จแล้ว!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPassSuccess(null), 4000);
    } catch (err: any) {
      setPassError(err.message || "Failed to change password");
    } finally {
      setIsChangingPass(false);
    }
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "AD";
    const parts = nameStr.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-sm font-mono text-text-secondary">
          <div className="w-4 h-4 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
          <span>Loading admin profile data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Admin Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          จัดการข้อมูลส่วนตัวของผู้ดูแลระบบ รหัสผ่าน และการรักษาความปลอดภัยของบัญชี
        </p>
      </div>

      {/* Account Overview Banner Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-smoke-dark via-smoke to-smoke-dark border-border/80 relative overflow-hidden shadow-xl">
        {/* Subtle background glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar Badge */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-orangeHover flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg shadow-brand-orange/20 border-2 border-white/20">
                {getInitials(profile?.name || "")}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-smoke-dark flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                  {profile?.name || "Administrator"}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                  {profile?.role === "admin" ? "SuperAdmin" : profile?.role || "Admin"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Active Session
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary flex items-center gap-1.5 font-mono">
                <Mail className="w-3.5 h-3.5 text-text-muted" />
                <span>{profile?.email || "admin@hicode.com"}</span>
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 text-xs font-mono text-text-muted">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-orange" />
              <span>
                Joined:{" "}
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "2026"}
              </span>
            </div>
            <div className="text-[11px] text-text-muted/80">
              System ID: <span className="text-text-secondary">{profile?.id || "admin-1"}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid: 2 Columns for Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Edit Profile Information */}
        <Card className="p-6 sm:p-7 bg-smoke-dark border-border space-y-6 flex flex-col justify-between shadow-md">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-smoke border border-border flex items-center justify-center text-brand-orange">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    General Information
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    แก้ไขชื่อที่แสดงและอีเมลสำหรับรับการแจ้งเตือน
                  </p>
                </div>
              </div>
            </div>

            {profileSuccess && (
              <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in-50">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-in fade-in-50">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form id="profile-form" onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Input
                  label="Display Name (ชื่อที่แสดง)"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. HiCode SuperAdmin"
                  hint="ชื่อนี้จะแสดงในแถบเมนูและบันทึกกิจกรรมของระบบ"
                />
              </div>

              <div>
                <Input
                  label="Admin Email Address (อีเมลแอดมิน)"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hicode.com"
                  hint="ใช้อีเมลนี้ในการเข้าสู่ระบบ Admin Console"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
                  Assigned Role (ระดับสิทธิ์)
                </label>
                <div className="px-4 py-2.5 bg-smoke border border-border rounded-lg text-sm text-text-secondary flex items-center justify-between">
                  <span className="capitalize font-mono font-medium text-text-primary">
                    {profile?.role || "Super Administrator"}
                  </span>
                  <Shield className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-border/80 flex justify-end">
            <Button
              type="submit"
              form="profile-form"
              variant="primary"
              disabled={isSavingProfile}
              className="w-full sm:w-auto"
            >
              {isSavingProfile ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Saving Changes...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </div>
              )}
            </Button>
          </div>
        </Card>

        {/* Card 2: Change Password & Security */}
        <Card className="p-6 sm:p-7 bg-smoke-dark border-border space-y-6 flex flex-col justify-between shadow-md">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-smoke border border-border flex items-center justify-center text-brand-orange">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Change Password
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    เปลี่ยนรหัสผ่านเพื่อความปลอดภัยของระบบ
                  </p>
                </div>
              </div>
            </div>

            {passSuccess && (
              <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in-50">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            {passError && (
              <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-in fade-in-50">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            <form id="password-form" onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Current Password (รหัสผ่านเดิม) <span className="text-brand-orange">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 pr-10 bg-smoke-dark border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
                  New Password (รหัสผ่านใหม่) <span className="text-brand-orange">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    className="w-full px-4 py-3 pr-10 bg-smoke-dark border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <Input
                  label="Confirm New Password (ยืนยันรหัสผ่านใหม่)"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
                />
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-border/80 flex justify-end">
            <Button
              type="submit"
              form="password-form"
              variant="primary"
              disabled={isChangingPass}
              className="w-full sm:w-auto"
            >
              {isChangingPass ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Updating Password...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Update Password</span>
                </div>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Security Best Practices Card */}
      <Card className="p-6 bg-smoke/40 border-border/80 space-y-3 font-mono text-xs text-text-secondary">
        <div className="flex items-center gap-2 text-text-primary font-bold">
          <Shield className="w-4 h-4 text-brand-orange" />
          <span>Security Recommendations for Administrators:</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-text-muted list-disc list-inside">
          <li>Use strong passwords combining uppercase, lowercase, numbers, and symbols.</li>
          <li>Never share administrator credentials across unverified team members.</li>
          <li>Session token will automatically renew upon updating credentials.</li>
          <li>Always log out when accessing the console from shared devices.</li>
        </ul>
      </Card>
    </div>
  );
}
