import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  Smartphone,
  Layers,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Server,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? (params.locale as Locale) : "th";
  return {
    title: locale === "th" ? "บริการของเรา (Services)" : "Our Services",
    description:
      locale === "th"
        ? "บริการพัฒนา Web Application, Mobile App และ Business Management System โดยทีมงานมืออาชีพ"
        : "Tailored engineering services: Web Applications, Mobile Apps, and Enterprise Business Systems.",
  };
}

export default async function ServicesPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  const servicesDetail = [
    {
      number: "01",
      icon: Globe,
      title_th: "Web Application Development",
      title_en: "Web Application Development",
      description_th:
        "พัฒนาระบบเว็บแอปพลิเคชันที่รองรับการใช้งานระดับองค์กร ด้วยสถาปัตยกรรม Server-Side Rendering (SSR) และ Single Page Application (SPA) ที่โหลดได้รวดเร็ว ปลอดภัย และมี SEO ในตัว",
      description_en:
        "Engineered for high availability, low latency, and smooth user experiences. We leverage modern SSR and progressive web technologies to build enterprise-grade web platforms.",
      deliverables_th: [
        "สถาปัตยกรรม Next.js / React ประสิทธิภาพสูง",
        "ระบบจัดการข้อมูลและการเชื่อมต่อ REST / GraphQL API",
        "ระบบความปลอดภัย Authorization, JWT & CSRF Protection",
        "Responsive Pixel-Perfect UI สำหรับทุกขนาดหน้าจอ",
        "CI/CD Pipeline และการ Deploy บน Cloud (AWS, Vercel, Cloudflare)",
      ],
      deliverables_en: [
        "High-performance Next.js / React architecture",
        "Robust API design (REST / GraphQL / tRPC)",
        "Secure auth mechanisms with JWT, RBAC & CSRF safeguards",
        "Pixel-perfect responsive design across all devices",
        "Automated CI/CD deployment on AWS, Vercel & Cloudflare",
      ],
      techStack: ["Next.js", "TypeScript", "React", "Node.js", "Tailwind CSS", "PostgreSQL"],
    },
    {
      number: "02",
      icon: Smartphone,
      title_th: "Mobile App Development",
      title_en: "Mobile App Development",
      description_th:
        "สร้างโมบายแอปพลิเคชันสำหรับ iOS และ Android ที่มี UI สวยงามทันสมัย ตอบสนองรวดเร็ว และมีสถาปัตยกรรมแบบ Offline-first เพื่อให้ผู้ใช้ได้รับประสบการณ์ที่ดีที่สุดในทุกสถานการณ์",
      description_en:
        "Native-grade mobile applications built for iOS and Android with fluid gesture interactions, robust offline caching, and real-time push notifications.",
      deliverables_th: [
        "พัฒนาแบบ Cross-platform ด้วย React Native หรือ Flutter",
        "ระบบเชื่อมต่อ Push Notification (Firebase / APNs)",
        "การจัดเก็บข้อมูลแบบ Offline-First Cache",
        "ระบบชำระเงิน In-App Purchases และ Payment Gateways",
        "เตรียมการและส่งมอบขึ้น App Store และ Google Play Store",
      ],
      deliverables_en: [
        "Cross-platform development with Flutter or React Native",
        "Push notification integration via Firebase / APNs",
        "Offline-first local cache synchronization",
        "In-app payments & PromptPay gateway integrations",
        "Full store deployment on Apple App Store & Google Play",
      ],
      techStack: ["React Native", "Flutter", "TypeScript", "Firebase", "WebSockets"],
    },
    {
      number: "03",
      icon: Layers,
      title_th: "Business System & ERP",
      title_en: "Business System & ERP",
      description_th:
        "ระบบบริหารจัดการภายในองค์กร ระบบคลังสินค้า ระบบสั่งซื้ออัตโนมัติ และ Dashboard วิเคราะห์ข้อมูลที่ออกแบบเฉพาะตามขั้นตอนการทำงาน (Workflow) ของธุรกิจคุณเพื่อลดความซ้ำซ้อนและต้นทุน",
      description_en:
        "Custom-built enterprise software, back-office automation tools, ERPs, and real-time operational dashboards tailored directly to your business logic.",
      deliverables_th: [
        "ระบบจัดการสิทธิ์ผู้ใช้งานหลายระดับ (Role-Based Access Control)",
        "แดชบอร์ดสรุปสถิติและตัวชี้วัดธุรกิจแบบ Real-Time",
        "ระบบจัดการสินค้าคงคลัง สต็อก และใบสั่งซื้อ",
        "การส่งออกรายงานในรูปแบบ Excel, CSV และ PDF อัตโนมัติ",
        "การเชื่อมต่อกับระบบภายนอก (Lazada, Shopee, LINE OA, Payment)",
      ],
      deliverables_en: [
        "Granular Role-Based Access Control (RBAC)",
        "Real-time operational dashboards & telemetry",
        "Automated inventory, purchase order, and stock tracking",
        "Automated report generation in Excel, CSV, and PDF",
        "Third-party integrations (E-commerce, LINE OA, Banks)",
      ],
      techStack: ["PostgreSQL", "Node.js", "Python", "Docker", "Redis", "Next.js"],
    },
  ];

  return (
    <div className="w-full pt-12 pb-24 relative">
      <BackgroundGlow position="top" />

      <Container>
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-orange">
            // {dict.nav.services}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary">
            {locale === "th"
              ? "บริการวิศวกรรมซอฟต์แวร์ระดับพรีเมียม"
              : "Precision Software Engineering Services"}
          </h1>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {locale === "th"
              ? "เราส่งมอบผลงานด้วยเทคโนโลยีที่ทันสมัย สถาปัตยกรรมที่ยืดหยุ่น และการออกแบบที่มุ่งเน้นผลลัพธ์ทางธุรกิจเป็นหัวใจสำคัญ"
              : "We build reliable digital products with modern engineering principles, type-safe architecture, and clear business alignment."}
          </p>
        </div>

        {/* Services Detail List */}
        <div className="space-y-12">
          {servicesDetail.map((item) => {
            const title = locale === "th" ? item.title_th : item.title_en;
            const description =
              locale === "th" ? item.description_th : item.description_en;
            const deliverables =
              locale === "th" ? item.deliverables_th : item.deliverables_en;
            const Icon = item.icon;

            return (
              <Card
                key={item.number}
                className="p-8 md:p-12 bg-smoke-dark border-border relative overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left info */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-smoke border border-border flex items-center justify-center text-brand-orange">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-brand-orange">
                          SERVICE {item.number}
                        </span>
                        <h2 className="text-2xl font-bold text-text-primary">
                          {title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
                      {description}
                    </p>

                    {/* Tech tags */}
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-mono text-text-muted uppercase tracking-wider block">
                        Technologies:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {item.techStack.map((tech) => (
                          <Badge key={tech} variant="default" size="sm">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Deliverables with Emerald Checkmarks */}
                  <div className="lg:col-span-6 bg-smoke/60 rounded-xl p-6 sm:p-8 border border-border space-y-4">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {locale === "th"
                          ? "สิ่งที่เราส่งมอบ (Deliverables)"
                          : "Key Deliverables & Capabilities"}
                      </span>
                    </h3>

                    <ul className="space-y-3">
                      {deliverables.map((del, dIdx) => (
                        <li
                          key={dIdx}
                          className="flex items-start gap-2.5 text-sm text-text-primary"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 mt-4 border-t border-border">
                      <Button
                        href={`/${locale}/contact`}
                        size="sm"
                        variant="outline"
                        className="w-full justify-between group"
                      >
                        <span>
                          {locale === "th"
                            ? "ปรึกษาโปรเจกต์นี้"
                            : "Consult on this service"}
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16 text-center">
          <Card className="p-10 bg-smoke-dark border-border inline-block max-w-2xl w-full">
            <h3 className="text-2xl font-bold text-text-primary mb-3">
              {dict.ctaSection.headline}
            </h3>
            <p className="text-sm text-text-secondary mb-6 max-w-lg mx-auto">
              {dict.ctaSection.subtext}
            </p>
            <Button href={`/${locale}/contact`} size="lg" variant="primary">
              {dict.common.startProject}
            </Button>
          </Card>
        </div>
      </Container>
    </div>
  );
}
