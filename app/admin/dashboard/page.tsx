import React from "react";
import Link from "next/link";
import {
  Users,
  FolderGit2,
  CheckCircle2,
  Calendar,
  ArrowRight,
  PlusCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await db.getAdminStats();
  const recentLeads = (await db.getLeads()).slice(0, 5);
  const recentProjects = (await db.getProjects()).slice(0, 4);
  const dbHealth = await db.checkHealth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge variant="orange">NEW</Badge>;
      case "CONTACTED":
        return <Badge variant="default">CONTACTED</Badge>;
      case "DISCUSSION":
        return <Badge variant="default">DISCUSSION</Badge>;
      case "QUOTATION":
        return <Badge variant="default">QUOTATION</Badge>;
      case "WON":
        return <Badge variant="success">WON</Badge>;
      case "LOST":
        return <Badge variant="muted">LOST</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Dashboard Overview
            </h1>
            {dbHealth.connected && dbHealth.mode === "postgresql" ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Supabase / Postgres Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30" title="Set DATABASE_URL to connect live PostgreSQL">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                In-Memory Mode
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Key operational metrics and recent customer inquiries.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button href="/admin/projects/new" size="sm" variant="primary">
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: New Leads */}
        <Card className="p-6 bg-smoke-dark/90 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-muted uppercase">
              New Leads
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-orange/10 text-brand-orange flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-brand-orange">
              {stats.newLeads}
            </div>
            <span className="text-[11px] text-text-muted mt-1 block">
              Requires initial response
            </span>
          </div>
        </Card>

        {/* KPI 2: Active Projects */}
        <Card className="p-6 bg-smoke-dark/90 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-muted uppercase">
              Total Projects
            </span>
            <div className="w-8 h-8 rounded-lg bg-smoke text-text-secondary flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-text-primary">
              {stats.activeProjects}
            </div>
            <span className="text-[11px] text-text-muted mt-1 block">
              In portfolio catalog
            </span>
          </div>
        </Card>

        {/* KPI 3: Published Works */}
        <Card className="p-6 bg-smoke-dark/90 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-muted uppercase">
              Published Works
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-400">
              {stats.publishedWorks}
            </div>
            <span className="text-[11px] text-text-muted mt-1 block">
              Live on website
            </span>
          </div>
        </Card>

        {/* KPI 4: Monthly Leads */}
        <Card className="p-6 bg-smoke-dark/90 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-muted uppercase">
              This Month Leads
            </span>
            <div className="w-8 h-8 rounded-lg bg-smoke text-text-secondary flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-text-primary">
              {stats.thisMonthLeads}
            </div>
            <span className="text-[11px] text-text-muted mt-1 block">
              Current calendar month
            </span>
          </div>
        </Card>
      </div>

      {/* Recent Leads Table Card */}
      <Card className="p-6 bg-smoke-dark/90 border-border space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Recent Project Inquiries
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Latest requests submitted through public contact forms.
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-mono text-brand-orange hover:text-brand-orangeHover transition-colors flex items-center gap-1"
          >
            <span>View All ({stats.totalLeads})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs font-mono text-text-muted border-b border-border uppercase">
              <tr>
                <th className="pb-3 font-normal">Date</th>
                <th className="pb-3 font-normal">Client Name</th>
                <th className="pb-3 font-normal">Company</th>
                <th className="pb-3 font-normal">Project Type</th>
                <th className="pb-3 font-normal">Budget</th>
                <th className="pb-3 font-normal">Status</th>
                <th className="pb-3 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-normal">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-smoke/40 transition-colors">
                  <td className="py-3.5 text-xs text-text-muted font-mono whitespace-nowrap">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="py-3.5 font-medium text-text-primary">
                    {lead.name}
                  </td>
                  <td className="py-3.5 text-text-secondary text-xs">
                    {lead.company || "-"}
                  </td>
                  <td className="py-3.5 text-xs text-text-secondary">
                    {lead.project_type}
                  </td>
                  <td className="py-3.5 text-xs font-mono text-brand-orange">
                    {lead.budget}
                  </td>
                  <td className="py-3.5 whitespace-nowrap">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      href={`/admin/leads?id=${lead.id}`}
                      className="text-xs font-mono text-text-secondary hover:text-brand-orange transition-colors"
                    >
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
