"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check saved theme or default to light (ตรีมสว่างควันบุหรี่)
    const saved = (localStorage.getItem("hicode_theme") || localStorage.getItem("helmetdev_theme")) as "light" | "dark" | null;
    const initialTheme = saved || "light";
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("hicode_theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-8 h-8 rounded-lg bg-smoke-dark border border-border flex items-center justify-center opacity-50",
          className
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "w-8 h-8 rounded-lg bg-smoke-dark border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-brand-orange/40 transition-all duration-200 focus:outline-none",
        className
      )}
      title={
        theme === "light"
          ? "เปลี่ยนเป็น Dark Smoke"
          : "เปลี่ยนเป็น สว่างควันบุหรี่ (Light Smoke)"
      }
      aria-label="Toggle Smoke Light / Dark Theme"
    >
      {theme === "light" ? (
        <Sun className="w-4 h-4 text-brand-orange" />
      ) : (
        <Moon className="w-4 h-4 text-text-secondary" />
      )}
    </button>
  );
};
