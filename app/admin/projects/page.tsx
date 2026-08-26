"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Project } from "@/lib/db";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTogglePublish = async (project: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !project.is_published }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? data.project : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: !project.is_featured }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? data.project : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
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
            Projects & Case Studies
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Manage portfolio items, case studies, and homepage showcase.
          </p>
        </div>
        <Button href="/admin/projects/new" size="sm" variant="primary">
          <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
          <span>Add Project</span>
        </Button>
      </div>

      {/* Projects Table */}
      <Card className="p-0 bg-smoke-dark/90 border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs font-mono text-text-muted bg-smoke/80 border-b border-border uppercase">
              <tr>
                <th className="p-4 font-normal">Project</th>
                <th className="p-4 font-normal">Category</th>
                <th className="p-4 font-normal">Year</th>
                <th className="p-4 font-normal text-center">Featured</th>
                <th className="p-4 font-normal text-center">Published</th>
                <th className="p-4 font-normal text-center">Order</th>
                <th className="p-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted font-mono text-xs">
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted font-mono text-xs">
                    No projects found. Click &quot;Add Project&quot; above to create one.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-smoke/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-8 rounded bg-smoke overflow-hidden shrink-0 border border-border">
                          <Image
                            src={proj.cover_image}
                            alt={proj.title_en || proj.title_th}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-text-primary">
                            {proj.title_en || proj.title_th}
                          </div>
                          <div className="text-xs text-text-muted font-mono">
                            /{proj.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono text-text-secondary">
                      {proj.category}
                    </td>
                    <td className="p-4 text-xs font-mono text-text-muted">
                      {proj.project_year}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(proj)}
                        className={`p-1 rounded transition-colors ${
                          proj.is_featured
                            ? "text-brand-orange hover:text-brand-orangeHover"
                            : "text-text-muted hover:text-text-secondary"
                        }`}
                        title="Toggle Featured"
                      >
                        <Star
                          className="w-4 h-4"
                          fill={proj.is_featured ? "currentColor" : "none"}
                        />
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(proj)}
                        className={`p-1 rounded transition-colors ${
                          proj.is_published
                            ? "text-emerald-400 hover:text-emerald-300"
                            : "text-text-muted hover:text-text-secondary"
                        }`}
                        title="Toggle Published"
                      >
                        {proj.is_published ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-center text-xs font-mono text-text-muted">
                      {proj.sort_order}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/th/works/${proj.slug}`}
                          target="_blank"
                          className="p-1.5 rounded bg-smoke hover:bg-smoke-light text-text-secondary hover:text-text-primary"
                          title="Preview Case Study"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/projects/${proj.id}`}
                          className="p-1.5 rounded bg-smoke hover:bg-smoke-light text-text-secondary hover:text-text-primary"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(proj.id)}
                          className="p-1.5 rounded bg-smoke hover:bg-red-500/20 text-text-secondary hover:text-red-400"
                          title="Delete Project"
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
    </div>
  );
}
