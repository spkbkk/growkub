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
  Eye,
  Activity,
  Monitor,
  Smartphone,
  Tablet,
  Globe2,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, analytics, recentLeads, recentProjects, dbHealth] =
    await Promise.all([
      db.getAdminStats(),
      db.getAnalyticsSummary(),
      db.getLeads().then((leads) => leads.slice(0, 5)),
      db.getProjects().then((projs) => projs.slice(0, 4)),
      db.checkHealth(),
    ]);

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

  const totalDeviceViews =
    (analytics.deviceStats.desktop || 0) +
    (analytics.deviceStats.mobile || 0) +
    (analytics.deviceStats.tablet || 0) || 1;

  const desktopPct = Math.round(
    ((analytics.deviceStats.desktop || 0) / totalDeviceViews) * 100
  );
  const mobilePct = Math.round(
    ((analytics.deviceStats.mobile || 0) / totalDeviceViews) * 100
  );
  const tabletPct = Math.round(
    ((analytics.deviceStats.tablet || 0) / totalDeviceViews) * 100
  );

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
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30"
                title="Set DATABASE_URL to connect live PostgreSQL"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                In-Memory Mode
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Key operational metrics, visitor analytics, and recent inquiries.
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
        {/* KPI 1: Total Pageviews */}
        <Card className="p-6 bg-smoke-dark/90 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-muted uppercase">
              Total Pageviews
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-400">
              {analytics.totalPageviews.toLocaleString()}
            </div>
            <span className="text-[11px] text-text-muted mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>{analytics.todayPageviews} views today</span>
            </span>
          </div>
        </Card>

        {/* KPI 2: Unique Visitors */}
        <Card className="p-6 bg-smoke-dark/90 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-muted uppercase">
              Unique Visitors
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-text-primary">
              {analytics.uniqueVisitors.toLocaleString()}
            </div>
            <span className="text-[11px] text-text-muted mt-1 block">
              Distinct visitor devices
            </span>
          </div>
        </Card>

        {/* KPI 3: New Inquiries */}
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

        {/* KPI 4: Published Portfolio Works */}
        <Card className="p-6 bg-smoke-dark/90 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-muted uppercase">
              Published Works
            </span>
            <div className="w-8 h-8 rounded-lg bg-smoke text-text-secondary flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-text-primary">
              {stats.publishedWorks}
            </div>
            <span className="text-[11px] text-text-muted mt-1 block">
              Live in public portfolio
            </span>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* VISITOR & TRAFFIC ANALYTICS (DISPLAYED IN ADMIN ONLY) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Visited Pages (7 Cols) */}
        <Card className="lg:col-span-7 p-6 bg-smoke-dark/90 border-border space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Globe2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary">
                  Top Visited Pages (สถิติหน้ายอดนิยม)
                </h2>
                <p className="text-[11px] text-text-muted">
                  Recorded pageviews across all routes
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-text-muted px-2 py-0.5 rounded bg-smoke border border-border">
              Admin-Only Telemetry
            </span>
          </div>

          <div className="space-y-3">
            {analytics.topPages.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                ยังไม่มีข้อมูลการเข้าชม (รอผู้เข้าชมคนแรกบนระบบ)
              </div>
            ) : (
              analytics.topPages.map((page, idx) => {
                const maxViews = analytics.topPages[0]?.views || 1;
                const pct = Math.round((page.views / maxViews) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-text-primary truncate max-w-[280px]">
                        {page.path}
                      </span>
                      <span className="font-mono text-brand-orange font-bold">
                        {page.views.toLocaleString()} views
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-smoke rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-orange to-emerald-400 rounded-full"
                        style={{ width: `${Math.max(pct, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Device Distribution (5 Cols) */}
        <Card className="lg:col-span-5 p-6 bg-smoke-dark/90 border-border space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <Monitor className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary">
                  Device Breakdown
                </h2>
                <p className="text-[11px] text-text-muted">
                  Visitor device distribution
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Desktop */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-text-secondary">
                  <Monitor className="w-3.5 h-3.5 text-text-primary" />
                  <span>Desktop / Laptop</span>
                </span>
                <span className="font-mono font-bold text-text-primary">
                  {analytics.deviceStats.desktop} ({desktopPct}%)
                </span>
              </div>
              <div className="h-1.5 w-full bg-smoke rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${desktopPct}%` }}
                />
              </div>
            </div>

            {/* Mobile */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-text-secondary">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mobile Phone</span>
                </span>
                <span className="font-mono font-bold text-text-primary">
                  {analytics.deviceStats.mobile} ({mobilePct}%)
                </span>
              </div>
              <div className="h-1.5 w-full bg-smoke rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${mobilePct}%` }}
                />
              </div>
            </div>

            {/* Tablet */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-text-secondary">
                  <Tablet className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tablet / iPad</span>
                </span>
                <span className="font-mono font-bold text-text-primary">
                  {analytics.deviceStats.tablet} ({tabletPct}%)
                </span>
              </div>
              <div className="h-1.5 w-full bg-smoke rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${tabletPct}%` }}
                />
              </div>
            </div>
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
              Latest requests submitted through public contact forms and live chat.
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
                <tr
                  key={lead.id}
                  className="hover:bg-smoke/40 transition-colors"
                >
                  <td className="py-3.5 text-xs text-text-muted font-mono whitespace-nowrap">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="py-3.5 font-medium text-text-primary">
                    {lead.name}
                  </td>
                  <td className="py-3.5 text-text-secondary text-xs">
                    {lead.company || "-"}
                  </td>
                  <td className="py-3.5">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-smoke border border-border">
                      {lead.project_type}
                    </span>
                  </td>
                  <td className="py-3.5 text-xs font-mono text-text-primary">
                    {lead.budget}
                  </td>
                  <td className="py-3.5">{getStatusBadge(lead.status)}</td>
                  <td className="py-3.5 text-right">
                    <Link
                      href={`/admin/leads`}
                      className="text-xs text-brand-orange hover:underline font-mono"
                    >
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-xs text-text-muted"
                  >
                    No inquiries recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
