import { Pool } from "pg";
import {
  AdminUser,
  Service,
  Project,
  Lead,
  SiteSetting,
  LeadStatus,
} from "./types";
import {
  initialAdmins,
  initialServices,
  initialProjects,
  initialLeads,
  initialSiteSettings,
} from "./seed-data";

export * from "./types";

// In-Memory Repository Store
class DataStore {
  admins: AdminUser[] = [...initialAdmins];
  services: Service[] = [...initialServices];
  projects: Project[] = [...initialProjects];
  leads: Lead[] = [...initialLeads];
  settings: SiteSetting[] = [...initialSiteSettings];

  getProjects(params?: {
    publishedOnly?: boolean;
    featuredOnly?: boolean;
    category?: string;
  }): Project[] {
    let list = [...this.projects];
    if (params?.publishedOnly) {
      list = list.filter((p) => p.is_published);
    }
    if (params?.featuredOnly) {
      list = list.filter((p) => p.is_featured);
    }
    if (params?.category && params.category !== "all") {
      list = list.filter(
        (p) => p.category.toLowerCase() === params.category?.toLowerCase()
      );
    }
    return list.sort((a, b) => a.sort_order - b.sort_order);
  }

  getProjectBySlug(slug: string): Project | undefined {
    return this.projects.find((p) => p.slug === slug);
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  createProject(data: Partial<Project>): Project {
    const newProject: Project = {
      id: "proj-" + (this.projects.length + 1) + "-" + Date.now(),
      slug: data.slug || "project-" + Date.now(),
      title_th: data.title_th || "",
      title_en: data.title_en || "",
      short_description_th: data.short_description_th || "",
      short_description_en: data.short_description_en || "",
      description_th: data.description_th || "",
      description_en: data.description_en || "",
      category: data.category || "Web Application",
      cover_image: data.cover_image || "/images/projects/project-1.svg",
      client_name: data.client_name || "Confidential",
      project_year: data.project_year || new Date().getFullYear().toString(),
      technologies: data.technologies || ["TypeScript", "Next.js"],
      is_featured: !!data.is_featured,
      sort_order: Number(data.sort_order) || this.projects.length + 1,
      is_published: data.is_published !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      features: data.features || [],
      images: data.images || [],
    };
    this.projects.push(newProject);
    return newProject;
  }

  updateProject(id: string, data: Partial<Project>): Project | undefined {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    this.projects[index] = {
      ...this.projects[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return this.projects[index];
  }

  deleteProject(id: string): boolean {
    const initialLen = this.projects.length;
    this.projects = this.projects.filter((p) => p.id !== id);
    return this.projects.length < initialLen;
  }

  getServices(activeOnly: boolean = false): Service[] {
    let list = [...this.services];
    if (activeOnly) {
      list = list.filter((s) => s.is_active);
    }
    return list.sort((a, b) => a.sort_order - b.sort_order);
  }

  getServiceById(id: string): Service | undefined {
    return this.services.find((s) => s.id === id);
  }

  createService(data: Partial<Service>): Service {
    const newService: Service = {
      id: "srv-" + (this.services.length + 1) + "-" + Date.now(),
      slug: data.slug || "service-" + Date.now(),
      title_th: data.title_th || "",
      title_en: data.title_en || "",
      description_th: data.description_th || "",
      description_en: data.description_en || "",
      icon: data.icon || "Globe",
      sort_order: Number(data.sort_order) || this.services.length + 1,
      is_active: data.is_active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.services.push(newService);
    return newService;
  }

  updateService(id: string, data: Partial<Service>): Service | undefined {
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) return undefined;

    this.services[index] = {
      ...this.services[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return this.services[index];
  }

  deleteService(id: string): boolean {
    const initialLen = this.services.length;
    this.services = this.services.filter((s) => s.id !== id);
    return this.services.length < initialLen;
  }

  getLeads(filter?: { status?: string; search?: string }): Lead[] {
    let list = [...this.leads];
    if (filter?.status && filter.status !== "ALL") {
      list = list.filter((l) => l.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          (l.company && l.company.toLowerCase().includes(q)) ||
          l.project_type.toLowerCase().includes(q)
      );
    }
    return list.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getLeadById(id: string): Lead | undefined {
    return this.leads.find((l) => l.id === id);
  }

  createLead(data: Omit<Lead, "id" | "created_at" | "updated_at">): Lead {
    const newLead: Lead = {
      ...data,
      id: "lead-" + (this.leads.length + 1) + "-" + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.leads.unshift(newLead);
    return newLead;
  }

  updateLeadStatus(
    id: string,
    status: LeadStatus,
    note?: string
  ): Lead | undefined {
    const lead = this.leads.find((l) => l.id === id);
    if (!lead) return undefined;

    lead.status = status;
    if (note !== undefined) {
      lead.internal_note = note;
    }
    lead.updated_at = new Date().toISOString();
    return lead;
  }

  deleteLead(id: string): boolean {
    const initialLen = this.leads.length;
    this.leads = this.leads.filter((l) => l.id !== id);
    return this.leads.length < initialLen;
  }

  getAdminByEmail(email: string): AdminUser | undefined {
    return this.admins.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
  }

  getAdminStats() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const newLeadsCount = this.leads.filter((l) => l.status === "NEW").length;
    const activeProjectsCount = this.projects.length;
    const publishedWorksCount = this.projects.filter(
      (p) => p.is_published
    ).length;
    const thisMonthLeadsCount = this.leads.filter((l) => {
      const d = new Date(l.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    return {
      newLeads: newLeadsCount,
      activeProjects: activeProjectsCount,
      publishedWorks: publishedWorksCount,
      thisMonthLeads: thisMonthLeadsCount,
      totalLeads: this.leads.length,
    };
  }

  getSettings(): SiteSetting[] {
    return this.settings;
  }

  updateSetting(key: string, value_th: string, value_en: string): SiteSetting {
    let setting = this.settings.find((s) => s.key === key);
    if (!setting) {
      setting = {
        id: "set-" + Date.now(),
        key,
        value_th,
        value_en,
        updated_at: new Date().toISOString(),
      };
      this.settings.push(setting);
    } else {
      setting.value_th = value_th;
      setting.value_en = value_en;
      setting.updated_at = new Date().toISOString();
    }
    return setting;
  }
}

// Global Singleton Store for Node runtime
declare global {
  var __helmetdev_store: DataStore | undefined;
}

export const db = global.__helmetdev_store || new DataStore();
if (process.env.NODE_ENV !== "production") {
  global.__helmetdev_store = db;
}
