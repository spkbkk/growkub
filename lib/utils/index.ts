import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date, locale: "th" | "en" = "en"): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatBudget(budget: string): string {
  switch (budget) {
    case "under_50k":
    case "< 50,000":
      return "< 50,000 THB";
    case "50k_100k":
    case "50,000 - 100,000":
      return "50,000 - 100,000 THB";
    case "100k_300k":
    case "100,000 - 300,000":
      return "100,000 - 300,000 THB";
    case "over_300k":
    case "300,000+":
      return "300,000+ THB";
    case "discuss":
    case "Let's discuss":
      return "Let's discuss";
    default:
      return budget;
  }
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}
