import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = db.getProjects();
  return NextResponse.json({ success: true, projects });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.title_en && !body.title_th) {
      return NextResponse.json(
        { error: "Project title is required" },
        { status: 400 }
      );
    }

    const slug = body.slug || slugify(body.title_en || body.title_th);

    const project = db.createProject({
      ...body,
      slug,
      technologies: Array.isArray(body.technologies)
        ? body.technologies
        : typeof body.technologies === "string"
        ? body.technologies.split(",").map((s: string) => s.trim())
        : ["TypeScript", "Next.js"],
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: any) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
