"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Project, ProjectFeature } from "@/lib/db";

interface ProjectFormProps {
  initialData?: Project;
  isEdit?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  isEdit = false,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title_th: initialData?.title_th || "",
    title_en: initialData?.title_en || "",
    slug: initialData?.slug || "",
    short_description_th: initialData?.short_description_th || "",
    short_description_en: initialData?.short_description_en || "",
    description_th: initialData?.description_th || "",
    description_en: initialData?.description_en || "",
    category: initialData?.category || "Web Application",
    cover_image: initialData?.cover_image || "/images/projects/project-1.svg",
    client_name: initialData?.client_name || "Confidential",
    project_year: initialData?.project_year || "2026",
    technologies: initialData?.technologies?.join(", ") || "Next.js, TypeScript, PostgreSQL",
    is_featured: initialData?.is_featured || false,
    is_published: initialData?.is_published !== false,
    sort_order: initialData?.sort_order || 1,
  });

  const [features, setFeatures] = useState<ProjectFeature[]>(
    initialData?.features || []
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFeature = () => {
    const newFeature: ProjectFeature = {
      id: "feat-" + Date.now(),
      project_id: initialData?.id || "",
      title_th: "",
      title_en: "",
      description_th: "",
      description_en: "",
      sort_order: features.length + 1,
    };
    setFeatures([...features, newFeature]);
  };

  const updateFeature = (
    index: number,
    field: keyof ProjectFeature,
    value: string
  ) => {
    const next = [...features];
    (next[index] as any)[field] = value;
    setFeatures(next);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      ...formData,
      features,
      technologies: formData.technologies
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = isEdit
        ? `/api/admin/projects/${initialData?.id}`
        : "/api/admin/projects";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save project");

      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>{isEdit ? "Update Project" : "Create Project"}</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Form Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Bilingual Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Titles & Slug */}
          <Card className="p-6 bg-smoke-dark/90 border-border space-y-5">
            <h3 className="text-sm font-bold font-mono text-brand-orange uppercase">
              Project Titles (TH & EN)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Project Title (Thai)"
                required
                value={formData.title_th}
                onChange={(e) =>
                  setFormData({ ...formData, title_th: e.target.value })
                }
                placeholder="เช่น แพลตฟอร์ม Live Commerce (Demo)"
              />
              <Input
                label="Project Title (English)"
                required
                value={formData.title_en}
                onChange={(e) =>
                  setFormData({ ...formData, title_en: e.target.value })
                }
                placeholder="e.g. Live Commerce Platform (Demo)"
              />
            </div>
            <Input
              label="URL Slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="e.g. live-commerce-platform"
              hint="Leave blank to auto-generate from title"
            />
          </Card>

          {/* Short Descriptions */}
          <Card className="p-6 bg-smoke-dark/90 border-border space-y-5">
            <h3 className="text-sm font-bold font-mono text-brand-orange uppercase">
              Short Description (TH & EN)
            </h3>
            <Textarea
              label="Short Description (Thai)"
              required
              rows={2}
              value={formData.short_description_th}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  short_description_th: e.target.value,
                })
              }
              placeholder="คำอธิบายสั้นๆ 1-2 ประโยคสำหรับแสดงบนการ์ดผลงาน..."
            />
            <Textarea
              label="Short Description (English)"
              required
              rows={2}
              value={formData.short_description_en}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  short_description_en: e.target.value,
                })
              }
              placeholder="Short 1-2 sentence description for portfolio cards..."
            />
          </Card>

          {/* Full Descriptions */}
          <Card className="p-6 bg-smoke-dark/90 border-border space-y-5">
            <h3 className="text-sm font-bold font-mono text-brand-orange uppercase">
              Full Case Study Content (TH & EN)
            </h3>
            <Textarea
              label="Full Description (Thai)"
              required
              rows={5}
              value={formData.description_th}
              onChange={(e) =>
                setFormData({ ...formData, description_th: e.target.value })
              }
              placeholder="รายละเอียดโครงการ ปัญหาและโซลูชัน..."
            />
            <Textarea
              label="Full Description (English)"
              required
              rows={5}
              value={formData.description_en}
              onChange={(e) =>
                setFormData({ ...formData, description_en: e.target.value })
              }
              placeholder="Detailed case study background, challenge, and architecture..."
            />
          </Card>

          {/* Project Features List */}
          <Card className="p-6 bg-smoke-dark/90 border-border space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono text-brand-orange uppercase">
                Key Features (TH & EN)
              </h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addFeature}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Add Feature</span>
              </Button>
            </div>

            {features.length === 0 ? (
              <p className="text-xs text-text-muted font-mono">
                No custom features added yet. Click &quot;Add Feature&quot; above.
              </p>
            ) : (
              <div className="space-y-4">
                {features.map((feat, idx) => (
                  <div
                    key={feat.id || idx}
                    className="p-4 rounded-lg bg-smoke border border-border space-y-3 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="absolute top-3 right-3 text-text-muted hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                      <Input
                        label="Feature Title (Thai)"
                        value={feat.title_th}
                        onChange={(e) =>
                          updateFeature(idx, "title_th", e.target.value)
                        }
                      />
                      <Input
                        label="Feature Title (English)"
                        value={feat.title_en}
                        onChange={(e) =>
                          updateFeature(idx, "title_en", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Textarea
                        label="Feature Description (Thai)"
                        rows={2}
                        value={feat.description_th}
                        onChange={(e) =>
                          updateFeature(idx, "description_th", e.target.value)
                        }
                      />
                      <Textarea
                        label="Feature Description (English)"
                        rows={2}
                        value={feat.description_en}
                        onChange={(e) =>
                          updateFeature(idx, "description_en", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Metadata & Settings */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 bg-smoke-dark/90 border-border space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">
              Publishing & Visibility
            </h3>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) =>
                  setFormData({ ...formData, is_published: e.target.checked })
                }
                className="w-4 h-4 rounded border-border text-brand-orange focus:ring-brand-orange bg-smoke"
              />
              <span className="text-sm font-medium text-text-primary">
                Publish Project (Visible to Public)
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData({ ...formData, is_featured: e.target.checked })
                }
                className="w-4 h-4 rounded border-border text-brand-orange focus:ring-brand-orange bg-smoke"
              />
              <span className="text-sm font-medium text-text-primary">
                Feature on Home Page
              </span>
            </label>

            <Input
              label="Sort Order"
              type="number"
              value={formData.sort_order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sort_order: parseInt(e.target.value) || 1,
                })
              }
            />
          </Card>

          <Card className="p-6 bg-smoke-dark/90 border-border space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">
              Project Attributes
            </h3>

            <Select
              label="Category"
              options={[
                { value: "Web Application", label: "Web Application" },
                { value: "Mobile App", label: "Mobile App" },
                { value: "Business System", label: "Business System" },
                { value: "Live Commerce", label: "Live Commerce" },
                { value: "SaaS", label: "SaaS" },
                { value: "Dashboard", label: "Dashboard" },
              ]}
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />

            <Input
              label="Client / Industry"
              value={formData.client_name}
              onChange={(e) =>
                setFormData({ ...formData, client_name: e.target.value })
              }
              placeholder="e.g. Retail Studio (Concept)"
            />

            <Input
              label="Project Year"
              value={formData.project_year}
              onChange={(e) =>
                setFormData({ ...formData, project_year: e.target.value })
              }
              placeholder="e.g. 2025 - 2026"
            />

            <Input
              label="Technologies (Comma separated)"
              value={formData.technologies}
              onChange={(e) =>
                setFormData({ ...formData, technologies: e.target.value })
              }
              placeholder="Next.js, TypeScript, PostgreSQL, Redis"
            />

            <Input
              label="Cover Image Path / URL"
              value={formData.cover_image}
              onChange={(e) =>
                setFormData({ ...formData, cover_image: e.target.value })
              }
              placeholder="/images/projects/project-1.jpg"
            />
          </Card>
        </div>
      </div>
    </form>
  );
};
