import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const startTime = Date.now();
    const health = await db.checkHealth();
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      latencyMs: duration,
      isDatabaseUrlSet: isDatabaseConfigured(),
      health,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Health check failed",
      },
      { status: 500 }
    );
  }
}
