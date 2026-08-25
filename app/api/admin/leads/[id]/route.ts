import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, LeadStatus } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lead = db.getLeadById(params.id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, lead });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { status, internal_note } = body;

  const validStatuses: LeadStatus[] = [
    "NEW",
    "CONTACTED",
    "DISCUSSION",
    "QUOTATION",
    "WON",
    "LOST",
  ];

  if (status && !validStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Invalid lead status" },
      { status: 400 }
    );
  }

  const updated = db.updateLeadStatus(
    params.id,
    status || "NEW",
    internal_note
  );

  if (!updated) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, lead: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = db.deleteLead(params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
