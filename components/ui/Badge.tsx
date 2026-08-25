import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "orange" | "green" | "outline" | "success" | "muted";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}) => {
  const variantStyles = {
    default: "bg-smoke-light text-text-primary border border-border",
    orange: "bg-brand-orange/10 text-brand-orange border border-brand-orange/30 font-medium",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-medium",
    outline: "bg-transparent text-text-secondary border border-border",
    success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold",
    muted: "bg-smoke-dark text-text-muted border border-border/50",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 rounded tracking-wide",
    md: "text-xs px-2.5 py-1 rounded-md tracking-wide",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono uppercase transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
