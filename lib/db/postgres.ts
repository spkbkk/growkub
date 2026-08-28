import { Pool, QueryResult } from "pg";
import {
  AdminUser,
  Service,
  Project,
  ProjectFeature,
  ProjectImage,
  Lead,
  SiteSetting,
  LeadStatus,
  PageView,
  AnalyticsSummary,
} from "./types";
import {
  initialAdmins,
  initialServices,
  initialProjects,
  initialLeads,
  initialSiteSettings,
} from "./seed-data";

// Connection Pool Singleton
declare global {
  var __growkub_pg_pool: Pool | undefined;
  var __growkub_pg_initialized: Promise<boolean> | undefined;
}

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes("[YOUR_PASSWORD]") || url.includes("YOUR_PASSWORD")) {
    return false;
  }
  return true;
}

export function resolveSupabaseConnectionString(rawUrl: string): string {
  if (!rawUrl) return rawUrl;

  // If already a pooler URL, return as is
  if (rawUrl.includes(".pooler.supabase.com")) {
    return rawUrl;
  }

  // If it's a direct Supabase host db.<ref>.supabase.co, auto-convert to IPv4-compatible pooler for Vercel/Serverless
  const match = rawUrl.match(/postgresql:\/\/([^:]+):([^@]+)@db\.([a-z0-9]+)\.supabase\.co:5432\/(.*)/);
  if (match) {
    const user = match[1];
    const password = match[2];
    const projectRef = match[3];
    const dbName = match[4] || "postgres";

    const region = projectRef === "sqbpmcfaxakinqckoloz" ? "ap-southeast-2" : "ap-southeast-1";
    const username = user.includes(".") ? user : `${user}.${projectRef}`;
    const poolerUrl = `postgresql://${username}:${password}@aws-0-${region}.pooler.supabase.com:6543/${dbName}?pgbouncer=true`;
    console.log(`[PostgreSQL] Auto-resolved direct Supabase host to IPv4 Transaction pooler: aws-0-${region}.pooler.supabase.com:6543`);
    return poolerUrl;
  }

  return rawUrl;
}

export function getPostgresPool(): Pool | null {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (global.__growkub_pg_pool) {
    return global.__growkub_pg_pool;
  }

  const rawUrl = process.env.DATABASE_URL!;
  const connectionString = resolveSupabaseConnectionString(rawUrl);
  const isLocalhost =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");

  const pool = new Pool({
    connectionString,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
    max: 2,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  });

  pool.on("error", (err) => {
    console.error("[PostgreSQL Pool Error]:", err.message);
  });

  global.__growkub_pg_pool = pool;
  return pool;
}

// Auto-migration & Initial Seed
export async function ensureDatabaseInitialized(): Promise<boolean> {
  const pool = getPostgresPool();
  if (!pool) return false;

  if (global.__growkub_pg_initialized) {
    return global.__growkub_pg_initialized;
  }

  global.__growkub_pg_initialized = (async () => {
    try {
      // 1. Create tables if not exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id VARCHAR(255) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'admin',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS services (
          id VARCHAR(255) PRIMARY KEY,
          slug VARCHAR(255) UNIQUE NOT NULL,
          title_th VARCHAR(255) NOT NULL,
          title_en VARCHAR(255) NOT NULL,
          description_th TEXT NOT NULL,
          description_en TEXT NOT NULL,
          icon VARCHAR(100) DEFAULT 'Globe',
          sort_order INT DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS projects (
          id VARCHAR(255) PRIMARY KEY,
          slug VARCHAR(255) UNIQUE NOT NULL,
          title_th VARCHAR(255) NOT NULL,
          title_en VARCHAR(255) NOT NULL,
          short_description_th TEXT NOT NULL,
          short_description_en TEXT NOT NULL,
          description_th TEXT NOT NULL,
          description_en TEXT NOT NULL,
          category VARCHAR(100) NOT NULL,
          cover_image VARCHAR(500) NOT NULL,
          client_name VARCHAR(255) NOT NULL,
          project_year VARCHAR(50) NOT NULL,
          technologies TEXT[] DEFAULT '{}',
          is_featured BOOLEAN DEFAULT FALSE,
          sort_order INT DEFAULT 0,
          is_published BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS project_features (
          id VARCHAR(255) PRIMARY KEY,
          project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
          title_th VARCHAR(255) NOT NULL,
          title_en VARCHAR(255) NOT NULL,
          description_th TEXT NOT NULL,
          description_en TEXT NOT NULL,
          sort_order INT DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS project_images (
          id VARCHAR(255) PRIMARY KEY,
          project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
          image_url VARCHAR(500) NOT NULL,
          alt_th VARCHAR(255),
          alt_en VARCHAR(255),
          sort_order INT DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS leads (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(100),
          company VARCHAR(255),
          project_type VARCHAR(100) NOT NULL,
          budget VARCHAR(100) NOT NULL,
          message TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'NEW',
          internal_note TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS site_settings (
          id VARCHAR(255) PRIMARY KEY,
          key VARCHAR(100) UNIQUE NOT NULL,
          value_th TEXT NOT NULL,
          value_en TEXT NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS page_views (
          id VARCHAR(255) PRIMARY KEY,
          path VARCHAR(255) NOT NULL,
          locale VARCHAR(10) DEFAULT 'th',
          referrer VARCHAR(500),
          device_type VARCHAR(50) DEFAULT 'desktop',
          visitor_id VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views (created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views (path);
        CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views (visitor_id);
      `);

      // 2. Seed initial data if tables are empty
      // Admins
      const adminCountRes = await pool.query("SELECT COUNT(*) FROM admins");
      if (parseInt(adminCountRes.rows[0].count, 10) === 0) {
        for (const a of initialAdmins) {
          await pool.query(
            `INSERT INTO admins (id, email, password_hash, name, role, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (id) DO NOTHING`,
            [a.id, a.email, a.password_hash, a.name, a.role, a.created_at, a.updated_at]
          );
        }
      }

      // Services
      const serviceCountRes = await pool.query("SELECT COUNT(*) FROM services");
      if (parseInt(serviceCountRes.rows[0].count, 10) === 0) {
        for (const s of initialServices) {
          await pool.query(
            `INSERT INTO services (id, slug, title_th, title_en, description_th, description_en, icon, sort_order, is_active, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             ON CONFLICT (id) DO NOTHING`,
            [s.id, s.slug, s.title_th, s.title_en, s.description_th, s.description_en, s.icon, s.sort_order, s.is_active, s.created_at, s.updated_at]
          );
        }
      }

      // Projects
      const projectCountRes = await pool.query("SELECT COUNT(*) FROM projects");
      if (parseInt(projectCountRes.rows[0].count, 10) === 0) {
        for (const p of initialProjects) {
          await pool.query(
            `INSERT INTO projects (id, slug, title_th, title_en, short_description_th, short_description_en, description_th, description_en, category, cover_image, client_name, project_year, technologies, is_featured, sort_order, is_published, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
             ON CONFLICT (id) DO NOTHING`,
            [p.id, p.slug, p.title_th, p.title_en, p.short_description_th, p.short_description_en, p.description_th, p.description_en, p.category, p.cover_image, p.client_name, p.project_year, p.technologies, p.is_featured, p.sort_order, p.is_published, p.created_at, p.updated_at]
          );

          if (p.features && p.features.length > 0) {
            for (const f of p.features) {
              await pool.query(
                `INSERT INTO project_features (id, project_id, title_th, title_en, description_th, description_en, sort_order)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (id) DO NOTHING`,
                [f.id, p.id, f.title_th, f.title_en, f.description_th, f.description_en, f.sort_order]
              );
            }
          }
        }
      }

      // Leads
      const leadCountRes = await pool.query("SELECT COUNT(*) FROM leads");
      if (parseInt(leadCountRes.rows[0].count, 10) === 0) {
        for (const l of initialLeads) {
          await pool.query(
            `INSERT INTO leads (id, name, email, phone, company, project_type, budget, message, status, internal_note, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             ON CONFLICT (id) DO NOTHING`,
            [l.id, l.name, l.email, l.phone, l.company, l.project_type, l.budget, l.message, l.status, l.internal_note || null, l.created_at, l.updated_at]
          );
        }
      }

      // Site Settings
      const settingsCountRes = await pool.query("SELECT COUNT(*) FROM site_settings");
      if (parseInt(settingsCountRes.rows[0].count, 10) === 0) {
        for (const st of initialSiteSettings) {
          await pool.query(
            `INSERT INTO site_settings (id, key, value_th, value_en, updated_at)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (key) DO NOTHING`,
            [st.id, st.key, st.value_th, st.value_en, st.updated_at]
          );
        }
      }

      console.log("[PostgreSQL] Database tables and initial seed verified successfully.");
      return true;
    } catch (err: any) {
      console.error("[PostgreSQL Init Failed]:", err.message);
      return false;
    }
  })();

  return global.__growkub_pg_initialized;
}

// PostgreSQL Data Operations
export class PostgresDataStore {
  private async getClient() {
    await ensureDatabaseInitialized();
    return getPostgresPool()!;
  }

  // --- PROJECTS ---
  async getProjects(params?: {
    publishedOnly?: boolean;
    featuredOnly?: boolean;
    category?: string;
  }): Promise<Project[]> {
    const pool = await this.getClient();
    let query = "SELECT * FROM projects WHERE 1=1";
    const values: any[] = [];

    if (params?.publishedOnly) {
      values.push(true);
      query += ` AND is_published = $${values.length}`;
    }
    if (params?.featuredOnly) {
      values.push(true);
      query += ` AND is_featured = $${values.length}`;
    }
    if (params?.category && params.category !== "all") {
      values.push(params.category.toLowerCase());
      query += ` AND LOWER(category) = $${values.length}`;
    }

    query += " ORDER BY sort_order ASC, created_at DESC";
    const res = await pool.query(query, values);
    const projects: Project[] = res.rows.map(this.mapProjectRow);

    // Fetch features for these projects
    if (projects.length > 0) {
      const projectIds = projects.map((p) => p.id);
      const featRes = await pool.query(
        "SELECT * FROM project_features WHERE project_id = ANY($1) ORDER BY sort_order ASC",
        [projectIds]
      );
      const featuresByProj = featRes.rows.reduce<Record<string, ProjectFeature[]>>((acc, row) => {
        if (!acc[row.project_id]) acc[row.project_id] = [];
        acc[row.project_id].push(this.mapFeatureRow(row));
        return acc;
      }, {});

      projects.forEach((p) => {
        p.features = featuresByProj[p.id] || [];
      });
    }

    return projects;
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const pool = await this.getClient();
    const res = await pool.query("SELECT * FROM projects WHERE slug = $1 LIMIT 1", [slug]);
    if (res.rows.length === 0) return undefined;

    const project = this.mapProjectRow(res.rows[0]);
    const featRes = await pool.query(
      "SELECT * FROM project_features WHERE project_id = $1 ORDER BY sort_order ASC",
      [project.id]
    );
    project.features = featRes.rows.map(this.mapFeatureRow);
    return project;
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const pool = await this.getClient();
    const res = await pool.query("SELECT * FROM projects WHERE id = $1 LIMIT 1", [id]);
    if (res.rows.length === 0) return undefined;

    const project = this.mapProjectRow(res.rows[0]);
    const featRes = await pool.query(
      "SELECT * FROM project_features WHERE project_id = $1 ORDER BY sort_order ASC",
      [project.id]
    );
    project.features = featRes.rows.map(this.mapFeatureRow);
    return project;
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    const pool = await this.getClient();
    const id = "proj-" + Date.now();
    const now = new Date().toISOString();

    const newProject: Project = {
      id,
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
      sort_order: Number(data.sort_order) || 1,
      is_published: data.is_published !== false,
      created_at: now,
      updated_at: now,
      features: data.features || [],
      images: data.images || [],
    };

    await pool.query(
      `INSERT INTO projects (id, slug, title_th, title_en, short_description_th, short_description_en, description_th, description_en, category, cover_image, client_name, project_year, technologies, is_featured, sort_order, is_published, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        newProject.id,
        newProject.slug,
        newProject.title_th,
        newProject.title_en,
        newProject.short_description_th,
        newProject.short_description_en,
        newProject.description_th,
        newProject.description_en,
        newProject.category,
        newProject.cover_image,
        newProject.client_name,
        newProject.project_year,
        newProject.technologies,
        newProject.is_featured,
        newProject.sort_order,
        newProject.is_published,
        newProject.created_at,
        newProject.updated_at,
      ]
    );

    if (newProject.features && newProject.features.length > 0) {
      for (const feat of newProject.features) {
        const featId = feat.id || "feat-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
        await pool.query(
          `INSERT INTO project_features (id, project_id, title_th, title_en, description_th, description_en, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [featId, newProject.id, feat.title_th, feat.title_en, feat.description_th, feat.description_en, feat.sort_order || 0]
        );
      }
    }

    return newProject;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project | undefined> {
    const pool = await this.getClient();
    const existing = await this.getProjectById(id);
    if (!existing) return undefined;

    const updated: Project = {
      ...existing,
      ...data,
      updated_at: new Date().toISOString(),
    };

    await pool.query(
      `UPDATE projects SET
        slug = $1, title_th = $2, title_en = $3,
        short_description_th = $4, short_description_en = $5,
        description_th = $6, description_en = $7,
        category = $8, cover_image = $9, client_name = $10,
        project_year = $11, technologies = $12, is_featured = $13,
        sort_order = $14, is_published = $15, updated_at = $16
       WHERE id = $17`,
      [
        updated.slug,
        updated.title_th,
        updated.title_en,
        updated.short_description_th,
        updated.short_description_en,
        updated.description_th,
        updated.description_en,
        updated.category,
        updated.cover_image,
        updated.client_name,
        updated.project_year,
        updated.technologies,
        updated.is_featured,
        updated.sort_order,
        updated.is_published,
        updated.updated_at,
        id,
      ]
    );

    // If features are updated
    if (data.features !== undefined) {
      await pool.query("DELETE FROM project_features WHERE project_id = $1", [id]);
      for (const feat of data.features) {
        const featId = feat.id || "feat-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
        await pool.query(
          `INSERT INTO project_features (id, project_id, title_th, title_en, description_th, description_en, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [featId, id, feat.title_th, feat.title_en, feat.description_th, feat.description_en, feat.sort_order || 0]
        );
      }
      updated.features = data.features;
    }

    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    const pool = await this.getClient();
    const res = await pool.query("DELETE FROM projects WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // --- SERVICES ---
  async getServices(activeOnly: boolean = false): Promise<Service[]> {
    const pool = await this.getClient();
    let query = "SELECT * FROM services";
    const values: any[] = [];
    if (activeOnly) {
      values.push(true);
      query += " WHERE is_active = $1";
    }
    query += " ORDER BY sort_order ASC, created_at ASC";
    const res = await pool.query(query, values);
    return res.rows.map(this.mapServiceRow);
  }

  async getServiceById(id: string): Promise<Service | undefined> {
    const pool = await this.getClient();
    const res = await pool.query("SELECT * FROM services WHERE id = $1 LIMIT 1", [id]);
    if (res.rows.length === 0) return undefined;
    return this.mapServiceRow(res.rows[0]);
  }

  async createService(data: Partial<Service>): Promise<Service> {
    const pool = await this.getClient();
    const id = "srv-" + Date.now();
    const now = new Date().toISOString();

    const newService: Service = {
      id,
      slug: data.slug || "service-" + Date.now(),
      title_th: data.title_th || "",
      title_en: data.title_en || "",
      description_th: data.description_th || "",
      description_en: data.description_en || "",
      icon: data.icon || "Globe",
      sort_order: Number(data.sort_order) || 1,
      is_active: data.is_active !== false,
      created_at: now,
      updated_at: now,
    };

    await pool.query(
      `INSERT INTO services (id, slug, title_th, title_en, description_th, description_en, icon, sort_order, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        newService.id,
        newService.slug,
        newService.title_th,
        newService.title_en,
        newService.description_th,
        newService.description_en,
        newService.icon,
        newService.sort_order,
        newService.is_active,
        newService.created_at,
        newService.updated_at,
      ]
    );

    return newService;
  }

  async updateService(id: string, data: Partial<Service>): Promise<Service | undefined> {
    const pool = await this.getClient();
    const existing = await this.getServiceById(id);
    if (!existing) return undefined;

    const updated: Service = {
      ...existing,
      ...data,
      updated_at: new Date().toISOString(),
    };

    await pool.query(
      `UPDATE services SET
        slug = $1, title_th = $2, title_en = $3,
        description_th = $4, description_en = $5,
        icon = $6, sort_order = $7, is_active = $8, updated_at = $9
       WHERE id = $10`,
      [
        updated.slug,
        updated.title_th,
        updated.title_en,
        updated.description_th,
        updated.description_en,
        updated.icon,
        updated.sort_order,
        updated.is_active,
        updated.updated_at,
        id,
      ]
    );

    return updated;
  }

  async deleteService(id: string): Promise<boolean> {
    const pool = await this.getClient();
    const res = await pool.query("DELETE FROM services WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // --- LEADS ---
  async getLeads(filter?: { status?: string; search?: string }): Promise<Lead[]> {
    const pool = await this.getClient();
    let query = "SELECT * FROM leads WHERE 1=1";
    const values: any[] = [];

    if (filter?.status && filter.status !== "ALL") {
      values.push(filter.status);
      query += ` AND status = $${values.length}`;
    }
    if (filter?.search) {
      values.push(`%${filter.search.toLowerCase()}%`);
      query += ` AND (LOWER(name) LIKE $${values.length} OR LOWER(email) LIKE $${values.length} OR LOWER(COALESCE(company, '')) LIKE $${values.length} OR LOWER(project_type) LIKE $${values.length})`;
    }

    query += " ORDER BY created_at DESC";
    const res = await pool.query(query, values);
    return res.rows.map(this.mapLeadRow);
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    const pool = await this.getClient();
    const res = await pool.query("SELECT * FROM leads WHERE id = $1 LIMIT 1", [id]);
    if (res.rows.length === 0) return undefined;
    return this.mapLeadRow(res.rows[0]);
  }

  async createLead(data: Omit<Lead, "id" | "created_at" | "updated_at">): Promise<Lead> {
    const pool = await this.getClient();
    const id = "lead-" + Date.now();
    const now = new Date().toISOString();

    const newLead: Lead = {
      ...data,
      id,
      status: data.status || "NEW",
      created_at: now,
      updated_at: now,
    };

    await pool.query(
      `INSERT INTO leads (id, name, email, phone, company, project_type, budget, message, status, internal_note, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        newLead.id,
        newLead.name,
        newLead.email,
        newLead.phone || "",
        newLead.company || "",
        newLead.project_type,
        newLead.budget,
        newLead.message,
        newLead.status,
        newLead.internal_note || null,
        newLead.created_at,
        newLead.updated_at,
      ]
    );

    return newLead;
  }

  async updateLeadStatus(id: string, status: LeadStatus, note?: string): Promise<Lead | undefined> {
    const pool = await this.getClient();
    const now = new Date().toISOString();

    let query = "UPDATE leads SET status = $1, updated_at = $2";
    const values: any[] = [status, now];

    if (note !== undefined) {
      values.push(note);
      query += `, internal_note = $${values.length}`;
    }

    values.push(id);
    query += ` WHERE id = $${values.length} RETURNING *`;

    const res = await pool.query(query, values);
    if (res.rows.length === 0) return undefined;
    return this.mapLeadRow(res.rows[0]);
  }

  async deleteLead(id: string): Promise<boolean> {
    const pool = await this.getClient();
    const res = await pool.query("DELETE FROM leads WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // --- ADMIN USERS ---
  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    const pool = await this.getClient();
    const res = await pool.query("SELECT * FROM admins WHERE LOWER(email) = LOWER($1) LIMIT 1", [email]);
    if (res.rows.length === 0) return undefined;
    return this.mapAdminRow(res.rows[0]);
  }

  async getAdminById(id: string): Promise<AdminUser | undefined> {
    const pool = await this.getClient();
    const res = await pool.query("SELECT * FROM admins WHERE id = $1 LIMIT 1", [id]);
    if (res.rows.length === 0) return undefined;
    return this.mapAdminRow(res.rows[0]);
  }

  async updateAdmin(
    id: string,
    data: { name?: string; email?: string; password_hash?: string }
  ): Promise<AdminUser | undefined> {
    const pool = await this.getClient();
    const existing = await this.getAdminById(id);
    if (!existing) return undefined;

    const now = new Date().toISOString();
    const name = data.name !== undefined ? data.name : existing.name;
    const email = data.email !== undefined ? data.email : existing.email;
    const passHash = data.password_hash !== undefined ? data.password_hash : existing.password_hash;

    const res = await pool.query(
      `UPDATE admins SET name = $1, email = $2, password_hash = $3, updated_at = $4
       WHERE id = $5 RETURNING *`,
      [name, email, passHash, now, id]
    );

    if (res.rows.length === 0) return undefined;
    return this.mapAdminRow(res.rows[0]);
  }

  // --- STATS ---
  async getAdminStats() {
    const pool = await this.getClient();
    const [leadsRes, projectsRes, viewsCountRes, uniqueCountRes] = await Promise.all([
      pool.query("SELECT created_at, status FROM leads"),
      pool.query("SELECT id, is_published FROM projects"),
      pool.query("SELECT COUNT(*) as count FROM page_views").catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT COUNT(DISTINCT visitor_id) as count FROM page_views").catch(() => ({ rows: [{ count: 0 }] })),
    ]);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const leads = leadsRes.rows;
    const projects = projectsRes.rows;

    const newLeadsCount = leads.filter((l) => l.status === "NEW").length;
    const activeProjectsCount = projects.length;
    const publishedWorksCount = projects.filter((p) => p.is_published).length;
    const thisMonthLeadsCount = leads.filter((l) => {
      const d = new Date(l.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    return {
      newLeads: newLeadsCount,
      activeProjects: activeProjectsCount,
      publishedWorks: publishedWorksCount,
      thisMonthLeads: thisMonthLeadsCount,
      totalLeads: leads.length,
      totalPageviews: parseInt(viewsCountRes.rows[0]?.count || "0", 10),
      uniqueVisitors: parseInt(uniqueCountRes.rows[0]?.count || "0", 10),
    };
  }

  // --- ANALYTICS / PAGEVIEWS ---
  async recordPageView(data: {
    path: string;
    locale: string;
    referrer?: string;
    device_type?: "desktop" | "mobile" | "tablet";
    visitor_id: string;
  }): Promise<void> {
    try {
      const pool = await this.getClient();
      const id = `pv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      await pool.query(
        `INSERT INTO page_views (id, path, locale, referrer, device_type, visitor_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [
          id,
          data.path,
          data.locale || "th",
          data.referrer || "",
          data.device_type || "desktop",
          data.visitor_id,
        ]
      );
    } catch (err: any) {
      console.error("[PostgreSQL] Error recording page view:", err.message);
    }
  }

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    const pool = await this.getClient();
    const [totalRes, uniqueRes, todayRes, weekRes, monthRes, devicesRes, topPagesRes, recentRes] = await Promise.all([
      pool.query("SELECT COUNT(*) as count FROM page_views").catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT COUNT(DISTINCT visitor_id) as count FROM page_views").catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT COUNT(*) as count FROM page_views WHERE created_at >= NOW() - INTERVAL '24 hours'").catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT COUNT(*) as count FROM page_views WHERE created_at >= NOW() - INTERVAL '7 days'").catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT COUNT(*) as count FROM page_views WHERE created_at >= NOW() - INTERVAL '30 days'").catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT device_type, COUNT(*) as count FROM page_views GROUP BY device_type").catch(() => ({ rows: [] })),
      pool.query("SELECT path, COUNT(*) as count FROM page_views GROUP BY path ORDER BY count DESC LIMIT 6").catch(() => ({ rows: [] })),
      pool.query("SELECT * FROM page_views ORDER BY created_at DESC LIMIT 10").catch(() => ({ rows: [] })),
    ]);

    const deviceStats = { desktop: 0, mobile: 0, tablet: 0 };
    devicesRes.rows.forEach((r: any) => {
      const type = (r.device_type || "desktop").toLowerCase() as keyof typeof deviceStats;
      if (deviceStats[type] !== undefined) {
        deviceStats[type] = parseInt(r.count, 10);
      }
    });

    return {
      totalPageviews: parseInt(totalRes.rows[0]?.count || "0", 10),
      uniqueVisitors: parseInt(uniqueRes.rows[0]?.count || "0", 10),
      todayPageviews: parseInt(todayRes.rows[0]?.count || "0", 10),
      thisWeekPageviews: parseInt(weekRes.rows[0]?.count || "0", 10),
      thisMonthPageviews: parseInt(monthRes.rows[0]?.count || "0", 10),
      deviceStats,
      topPages: topPagesRes.rows.map((r: any) => ({
        path: r.path,
        views: parseInt(r.count, 10),
      })),
      recentVisits: recentRes.rows.map((r: any) => ({
        id: r.id,
        path: r.path,
        locale: r.locale,
        referrer: r.referrer,
        device_type: r.device_type,
        visitor_id: r.visitor_id,
        created_at: new Date(r.created_at).toISOString(),
      })),
    };
  }

  // --- SITE SETTINGS ---
  async getSettings(): Promise<SiteSetting[]> {
    const pool = await this.getClient();
    const res = await pool.query("SELECT * FROM site_settings ORDER BY key ASC");
    return res.rows.map(this.mapSettingRow);
  }

  async updateSetting(key: string, value_th: string, value_en: string): Promise<SiteSetting> {
    const pool = await this.getClient();
    const now = new Date().toISOString();
    const id = "set-" + Date.now();

    const res = await pool.query(
      `INSERT INTO site_settings (id, key, value_th, value_en, updated_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (key) DO UPDATE
       SET value_th = EXCLUDED.value_th, value_en = EXCLUDED.value_en, updated_at = EXCLUDED.updated_at
       RETURNING *`,
      [id, key, value_th, value_en, now]
    );

    return this.mapSettingRow(res.rows[0]);
  }

  // --- Health Check ---
  async checkHealth(): Promise<{
    connected: boolean;
    mode: string;
    counts?: { admins: number; services: number; projects: number; leads: number };
    error?: string;
  }> {
    try {
      const pool = await this.getClient();
      const [adminC, servC, projC, leadC] = await Promise.all([
        pool.query("SELECT COUNT(*) FROM admins"),
        pool.query("SELECT COUNT(*) FROM services"),
        pool.query("SELECT COUNT(*) FROM projects"),
        pool.query("SELECT COUNT(*) FROM leads"),
      ]);

      return {
        connected: true,
        mode: "postgresql",
        counts: {
          admins: parseInt(adminC.rows[0].count, 10),
          services: parseInt(servC.rows[0].count, 10),
          projects: parseInt(projC.rows[0].count, 10),
          leads: parseInt(leadC.rows[0].count, 10),
        },
      };
    } catch (err: any) {
      return {
        connected: false,
        mode: "postgresql_failed",
        error: err.message,
      };
    }
  }

  // --- Helpers to map DB rows to TS interfaces ---
  private mapProjectRow(row: any): Project {
    return {
      id: row.id,
      slug: row.slug,
      title_th: row.title_th,
      title_en: row.title_en,
      short_description_th: row.short_description_th,
      short_description_en: row.short_description_en,
      description_th: row.description_th,
      description_en: row.description_en,
      category: row.category,
      cover_image: row.cover_image,
      client_name: row.client_name,
      project_year: row.project_year,
      technologies: Array.isArray(row.technologies) ? row.technologies : [],
      is_featured: !!row.is_featured,
      sort_order: Number(row.sort_order) || 0,
      is_published: !!row.is_published,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    };
  }

  private mapFeatureRow(row: any): ProjectFeature {
    return {
      id: row.id,
      project_id: row.project_id,
      title_th: row.title_th,
      title_en: row.title_en,
      description_th: row.description_th,
      description_en: row.description_en,
      sort_order: Number(row.sort_order) || 0,
    };
  }

  private mapServiceRow(row: any): Service {
    return {
      id: row.id,
      slug: row.slug,
      title_th: row.title_th,
      title_en: row.title_en,
      description_th: row.description_th,
      description_en: row.description_en,
      icon: row.icon,
      sort_order: Number(row.sort_order) || 0,
      is_active: !!row.is_active,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    };
  }

  private mapLeadRow(row: any): Lead {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || "",
      company: row.company || "",
      project_type: row.project_type,
      budget: row.budget,
      message: row.message,
      status: row.status,
      internal_note: row.internal_note || undefined,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    };
  }

  private mapAdminRow(row: any): AdminUser {
    return {
      id: row.id,
      email: row.email,
      password_hash: row.password_hash,
      name: row.name,
      role: row.role,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    };
  }

  private mapSettingRow(row: any): SiteSetting {
    return {
      id: row.id,
      key: row.key,
      value_th: row.value_th,
      value_en: row.value_en,
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    };
  }
}
