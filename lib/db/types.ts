export type AdminRole = "admin" | "editor";

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: AdminRole;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  slug: string;
  title_th: string;
  title_en: string;
  description_th: string;
  description_en: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_th: string;
  alt_en: string;
  sort_order: number;
  created_at: string;
}

export interface ProjectFeature {
  id: string;
  project_id: string;
  title_th: string;
  title_en: string;
  description_th: string;
  description_en: string;
  sort_order: number;
}

export interface Project {
  id: string;
  slug: string;
  title_th: string;
  title_en: string;
  short_description_th: string;
  short_description_en: string;
  description_th: string;
  description_en: string;
  category: string;
  cover_image: string;
  client_name: string;
  project_year: string;
  technologies: string[];
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
  features?: ProjectFeature[];
}

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "DISCUSSION"
  | "QUOTATION"
  | "WON"
  | "LOST";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  project_type: string;
  budget: string;
  message: string;
  status: LeadStatus;
  internal_note?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value_th: string;
  value_en: string;
  updated_at: string;
}

export interface PageView {
  id: string;
  path: string;
  locale: string;
  referrer?: string;
  device_type?: "desktop" | "mobile" | "tablet";
  visitor_id: string;
  created_at: string;
}

export interface AnalyticsSummary {
  totalPageviews: number;
  uniqueVisitors: number;
  todayPageviews: number;
  thisWeekPageviews: number;
  thisMonthPageviews: number;
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  topPages: {
    path: string;
    views: number;
  }[];
  recentVisits: PageView[];
}

