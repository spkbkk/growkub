import {
  AdminUser,
  Service,
  Project,
  ProjectFeature,
  ProjectImage,
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
import {
  isDatabaseConfigured,
  PostgresDataStore,
  ensureDatabaseInitialized,
} from "./postgres";

export * from "./types";
export { isDatabaseConfigured, ensureDatabaseInitialized };

// In-Memory Repository Store (Fallback & Local Mode)
export class InMemoryDataStore {
  admins: AdminUser[] = [...initialAdmins];
  services: Service[] = [...initialServices];
  projects: Project[] = [...initialProjects];
  leads: Lead[] = [...initialLeads];
  settings: SiteSetting[] = [...initialSiteSettings];

  async getProjects(params?: {
    publishedOnly?: boolean;
    featuredOnly?: boolean;
    category?: string;
  }): Promise<Project[]> {
    let list = this.projects.map((p) => {
      const seeded = initialProjects.find((ip) => ip.id === p.id);
      return seeded ? { ...p, cover_image: seeded.cover_image, images: seeded.images } : p;
    });
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

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const p = this.projects.find((p) => p.slug === slug);
    if (!p) return undefined;
    const seeded = initialProjects.find((ip) => ip.id === p.id);
    return seeded ? { ...p, cover_image: seeded.cover_image, images: seeded.images } : p;
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    return this.projects.find((p) => p.id === id);
  }

  async createProject(data: Partial<Project>): Promise<Project> {
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
      cover_image: data.cover_image || "/images/projects/project-1.jpg",
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

  async updateProject(id: string, data: Partial<Project>): Promise<Project | undefined> {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    this.projects[index] = {
      ...this.projects[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return this.projects[index];
  }

  async deleteProject(id: string): Promise<boolean> {
    const initialLen = this.projects.length;
    this.projects = this.projects.filter((p) => p.id !== id);
    return this.projects.length < initialLen;
  }

  async getServices(activeOnly: boolean = false): Promise<Service[]> {
    let list = [...this.services];
    if (activeOnly) {
      list = list.filter((s) => s.is_active);
    }
    return list.sort((a, b) => a.sort_order - b.sort_order);
  }

  async getServiceById(id: string): Promise<Service | undefined> {
    return this.services.find((s) => s.id === id);
  }

  async createService(data: Partial<Service>): Promise<Service> {
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

  async updateService(id: string, data: Partial<Service>): Promise<Service | undefined> {
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) return undefined;

    this.services[index] = {
      ...this.services[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return this.services[index];
  }

  async deleteService(id: string): Promise<boolean> {
    const initialLen = this.services.length;
    this.services = this.services.filter((s) => s.id !== id);
    return this.services.length < initialLen;
  }

  async getLeads(filter?: { status?: string; search?: string }): Promise<Lead[]> {
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

  async getLeadById(id: string): Promise<Lead | undefined> {
    return this.leads.find((l) => l.id === id);
  }

  async createLead(data: Omit<Lead, "id" | "created_at" | "updated_at">): Promise<Lead> {
    const newLead: Lead = {
      ...data,
      id: "lead-" + (this.leads.length + 1) + "-" + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.leads.unshift(newLead);
    return newLead;
  }

  async updateLeadStatus(
    id: string,
    status: LeadStatus,
    note?: string
  ): Promise<Lead | undefined> {
    const lead = this.leads.find((l) => l.id === id);
    if (!lead) return undefined;

    lead.status = status;
    if (note !== undefined) {
      lead.internal_note = note;
    }
    lead.updated_at = new Date().toISOString();
    return lead;
  }

  async deleteLead(id: string): Promise<boolean> {
    const initialLen = this.leads.length;
    this.leads = this.leads.filter((l) => l.id !== id);
    return this.leads.length < initialLen;
  }

  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    return this.admins.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
  }

  async getAdminById(id: string): Promise<AdminUser | undefined> {
    return this.admins.find((a) => a.id === id);
  }

  async updateAdmin(
    id: string,
    data: { name?: string; email?: string; password_hash?: string }
  ): Promise<AdminUser | undefined> {
    const admin = this.admins.find((a) => a.id === id);
    if (!admin) return undefined;

    if (data.name !== undefined) admin.name = data.name;
    if (data.email !== undefined) admin.email = data.email;
    if (data.password_hash !== undefined) admin.password_hash = data.password_hash;
    admin.updated_at = new Date().toISOString();

    return admin;
  }

  async getAdminStats() {
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

  async getSettings(): Promise<SiteSetting[]> {
    return this.settings;
  }

  async updateSetting(key: string, value_th: string, value_en: string): Promise<SiteSetting> {
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

// Global Persistent Memory Store Singleton for Fallback
declare global {
  var __growkub_store: InMemoryDataStore | undefined;
}

const memoryStore: InMemoryDataStore = (() => {
  if (!global.__growkub_store) {
    global.__growkub_store = new InMemoryDataStore();
  }
  return global.__growkub_store;
})();

const pgStore = new PostgresDataStore();

// Unified Database Facade: Automatic routing to PostgreSQL or In-Memory Store
export class DatabaseFacade {
  private usePostgres(): boolean {
    return isDatabaseConfigured();
  }

  async getProjects(params?: {
    publishedOnly?: boolean;
    featuredOnly?: boolean;
    category?: string;
  }): Promise<Project[]> {
    if (this.usePostgres()) {
      try {
        return await pgStore.getProjects(params);
      } catch (err: any) {
        console.error("[Database] getProjects failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.getProjects(params);
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    if (this.usePostgres()) {
      try {
        return await pgStore.getProjectBySlug(slug);
      } catch (err: any) {
        console.error("[Database] getProjectBySlug failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.getProjectBySlug(slug);
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    if (this.usePostgres()) {
      try {
        return await pgStore.getProjectById(id);
      } catch (err: any) {
        console.error("[Database] getProjectById failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.getProjectById(id);
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    if (this.usePostgres()) {
      try {
        const proj = await pgStore.createProject(data);
        // Also keep memory store updated
        await memoryStore.createProject(proj);
        return proj;
      } catch (err: any) {
        console.error("[Database] createProject failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.createProject(data);
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project | undefined> {
    if (this.usePostgres()) {
      try {
        const updated = await pgStore.updateProject(id, data);
        if (updated) {
          await memoryStore.updateProject(id, data);
          return updated;
        }
      } catch (err: any) {
        console.error("[Database] updateProject failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.updateProject(id, data);
  }

  async deleteProject(id: string): Promise<boolean> {
    if (this.usePostgres()) {
      try {
        const deleted = await pgStore.deleteProject(id);
        await memoryStore.deleteProject(id);
        return deleted;
      } catch (err: any) {
        console.error("[Database] deleteProject failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.deleteProject(id);
  }

  async getServices(activeOnly: boolean = false): Promise<Service[]> {
    if (this.usePostgres()) {
      try {
        return await pgStore.getServices(activeOnly);
      } catch (err: any) {
        console.error("[Database] getServices failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.getServices(activeOnly);
  }

  async getServiceById(id: string): Promise<Service | undefined> {
    if (this.usePostgres()) {
      try {
        return await pgStore.getServiceById(id);
      } catch (err: any) {
        console.error("[Database] getServiceById failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.getServiceById(id);
  }

  async createService(data: Partial<Service>): Promise<Service> {
    if (this.usePostgres()) {
      try {
        const service = await pgStore.createService(data);
        await memoryStore.createService(service);
        return service;
      } catch (err: any) {
        console.error("[Database] createService failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.createService(data);
  }

  async updateService(id: string, data: Partial<Service>): Promise<Service | undefined> {
    if (this.usePostgres()) {
      try {
        const updated = await pgStore.updateService(id, data);
        if (updated) {
          await memoryStore.updateService(id, data);
          return updated;
        }
      } catch (err: any) {
        console.error("[Database] updateService failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.updateService(id, data);
  }

  async deleteService(id: string): Promise<boolean> {
    if (this.usePostgres()) {
      try {
        const deleted = await pgStore.deleteService(id);
        await memoryStore.deleteService(id);
        return deleted;
      } catch (err: any) {
        console.error("[Database] deleteService failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.deleteService(id);
  }

  async getLeads(filter?: { status?: string; search?: string }): Promise<Lead[]> {
    if (this.usePostgres()) {
      try {
        return await pgStore.getLeads(filter);
      } catch (err: any) {
        console.error("[Database] getLeads failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.getLeads(filter);
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    if (this.usePostgres()) {
      try {
        return await pgStore.getLeadById(id);
      } catch (err: any) {
        console.error("[Database] getLeadById failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.getLeadById(id);
  }

  async createLead(data: Omit<Lead, "id" | "created_at" | "updated_at">): Promise<Lead> {
    if (this.usePostgres()) {
      try {
        const lead = await pgStore.createLead(data);
        await memoryStore.createLead(lead);
        return lead;
      } catch (err: any) {
        console.error("[Database] createLead failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.createLead(data);
  }

  async updateLeadStatus(id: string, status: LeadStatus, note?: string): Promise<Lead | undefined> {
    if (this.usePostgres()) {
      try {
        const updated = await pgStore.updateLeadStatus(id, status, note);
        if (updated) {
          await memoryStore.updateLeadStatus(id, status, note);
          return updated;
        }
      } catch (err: any) {
        console.error("[Database] updateLeadStatus failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.updateLeadStatus(id, status, note);
  }

  async deleteLead(id: string): Promise<boolean> {
    if (this.usePostgres()) {
      try {
        const deleted = await pgStore.deleteLead(id);
        await memoryStore.deleteLead(id);
        return deleted;
      } catch (err: any) {
        console.error("[Database] deleteLead failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.deleteLead(id);
  }

  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    if (this.usePostgres()) {
      try {
        return await pgStore.getAdminByEmail(email);
      } catch (err: any) {
        console.error("[Database] getAdminByEmail failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.getAdminByEmail(email);
  }

  async getAdminById(id: string): Promise<AdminUser | undefined> {
    if (this.usePostgres()) {
      try {
        return await pgStore.getAdminById(id);
      } catch (err: any) {
        console.error("[Database] getAdminById failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.getAdminById(id);
  }

  async updateAdmin(
    id: string,
    data: { name?: string; email?: string; password_hash?: string }
  ): Promise<AdminUser | undefined> {
    if (this.usePostgres()) {
      try {
        const updated = await pgStore.updateAdmin(id, data);
        if (updated) {
          await memoryStore.updateAdmin(id, data);
          return updated;
        }
      } catch (err: any) {
        console.error("[Database] updateAdmin failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.updateAdmin(id, data);
  }

  async getAdminStats() {
    if (this.usePostgres()) {
      try {
        return await pgStore.getAdminStats();
      } catch (err: any) {
        console.error("[Database] getAdminStats failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.getAdminStats();
  }

  async getSettings(): Promise<SiteSetting[]> {
    if (this.usePostgres()) {
      try {
        return await pgStore.getSettings();
      } catch (err: any) {
        console.error("[Database] getSettings failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.getSettings();
  }

  async updateSetting(key: string, value_th: string, value_en: string): Promise<SiteSetting> {
    if (this.usePostgres()) {
      try {
        const setting = await pgStore.updateSetting(key, value_th, value_en);
        await memoryStore.updateSetting(key, value_th, value_en);
        return setting;
      } catch (err: any) {
        console.error("[Database] updateSetting failed on Postgres, using fallback:", err.message);
      }
    }
    return memoryStore.updateSetting(key, value_th, value_en);
  }

  async checkHealth() {
    if (this.usePostgres()) {
      return await pgStore.checkHealth();
    }
    return {
      connected: true,
      mode: "in-memory (DATABASE_URL not configured)",
      counts: {
        admins: memoryStore.admins.length,
        services: memoryStore.services.length,
        projects: memoryStore.projects.length,
        leads: memoryStore.leads.length,
      },
    };
  }
}

export const db = new DatabaseFacade();
