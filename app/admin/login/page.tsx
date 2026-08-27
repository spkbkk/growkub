"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@growkub.com");
  const [password, setPassword] = useState("admin_growkub_2026");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-smoke-black flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundGlow position="center" />

      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/th"
            className="inline-flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-brand-orange transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </Link>
        </div>

        <Card className="p-8 sm:p-10 bg-smoke-dark/95 border-border shadow-2xl space-y-6">
          {/* Logo & Title */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-1">
              <Image
                src="/logo-white.png"
                alt="Growkub Logo"
                width={180}
                height={60}
                priority
                className="h-12 w-auto object-contain hidden dark:block"
              />
              <Image
                src="/logo.png"
                alt="Growkub Logo"
                width={180}
                height={60}
                priority
                className="h-12 w-auto object-contain block dark:hidden"
              />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-mono">
                Management Portal & CMS Console
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@growkub.com"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                isLoading={isLoading}
                className="w-full font-semibold justify-center"
              >
                <Lock className="w-4 h-4 mr-1.5" />
                <span>Sign in to Dashboard</span>
              </Button>
            </div>
          </form>

          {/* Quick Helper Note for Demo */}
          <div className="pt-4 border-t border-border/60 text-center">
            <p className="text-[11px] font-mono text-text-muted">
              Demo credentials auto-filled:
              <br />
              <span className="text-brand-orange">admin@growkub.com</span> /{" "}
              <span className="text-brand-orange">admin_growkub_2026</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
