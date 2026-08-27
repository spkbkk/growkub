"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  Terminal,
  UserCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // If on login page, render children directly without admin shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // Verify session
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data && data.authenticated) {
          setUser(data.user);
          setIsLoading(false);
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        if (isMounted) {
          router.replace("/admin/login");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-smoke-black">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-smoke-black flex items-center justify-center text-text-secondary font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
          <span>Authenticating Admin Console...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/leads", label: "Leads", icon: Users },
    { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
    { href: "/admin/services", label: "Services", icon: Layers },
    { href: "/admin/profile", label: "Profile", icon: UserCheck },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-smoke-black flex text-text-primary">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col justify-between border-r border-border bg-smoke-dark/95 p-5 shrink-0">
        <div className="space-y-6">
          {/* Logo & Theme Toggle */}
          <div className="flex items-center justify-between px-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center group select-none"
            >
              <div className="relative h-8 flex items-center">
                <Image
                  src="/logo-white.png"
                  alt="Growkub"
                  width={120}
                  height={36}
                  className="h-7 w-auto object-contain hidden dark:block"
                />
                <Image
                  src="/logo.png"
                  alt="Growkub"
                  width={120}
                  height={36}
                  className="h-7 w-auto object-contain block dark:hidden"
                />
              </div>
            </Link>
            <ThemeToggle />
          </div>

          {/* Nav List */}
          <nav className="space-y-1 pt-2">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-orange text-white font-semibold shadow-glow"
                      : "text-text-secondary hover:text-text-primary hover:bg-smoke"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="space-y-3 pt-6 border-t border-border/80">
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 px-2.5 py-2 rounded-xl bg-smoke/60 hover:bg-smoke border border-transparent hover:border-brand-orange/30 transition-all group cursor-pointer"
            title="Edit Admin Profile"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-orange/15 border border-brand-orange/30 text-brand-orange font-bold text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-text-primary group-hover:text-brand-orange transition-colors truncate flex items-center justify-between">
                <span>{user?.name || "Admin User"}</span>
              </div>
              <div className="text-[11px] text-text-muted truncate">
                {user?.email || "admin@growkub.com"}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/th"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-smoke border border-border text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg bg-smoke border border-border text-text-secondary hover:text-red-400 hover:border-red-500/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Mobile Bar */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-smoke-dark">
          <div className="flex items-center">
            <Image
              src="/logo-white.png"
              alt="Growkub"
              width={100}
              height={28}
              className="h-6 w-auto object-contain hidden dark:block"
            />
            <Image
              src="/logo.png"
              alt="Growkub"
              width={100}
              height={28}
              className="h-6 w-auto object-contain block dark:hidden"
            />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="p-2 rounded-md bg-smoke border border-border text-text-secondary"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Nav Menu */}
        {isMobileNavOpen && (
          <div className="md:hidden bg-smoke-dark border-b border-border p-4 space-y-2 animate-in fade-in-50">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                    active
                      ? "bg-brand-orange text-white font-semibold"
                      : "text-text-secondary hover:bg-smoke"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <Link
                href="/th"
                target="_blank"
                className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-red-400 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
