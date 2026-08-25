import React from "react";
import { cn } from "@/lib/utils";

interface BackgroundGlowProps {
  className?: string;
  position?: "top" | "center" | "bottom" | "top-right" | "top-left";
}

export const BackgroundGlow: React.FC<BackgroundGlowProps> = ({
  className,
  position = "top",
}) => {
  const positionClasses = {
    top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] md:w-[1000px] md:h-[500px]",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px]",
    bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px]",
    "top-right": "top-0 right-0 translate-x-1/3 -translate-y-1/3 w-[600px] h-[600px]",
    "top-left": "top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-[600px] h-[600px]",
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute -z-10 overflow-hidden select-none opacity-40 blur-[100px]",
        positionClasses[position],
        className
      )}
      aria-hidden="true"
    >
      <div className="h-full w-full rounded-full bg-gradient-to-br from-brand-orange/30 via-brand-orange/10 to-transparent" />
    </div>
  );
};
