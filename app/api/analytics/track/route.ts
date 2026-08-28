import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, locale, referrer, device_type, visitor_id } = body;

    if (!path || !visitor_id) {
      return NextResponse.json(
        { error: "path and visitor_id are required" },
        { status: 400 }
      );
    }

    // Ignore tracking for admin panel routes
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ success: true, ignored: true });
    }

    await db.recordPageView({
      path,
      locale: locale || "th",
      referrer: referrer || "",
      device_type: device_type || "desktop",
      visitor_id,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Analytics Track API] Error:", err.message);
    return NextResponse.json(
      { error: "Failed to record pageview" },
      { status: 500 }
    );
  }
}
