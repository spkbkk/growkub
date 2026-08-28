"use client";

import React from "react";

// ============================================================
// Organization Schema
// ============================================================
interface OrganizationJsonLdProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  email?: string;
  sameAs?: string[];
  address?: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    addressCountry: string;
  };
}

export function OrganizationJsonLd({
  name,
  url,
  logo,
  description,
  email,
  sameAs,
  address,
}: OrganizationJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    ...(email && { email }),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        ...address,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ============================================================
// WebSite Schema (for sitelinks searchbox)
// ============================================================
interface WebSiteJsonLdProps {
  name: string;
  url: string;
  description: string;
  inLanguage?: string[];
}

export function WebSiteJsonLd({
  name,
  url,
  description,
  inLanguage,
}: WebSiteJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    ...(inLanguage && { inLanguage }),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/th/works?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ============================================================
// BreadcrumbList Schema
// ============================================================
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ============================================================
// Service Schema
// ============================================================
interface ServiceJsonLdProps {
  name: string;
  description: string;
  provider: {
    name: string;
    url: string;
  };
  url: string;
  serviceType?: string;
  areaServed?: string;
}

export function ServiceJsonLd({
  name,
  description,
  provider,
  url,
  serviceType,
  areaServed,
}: ServiceJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: provider.name,
      url: provider.url,
    },
    ...(serviceType && { serviceType }),
    ...(areaServed && { areaServed }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ============================================================
// SoftwareApplication / CreativeWork for Case Studies
// ============================================================
interface CaseStudyJsonLdProps {
  name: string;
  description: string;
  url: string;
  image: string;
  datePublished?: string;
  dateModified?: string;
  author: {
    name: string;
    url: string;
  };
  technologies?: string[];
  clientName?: string;
}

export function CaseStudyJsonLd({
  name,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
  technologies,
  clientName,
}: CaseStudyJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url,
    image,
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    author: {
      "@type": "Organization",
      name: author.name,
      url: author.url,
    },
    ...(clientName && {
      about: {
        "@type": "Organization",
        name: clientName,
      },
    }),
    ...(technologies &&
      technologies.length > 0 && {
        keywords: technologies.join(", "),
      }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ============================================================
// ProfessionalService Schema (for the About page)
// ============================================================
interface ProfessionalServiceJsonLdProps {
  name: string;
  url: string;
  description: string;
  logo: string;
  priceRange?: string;
  address: {
    addressLocality: string;
    addressCountry: string;
  };
  telephone?: string;
  email?: string;
}

export function ProfessionalServiceJsonLd({
  name,
  url,
  description,
  logo,
  priceRange,
  address,
  telephone,
  email,
}: ProfessionalServiceJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name,
    url,
    description,
    logo,
    ...(priceRange && { priceRange }),
    address: {
      "@type": "PostalAddress",
      addressLocality: address.addressLocality,
      addressCountry: address.addressCountry,
    },
    ...(telephone && { telephone }),
    ...(email && { email }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
