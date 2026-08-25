import React from "react";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Create New Project
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Add a new case study and configure bilingual content.
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}
