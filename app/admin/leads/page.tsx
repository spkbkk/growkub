"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  Mail,
  Phone,
  Building,
  Calendar,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Lead, LeadStatus } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default function AdminLeadsPage() {
  const searchParams = useSearchParams();
  const initialSelectedId = searchParams.get("id");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editStatus, setEditStatus] = useState<LeadStatus>("NEW");
  const [internalNote, setInternalNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/admin/leads", window.location.origin);
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);
      if (searchQuery) url.searchParams.set("search", searchQuery);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
        if (initialSelectedId) {
          const matched = data.leads.find((l: Lead) => l.id === initialSelectedId);
          if (matched) openLeadModal(matched);
        }
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const openLeadModal = (lead: Lead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setInternalNote(lead.internal_note || "");
    setActionMessage(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedLead) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          internal_note: internalNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage("Lead updated successfully!");
        setSelectedLead(data.lead);
        // Refresh local list
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? data.lead : l))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead?.id === id) {
          setSelectedLead(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusOptions: { value: string; label: string }[] = [
    { value: "ALL", label: "All Statuses" },
    { value: "NEW", label: "NEW" },
    { value: "CONTACTED", label: "CONTACTED" },
    { value: "DISCUSSION", label: "DISCUSSION" },
    { value: "QUOTATION", label: "QUOTATION" },
    { value: "WON", label: "WON" },
    { value: "LOST", label: "LOST" },
  ];

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Lead Management
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Review, filter, and update customer project requests.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-smoke-dark/90 border-border">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, company, or project type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-smoke border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-smoke border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-orange cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-smoke">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" size="sm" variant="secondary" className="w-full sm:w-auto">
            Search
          </Button>
        </form>
      </Card>

      {/* Table */}
      <Card className="p-0 bg-smoke-dark/90 border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs font-mono text-text-muted bg-smoke/80 border-b border-border uppercase">
              <tr>
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal">Name</th>
                <th className="p-4 font-normal">Company</th>
                <th className="p-4 font-normal">Project Type</th>
                <th className="p-4 font-normal">Budget</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted font-mono text-xs">
                    Loading inquiries...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted font-mono text-xs">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-smoke/40 transition-colors">
                    <td className="p-4 text-xs font-mono text-text-muted whitespace-nowrap">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="p-4 font-semibold text-text-primary">
                      {lead.name}
                    </td>
                    <td className="p-4 text-xs text-text-secondary">
                      {lead.company || "-"}
                    </td>
                    <td className="p-4 text-xs text-text-secondary">
                      {lead.project_type}
                    </td>
                    <td className="p-4 text-xs font-mono text-brand-orange">
                      {lead.budget}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openLeadModal(lead)}
                          className="p-1.5 rounded bg-smoke hover:bg-smoke-light text-text-secondary hover:text-text-primary transition-colors"
                          title="View & Edit Lead"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1.5 rounded bg-smoke hover:bg-red-500/20 text-text-secondary hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-2xl bg-smoke-dark border border-border rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-smoke/60">
              <div>
                <span className="text-xs font-mono text-brand-orange">
                  LEAD ID: {selectedLead.id}
                </span>
                <h3 className="text-xl font-bold text-text-primary mt-0.5">
                  {selectedLead.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-lg bg-smoke text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {actionMessage && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{actionMessage}</span>
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-smoke border border-border">
                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-mono uppercase block">
                    Email
                  </span>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="text-text-primary hover:text-brand-orange font-medium flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedLead.email}</span>
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-mono uppercase block">
                    Phone / LINE
                  </span>
                  <span className="text-text-primary font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedLead.phone || "Not specified"}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-mono uppercase block">
                    Company
                  </span>
                  <span className="text-text-primary font-medium flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    <span>{selectedLead.company || "Not specified"}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-text-muted font-mono uppercase block">
                    Received Date
                  </span>
                  <span className="text-text-primary font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(selectedLead.created_at)}</span>
                  </span>
                </div>
              </div>

              {/* Project Scope & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-smoke border border-border space-y-1">
                  <span className="text-xs text-text-muted font-mono uppercase block">
                    Project Type
                  </span>
                  <span className="text-base font-bold text-text-primary block">
                    {selectedLead.project_type}
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-smoke border border-border space-y-1">
                  <span className="text-xs text-text-muted font-mono uppercase block">
                    Estimated Budget
                  </span>
                  <span className="text-base font-bold text-brand-orange block">
                    {selectedLead.budget}
                  </span>
                </div>
              </div>

              {/* Project Message */}
              <div className="space-y-2">
                <span className="text-xs text-text-muted font-mono uppercase block">
                  Customer Message / Requirements
                </span>
                <div className="p-4 rounded-lg bg-smoke border border-border text-text-primary leading-relaxed whitespace-pre-wrap">
                  {selectedLead.message}
                </div>
              </div>

              {/* Status Update & Internal Notes */}
              <div className="p-4 rounded-lg bg-smoke border border-brand-orange/30 space-y-4">
                <span className="text-xs font-mono uppercase text-brand-orange font-bold block">
                  Update Lead Pipeline Status
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">
                      Pipeline Stage
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as LeadStatus)}
                      className="w-full px-3 py-2 bg-smoke-dark border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-orange cursor-pointer"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="DISCUSSION">DISCUSSION</option>
                      <option value="QUOTATION">QUOTATION</option>
                      <option value="WON">WON</option>
                      <option value="LOST">LOST</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      isLoading={isUpdating}
                      onClick={handleUpdateStatus}
                      className="w-full"
                    >
                      Save Status & Note
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-muted block mb-1.5">
                    Internal Engineering / Sales Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add internal notes about meeting outcomes, quotations, or timeline..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="w-full px-3 py-2 bg-smoke-dark border border-border rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border flex items-center justify-between bg-smoke/40">
              <button
                type="button"
                onClick={() => handleDeleteLead(selectedLead.id)}
                className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setSelectedLead(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
