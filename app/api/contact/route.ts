import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required (at least 2 characters)"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().optional().default(""),
  company: z.string().optional().default(""),
  project_type: z.string().min(1, "Please select a project type"),
  budget: z.string().min(1, "Please select an estimated budget"),
  message: z.string().min(10, "Please provide a brief description (at least 10 characters)"),
  // Honeypot field for anti-spam
  website_hp: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Spam honeypot check: If bot fills website_hp, silently return success without saving
    if (body.website_hp && body.website_hp.length > 0) {
      return NextResponse.json(
        { success: true, message: "Request received" },
        { status: 200 }
      );
    }

    const validated = contactSchema.parse(body);

    const lead = db.createLead({
      name: validated.name.trim(),
      email: validated.email.trim().toLowerCase(),
      phone: validated.phone.trim(),
      company: validated.company.trim(),
      project_type: validated.project_type,
      budget: validated.budget,
      message: validated.message.trim(),
      status: "NEW",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project request submitted successfully",
        id: lead.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
