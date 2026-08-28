"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // Do not track admin or API routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    const fullPath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // Prevent duplicate firing on same path
    if (lastTrackedPath.current === fullPath) {
      return;
    }
    lastTrackedPath.current = fullPath;

    // Get or generate anonymous visitor ID
    let visitorId = localStorage.getItem("growkub_vid");
    if (!visitorId) {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem("growkub_vid", visitorId);
    }

    // Detect device type
    const ua = navigator.userAgent;
    let deviceType: "desktop" | "mobile" | "tablet" = "desktop";
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      deviceType = "tablet";
    } else if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
        ua
      )
    ) {
      deviceType = "mobile";
    }

    const locale = pathname.startsWith("/en") ? "en" : "th";
    const referrer = document.referrer || "Direct / Bookmark";

    // Silently send tracking event
    const payload = JSON.stringify({
      path: pathname,
      locale,
      referrer,
      device_type: deviceType,
      visitor_id: visitorId,
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname, searchParams]);

  // Completely invisible component
  return null;
}
