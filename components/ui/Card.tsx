import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  activeBorder?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverEffect = false,
  activeBorder = false,
  glow = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-xl bg-smoke-dark border border-border p-6 md:p-8 transition-all duration-300 relative overflow-hidden",
        hoverEffect && "glass-panel-hover",
        activeBorder && "border-brand-orange/40",
        glow && "shadow-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
