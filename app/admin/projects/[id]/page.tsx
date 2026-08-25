import React from "react";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { db } from "@/lib/db";

export default function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = db.getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Edit Project: {project.title_en || project.title_th}
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Update project specifications, features, and screenshots.
        </p>
      </div>

      <ProjectForm initialData={project} isEdit />
    </div>
  );
}
