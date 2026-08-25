"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Save,
  Globe,
  Smartphone,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Service } from "@/lib/db";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleToggleActive = async (service: Service) => {
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !service.is_active }),
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? data.service : s))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setIsSaving(true);

    try {
      const isEdit = !!editingService.id;
      const url = isEdit
        ? `/api/admin/services/${editingService.id}`
        : "/api/admin/services";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });

      const data = await res.json();
      if (data.success) {
        setEditingService(null);
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Service Management
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Configure the 3 core studio services and bilingual descriptions.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="primary"
          onClick={() =>
            setEditingService({
              title_th: "",
              title_en: "",
              description_th: "",
              description_en: "",
              icon: "Globe",
              sort_order: services.length + 1,
              is_active: true,
            })
          }
        >
          <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
          <span>Add Service</span>
        </Button>
      </div>

      {/* Services Table */}
      <Card className="p-0 bg-smoke-dark/90 border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs font-mono text-text-muted bg-smoke/80 border-b border-border uppercase">
              <tr>
                <th className="p-4 font-normal">Order</th>
                <th className="p-4 font-normal">Service Name (EN / TH)</th>
                <th className="p-4 font-normal">Icon</th>
                <th className="p-4 font-normal text-center">Status</th>
                <th className="p-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted font-mono text-xs">
                    Loading services...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted font-mono text-xs">
                    No services found. Click &quot;Add Service&quot; above.
                  </td>
                </tr>
              ) : (
                services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-smoke/40 transition-colors">
                    <td className="p-4 text-xs font-mono text-brand-orange font-bold">
                      0{srv.sort_order}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-text-primary">
                        {srv.title_en}
                      </div>
                      <div className="text-xs text-text-muted">
                        {srv.title_th}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono text-text-secondary">
                      {srv.icon}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(srv)}
                        className="inline-flex items-center"
                      >
                        {srv.is_active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="muted">Disabled</Badge>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingService(srv)}
                          className="p-1.5 rounded bg-smoke hover:bg-smoke-light text-text-secondary hover:text-text-primary"
                          title="Edit Service"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(srv.id)}
                          className="p-1.5 rounded bg-smoke hover:bg-red-500/20 text-text-secondary hover:text-red-400"
                          title="Delete Service"
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

      {/* Edit / Create Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-xl bg-smoke-dark border border-border rounded-xl shadow-2xl overflow-hidden">
            <form onSubmit={handleSaveService}>
              {/* Modal Header */}
              <div className="p-5 border-b border-border flex items-center justify-between bg-smoke/60">
                <h3 className="text-base font-bold text-text-primary">
                  {editingService.id ? "Edit Service" : "Add Service"}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="p-1.5 rounded text-text-secondary hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Title (Thai)"
                    required
                    value={editingService.title_th || ""}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        title_th: e.target.value,
                      })
                    }
                  />
                  <Input
                    label="Title (English)"
                    required
                    value={editingService.title_en || ""}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        title_en: e.target.value,
                      })
                    }
                  />
                </div>

                <Textarea
                  label="Description (Thai)"
                  required
                  rows={3}
                  value={editingService.description_th || ""}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description_th: e.target.value,
                    })
                  }
                />

                <Textarea
                  label="Description (English)"
                  required
                  rows={3}
                  value={editingService.description_en || ""}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description_en: e.target.value,
                    })
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Icon Identifier"
                    value={editingService.icon || "Globe"}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        icon: e.target.value,
                      })
                    }
                    placeholder="Globe, Smartphone, Layers"
                  />
                  <Input
                    label="Sort Order"
                    type="number"
                    value={editingService.sort_order || 1}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        sort_order: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border flex items-center justify-end gap-3 bg-smoke/40">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSaving}
                >
                  <Save className="w-4 h-4 mr-1" />
                  <span>Save Service</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
