import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg" | "xl" | "none";
}

export const Section: React.FC<SectionProps> = ({
  className,
  spacing = "lg",
  children,
  ...props
}) => {
  const spacingClasses = {
    none: "",
    sm: "py-10 md:py-14",
    md: "py-14 md:py-20",
    lg: "py-20 md:py-28",
    xl: "py-28 md:py-36",
  };

  return (
    <section className={cn("relative w-full", spacingClasses[spacing], className)} {...props}>
      {children}
    </section>
  );
};
