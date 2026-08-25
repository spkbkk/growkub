import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://helmetdev.com";
  const projects = db.getProjects({ publishedOnly: true });

  const routes: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    // Static pages
    const staticPages = ["", "/services", "/works", "/about", "/contact"];
    staticPages.forEach((page) => {
      routes.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : 0.8,
      });
    });

    // Dynamic case studies
    projects.forEach((proj) => {
      routes.push({
        url: `${baseUrl}/${locale}/works/${proj.slug}`,
        lastModified: new Date(proj.updated_at),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    });
  });

  return routes;
}
