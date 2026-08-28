import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const chatRequestSchema = z.object({
  message: z.string().min(1, "Message is required"),
  locale: z.enum(["th", "en"]).default("th"),
  contactInfo: z
    .object({
      name: z.string().min(1, "Name is required"),
      contact: z.string().min(1, "Phone, LINE ID or Email is required"),
      projectType: z.string().optional().default("Web Application"),
      budget: z.string().optional().default("To be discussed"),
      note: z.string().optional().default(""),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = chatRequestSchema.parse(body);
    const { message, locale, contactInfo } = validated;

    // 1. If user submitted contact / requirements via in-chat form
    if (contactInfo) {
      const email = contactInfo.contact.includes("@") ? contactInfo.contact.trim().toLowerCase() : "chat-lead@growkub.com";
      const phone = !contactInfo.contact.includes("@") ? contactInfo.contact.trim() : "";

      const lead = await db.createLead({
        name: contactInfo.name.trim(),
        email,
        phone,
        company: "Website Live Chat",
        project_type: contactInfo.projectType || "Live Chat",
        budget: contactInfo.budget || "To be discussed",
        message: `[รายละเอียดโปรเจกต์จาก Live Chat]\n• ประเภทโปรเจกต์: ${contactInfo.projectType}\n• งบประมาณโดยประมาณ: ${contactInfo.budget}\n• ความต้องการ / สเปกระบบ: ${contactInfo.note || "ไม่ได้ระบุ"}\n• ช่องทางติดต่อ: ${contactInfo.contact}`,
        status: "NEW",
      });

      const reply =
        locale === "th"
          ? `ขอบคุณมากครับคุณ ${contactInfo.name}! 🙏 ทีมงาน Senior Developer ได้รับรายละเอียดโปรเจกต์เรียบร้อยแล้ว (${contactInfo.projectType} - งบ ${contactInfo.budget}) จะติดต่อกลับทาง ${contactInfo.contact} ภายใน 24 ชม. ครับ`
          : `Thank you, ${contactInfo.name}! 🙏 Our engineering team has received your project requirements (${contactInfo.projectType} - ${contactInfo.budget}) and will reach out to you via ${contactInfo.contact} within 24 hours.`;

      return NextResponse.json({
        success: true,
        reply,
        savedLeadId: lead.id,
        quickReplies: [
          {
            label: locale === "th" ? "💬 แชทตรง Messenger" : "💬 Open Messenger",
            text: "เปิด Messenger",
            action: "link",
            url: `https://m.me/${process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || "growkub"}`,
          },
          {
            label: locale === "th" ? "📂 ดูผลงานที่ผ่านมา" : "📂 View Works",
            text: "ดูผลงาน",
            action: "link",
            url: `/${locale}/works`,
          },
        ],
      });
    }

    // 2. Intelligent, Exact & Context-Specific Intent Matching
    const normalized = message.toLowerCase().trim();

    // Specific: Warehouse & Inventory Stock
    if (
      normalized.includes("คลัง") ||
      normalized.includes("สต็อก") ||
      normalized.includes("stock") ||
      normalized.includes("inventory") ||
      normalized.includes("warehouse") ||
      normalized.includes("barcode")
    ) {
      return NextResponse.json({
        success: true,
        reply:
          locale === "th"
            ? "📦 ระบบคลังสินค้าและสต็อก (Warehouse & Stock Management):\n\n• จัดการสต็อก Real-Time ตัดสต็อกแม่นยำ 100%\n• สแกน Barcode & QR Code ผ่านสมาร์ทโฟนหรือเครื่องยิงหน้างาน\n• แจ้งเตือนสินค้าใกล้หมด (Low Stock Alert) เข้า LINE\n• ระบบโอนย้ายสต็อกข้ามสาขา (Multi-Warehouse)\n• ออกใบเสร็จ ใบส่งของ ใบกำกับภาษีอัตโนมัติในคลิกเดียว"
            : "📦 Smart Warehouse & Inventory Management:\n\n• 100% Real-time stock tracking with atomic concurrency\n• Mobile Barcode / QR Code handheld scanning\n• Low-stock auto alerts via LINE / Email\n• Multi-branch / Multi-warehouse transfers\n• One-click compliant invoicing, waybills, and packing slips.",
        quickReplies: [
          {
            label: locale === "th" ? "⚡ ขอใบเสนอราคาระบบคลัง" : "⚡ Quote Warehouse System",
            text: "ขอประเมินราคาระบบคลังสินค้าและสต็อก",
            action: "form",
          },
          {
            label: locale === "th" ? "📱 ทำแอปสแกนบาร์โค้ดบนมือถือ" : "📱 Mobile Barcode Scanner App",
            text: "สนใจทำแอปสแกนบาร์โค้ดสำหรับพนักงานคลังครับ",
            action: "chat",
          },
          {
            label: locale === "th" ? "💬 คุยกับ Senior Developer" : "💬 Chat on Messenger",
            text: "คุยบน Messenger",
            action: "link",
            url: `https://m.me/${process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || "growkub"}`,
          },
        ],
      });
    }

    // Specific: Real-time Dashboard & Analytics
    if (
      normalized.includes("dashboard") ||
      normalized.includes("แดชบอร์ด") ||
      normalized.includes("สถิติ") ||
      normalized.includes("รายงาน") ||
      normalized.includes("analytics") ||
      normalized.includes("kpi")
    ) {
      return NextResponse.json({
        success: true,
        reply:
          locale === "th"
            ? "📊 ระบบ Real-time Dashboard & สรุปสถิติธุรกิจ:\n\n• แดชบอร์ดสรุปยอดขาย รายได้ และตัวชี้วัดธุรกิจ (KPIs) แบบ Real-time\n• กราฟเปรียบเทียบข้อมูลย้อนหลัง รายวัน รายเดือน รายปี\n• ส่งออกรายงานอัตโนมัติเป็น Excel, CSV และ PDF\n• สรุปยอดขายประจำวันส่งเข้า LINE กลุ่มผู้บริหารอัตโนมัติ\n• รองรับการเชื่อมต่อข้อมูลกับระบบเดิม (Database / REST API)"
            : "📊 Business Analytics & Real-Time Dashboard:\n\n• Live telemetry monitoring revenue, orders, and core KPIs\n• Interactive historical comparative charts & forecasting\n• Automated report generation in Excel, CSV, and PDF\n• Daily automated executive summaries via LINE / Email\n• Secure data integrations with your existing databases & APIs.",
        quickReplies: [
          {
            label: locale === "th" ? "⚡ ขอใบเสนอราคา Dashboard" : "⚡ Quote Dashboard",
            text: "ขอใบเสนอราคาระบบ Dashboard และรายงานสถิติ",
            action: "form",
          },
          {
            label: locale === "th" ? "🔗 เชื่อมต่อกับระบบเดิมที่มีอยู่" : "🔗 Integrate with Existing DB",
            text: "ต้องการเชื่อมต่อ Dashboard กับฐานข้อมูลเดิมที่มีอยู่ครับ",
            action: "chat",
          },
          {
            label: locale === "th" ? "💬 ปรึกษา Developer ตรง" : "💬 Consult Developer",
            text: "คุยบน Messenger",
            action: "link",
            url: `https://m.me/${process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || "growkub"}`,
          },
        ],
      });
    }

    // Specific: E-Commerce / Live Commerce / Shopping Platform
    if (
      normalized.includes("commerce") ||
      normalized.includes("ขายของ") ||
      normalized.includes("ร้านค้า") ||
      normalized.includes("ตะกร้า") ||
      normalized.includes("payment") ||
      normalized.includes("บัตรเครดิต") ||
      normalized.includes("พร้อมเพย์") ||
      normalized.includes("flash sale")
    ) {
      return NextResponse.json({
        success: true,
        reply:
          locale === "th"
            ? "🛒 ระบบ Web Commerce & Live Shopping Platform:\n\n• สถาปัตยกรรม SSR โหลดสินค้าไวระดับเสี้ยววินาที รองรับ SEO 100%\n• ระบบชำระเงินอัตโนมัติ (บัตรเครดิต, PromptPay QR, Mobile Banking)\n• ระบบ Flash Sale รองรับคนสั่งซื้อพร้อมกันหลักพันคนโดยสต็อกไม่เบิ้ล\n• คำนวณค่าจัดส่งอัตโนมัติตามระยะทาง/น้ำหนัก และเชื่อมต่อ Flash/Kerry/EMS\n• แผงควบคุมหลังบ้านจัดการสินค้า ออเดอร์ และลูกค้าครบวงจร"
            : "🛒 High-Performance Web Commerce & Live Shopping:\n\n• Sub-second SSR loading speeds with 100% SEO optimization\n• Multi-gateway payment processing (Cards, PromptPay QR, Banking)\n• High-concurrency flash sale engine with zero overselling\n• Automated courier integrations (Flash, Kerry, EMS tracking)\n• Comprehensive back-office for products, orders, and customers.",
        quickReplies: [
          {
            label: locale === "th" ? "⚡ ขอใบเสนอราคา Web Commerce" : "⚡ Quote Web Commerce",
            text: "ขอใบเสนอราคาทำระบบ Web Commerce",
            action: "form",
          },
          {
            label: locale === "th" ? "💳 สอบถามเรื่องระบบชำระเงิน" : "💳 Payment Gateways",
            text: "สอบถามเรื่องการเชื่อมต่อระบบชำระเงินและบัตรเครดิตครับ",
            action: "chat",
          },
        ],
      });
    }

    // Specific: Corporate Website / Enterprise Portal
    if (
      normalized.includes("เว็บองค์กร") ||
      normalized.includes("portal") ||
      normalized.includes("บริษัท") ||
      normalized.includes("corporate") ||
      normalized.includes("intranet")
    ) {
      return NextResponse.json({
        success: true,
        reply:
          locale === "th"
            ? "🏢 เว็บไซต์องค์กร & Enterprise Portal:\n\n• ออกแบบ UI/UX ระดับพรีเมียม เสริมภาพลักษณ์แบรนด์ให้ดูน่าเชื่อถือ\n• ระบบจัดการเนื้อหา (CMS) อัปเดตข่าวสาร/บทความ/บริการได้ง่ายดาย\n• สถาปัตยกรรม Next.js โหลดเร็ว 100 คะแนน PageSpeed Insights\n• ระบบความปลอดภัยและการจัดการสิทธิ์ผู้ใช้งานหลายระดับ (RBAC)\n• รองรับหลายภาษา (Multi-Language TH/EN) พร้อมติดตั้ง SEO ครบชุด"
            : "🏢 Corporate Websites & Enterprise Portals:\n\n• Premium modern aesthetics engineered to elevate brand authority\n• Intuitive CMS for seamless news, services, and content updates\n• Next.js architecture achieving top PageSpeed performance\n• Enterprise security with granular Role-Based Access Control\n• Multi-language support with comprehensive Schema.org SEO.",
        quickReplies: [
          {
            label: locale === "th" ? "⚡ ขอใบเสนอราคาเว็บองค์กร" : "⚡ Quote Corporate Web",
            text: "ขอใบเสนอราคาทำเว็บไซต์องค์กร / Portal",
            action: "form",
          },
          {
            label: locale === "th" ? "📂 ดูผลงานเว็บที่ผ่านมา" : "📂 View Portfolio",
            text: "ดูผลงาน",
            action: "link",
            url: `/${locale}/works`,
          },
        ],
      });
    }

    // Specific: Consumer Mobile App (B2C)
    if (
      normalized.includes("ลูกค้า") ||
      normalized.includes("consumer") ||
      normalized.includes("b2c")
    ) {
      return NextResponse.json({
        success: true,
        reply:
          locale === "th"
            ? "📱 Mobile App สำหรับลูกค้าทั่วไป (Consumer App):\n\n• พัฒนาลงทั้ง iOS (App Store) และ Android (Google Play)\n• ดีไซน์ทันสมัย ใช้งานง่าย ลื่นไหลทุกทัชสกรีน\n• ระบบล็อกอินด้วยเบอร์โทร (OTP) / LINE / Google / Apple ID\n• ระบบส่งแจ้งเตือนโปรโมชั่นและข่าวสาร (Push Notification)\n• ระบบสะสมแต้ม คูปองส่วนลด และกระเป๋าเงินดิจิทัล"
            : "📱 Consumer Mobile Applications (iOS & Android):\n\n• Native-grade performance on Apple App Store & Google Play\n• Fluid gesture interactions and intuitive consumer UX\n• Social & Phone OTP Login (LINE, Google, Apple ID)\n• Automated Push Notifications for marketing and order updates\n• In-app loyalty points, coupon discounts, and payments.",
        quickReplies: [
          {
            label: locale === "th" ? "⚡ ขอใบเสนอราคา Customer App" : "⚡ Quote Customer App",
            text: "ขอใบเสนอราคาสร้าง Mobile App สำหรับลูกค้า",
            action: "form",
          },
          {
            label: locale === "th" ? "💬 ปรึกษาฟังก์ชันแอป" : "💬 Chat on Messenger",
            text: "คุยบน Messenger",
            action: "link",
            url: `https://m.me/${process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || "growkub"}`,
          },
        ],
      });
    }

    // Specific: Staff / Field / Driver Mobile App
    if (
      normalized.includes("พนักงาน") ||
      normalized.includes("หน้างาน") ||
      normalized.includes("field") ||
      normalized.includes("driver") ||
      normalized.includes("ไรเดอร์") ||
      normalized.includes("ขนส่ง")
    ) {
      return NextResponse.json({
        success: true,
        reply:
          locale === "th"
            ? "👷 Mobile App สำหรับพนักงานและหน้างาน (Field/Staff App):\n\n• สถาปัตยกรรม Offline-First ทำงานได้แม้ในจุดที่ไม่มีสัญญาณอินเทอร์เน็ต\n• ระบบสแกนบาร์โค้ด/QR Code รวดเร็วผ่านกล้องมือถือ\n• บันทึกพิกัด GPS หน้างานและแผนที่เส้นทางการเดินทาง\n• ถ่ายรูป แนบหลักฐานการส่งของ และเซ็นชื่อดิจิทัลบนหน้าจอ\n• ซิงค์ข้อมูลกลับสู่ฐานข้อมูลกลางอัตโนมัติทันทีที่ต่อเน็ต"
            : "👷 Staff & Field Operations Mobile App:\n\n• Offline-First architecture ensuring seamless work in low-signal zones\n• High-speed camera Barcode / QR Code scanning\n• GPS check-in and dynamic delivery route tracking\n• Photo attachments, proof-of-delivery, and digital e-signatures\n• Automatic background sync to central database upon reconnect.",
        quickReplies: [
          {
            label: locale === "th" ? "⚡ ขอใบเสนอราคาแอปพนักงาน" : "⚡ Quote Staff App",
            text: "ขอใบเสนอราคาสร้าง Mobile App สำหรับพนักงานหน้างาน",
            action: "form",
          },
          {
            label: locale === "th" ? "📍 ปรึกษาฟังก์ชัน GPS/Barcode" : "📍 GPS & Barcode Scope",
            text: "ต้องการปรึกษาฟังก์ชัน GPS และสแกนบาร์โค้ดสำหรับพนักงานครับ",
            action: "chat",
          },
        ],
      });
    }

    // Intent: Leave contact info / Quote request
    if (
      normalized.includes("ราคา") ||
      normalized.includes("งบ") ||
      normalized.includes("ใบเสนอราคา") ||
      normalized.includes("price") ||
      normalized.includes("quote") ||
      normalized.includes("cost") ||
      normalized.includes("estimate") ||
      normalized.includes("แพงไหม")
    ) {
      return NextResponse.json({
        success: true,
        reply:
          locale === "th"
            ? "⚡ การประเมินราคาและใบเสนอราคา:\n\nราคาโปรเจกต์ขึ้นอยู่กับสโคปและฟังก์ชันที่ต้องการครับ ทีมงาน Growkub พัฒนาด้วย Clean Code ระดับพรีเมียม พร้อมส่งมอบ Source Code และรับประกันระบบ 100%\n\n👇 สามารถกรอกข้อมูลสเปกที่ต้องการและงบประมาณในแบบฟอร์มด้านล่างได้ทันทีครับ"
            : "⚡ Project Pricing & Quotations:\n\nPricing is tailored directly to your system scope and technical complexity. We deliver type-safe, enterprise-grade software with complete source code ownership.\n\n👇 Please fill in your requirements and estimated budget below for a prompt quotation.",
        showLeadForm: true,
        quickReplies: [
          {
            label: locale === "th" ? "📝 กรอกฟอร์มขอใบเสนอราคา" : "📝 Open Quote Form",
            text: "ขอใบเสนอราคา / ประเมินงบ",
            action: "form",
          },
          {
            label: locale === "th" ? "💬 แชทคุยใน Messenger" : "💬 Chat on Messenger",
            text: "คุยบน Messenger",
            action: "link",
            url: `https://m.me/${process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || "growkub"}`,
          },
        ],
      });
    }

    // General: Web Application
    if (
      normalized.includes("web") ||
      normalized.includes("เว็บ") ||
      normalized.includes("react") ||
      normalized.includes("next") ||
      normalized.includes("frontend") ||
      normalized.includes("backend")
    ) {
      return NextResponse.json({
        success: true,
        reply:
          locale === "th"
            ? "💻 บริการพัฒนา Web Application:\n\nเราสร้างเว็บแอปพลิเคชันที่รองรับการใช้งานจริงด้วย Next.js, React, Node.js และ PostgreSQL โหลดเร็ว ปลอดภัย และมี SEO ในตัว มีระบบประเภทใดที่ต้องการพัฒนาเป็นพิเศษไหมครับ?"
            : "💻 Web Application Development Services:\n\nWe build scalable web platforms with Next.js, React, Node.js, and PostgreSQL. Fast, secure, and SEO-ready. Which type of web platform are you planning?",
        quickReplies: [
          {
            label: locale === "th" ? "🛒 Web Commerce / ระบบขาย" : "🛒 E-Commerce Platform",
            text: "สนใจทำระบบ Web Commerce ครับ",
            action: "chat",
          },
          {
            label: locale === "th" ? "🏢 Web องค์กร & Portal" : "🏢 Corporate Portal",
            text: "สนใจทำเว็บองค์กร / ระบบ Portal ครับ",
            action: "chat",
          },
          {
            label: locale === "th" ? "⚡ ขอใบเสนอราคา Web App" : "⚡ Quote Web App",
            text: "ขอประเมินราคาทำ Web App",
            action: "form",
          },
        ],
      });
    }

    // General: Mobile App
    if (
      normalized.includes("mobile") ||
      normalized.includes("app") ||
      normalized.includes("ios") ||
      normalized.includes("android") ||
      normalized.includes("flutter") ||
      normalized.includes("react native") ||
      normalized.includes("แอป") ||
      normalized.includes("มือถือ")
    ) {
      return NextResponse.json({
        success: true,
        reply:
          locale === "th"
            ? "📱 บริการพัฒนา Mobile App (iOS / Android):\n\nเราสร้างแอปพลิเคชันมือถือแบบ Cross-Platform (React Native / Flutter) และ Native ประสิทธิภาพสูง รองรับระบบ Push Notification, ระบบชำระเงิน และพร้อมดูแลการขึ้น Store ให้ครบวงจรครับ"
            : "📱 Mobile App Development (iOS / Android):\n\nWe build high-performance mobile apps using React Native and Flutter, with push notifications, payment gateways, and full App Store deployment support.",
        quickReplies: [
          {
            label: locale === "th" ? "📱 แอปสำหรับลูกค้า (Consumer)" : "📱 Customer App",
            text: "สนใจทำแอปสำหรับลูกค้าทั่วไปครับ",
            action: "chat",
          },
          {
            label: locale === "th" ? "👷 แอปพนักงาน / หน้างาน" : "👷 Staff / Field App",
            text: "สนใจทำแอปสำหรับพนักงานหน้างานครับ",
            action: "chat",
          },
          {
            label: locale === "th" ? "⚡ ประเมินงบทำแอป" : "⚡ Quote Mobile App",
            text: "ขอประเมินราคาสร้าง Mobile App",
            action: "form",
          },
        ],
      });
    }

    // General: ERP / Business Management
    if (
      normalized.includes("erp") ||
      normalized.includes("ระบบธุรกิจ") ||
      normalized.includes("จัดการ") ||
      normalized.includes("pos")
    ) {
      return NextResponse.json({
        success: true,
        reply:
          locale === "th"
            ? "🏢 บริการพัฒนาระบบ Business Management & ERP:\n\nเราออกแบบระบบให้เข้ากับขั้นตอนการทำงานจริงของธุรกิจคุณ เช่น จัดการสต็อกสินค้าคงคลัง, จัดการคำสั่งซื้อ, สิทธิ์ผู้ใช้งานหลายระดับ (RBAC), และ Dashboard สรุปสถิติแบบ Real-Time ครับ"
            : "🏢 Custom Business Systems & ERP:\n\nWe engineer custom software aligned with your workflows: inventory management, purchase orders, RBAC permissions, and real-time operational dashboards.",
        quickReplies: [
          {
            label: locale === "th" ? "📦 ระบบคลังสินค้า & สต็อก" : "📦 Warehouse & Stock",
            text: "สนใจระบบคลังสินค้าและสต็อกครับ",
            action: "chat",
          },
          {
            label: locale === "th" ? "📊 Dashboard วิเคราะห์ข้อมูล" : "📊 Real-Time Dashboard",
            text: "สนใจระบบ Dashboard รายงานสถิติครับ",
            action: "chat",
          },
          {
            label: locale === "th" ? "⚡ ปรึกษาสเปกระบบ ERP" : "⚡ Consult ERP Scope",
            text: "ขอปรึกษาสเปกระบบธุรกิจ",
            action: "form",
          },
        ],
      });
    }

    // Intent: Timeline / ระยะเวลา
    if (
      normalized.includes("เวลา") ||
      normalized.includes("นานไหม") ||
      normalized.includes("กี่วัน") ||
      normalized.includes("กี่เดือน") ||
      normalized.includes("timeline") ||
      normalized.includes("duration")
    ) {
      return NextResponse.json({
        success: true,
        reply:
          locale === "th"
            ? "⏱️ ระยะเวลาในการพัฒนา:\n\n• Web Application ทั่วไป: ประมาณ 2 - 4 สัปดาห์\n• Mobile App / ระบบสั่งซื้อ: ประมาณ 4 - 8 สัปดาห์\n• ระบบ ERP / ระบบองค์กรขนาดใหญ่: ประมาณ 6 - 12 สัปดาห์\n\nเรามีการอัปเดตงานทุกสัปดาห์ (Sprint Review) ให้ลูกค้าได้ทดสอบระบบจริงอย่างต่อเนื่องครับ"
            : "⏱️ Delivery Timelines:\n\n• Web Applications: ~2 - 4 weeks\n• Mobile Apps / Platforms: ~4 - 8 weeks\n• Enterprise ERP Systems: ~6 - 12 weeks\n\nWe provide weekly sprint demos so you can test features as they are built.",
        quickReplies: [
          {
            label: locale === "th" ? "⚡ ประเมินเวลาโปรเจกต์ของฉัน" : "⚡ Estimate My Timeline",
            text: "ช่วยประเมินเวลาสำหรับโปรเจกต์ของผมหน่อยครับ",
            action: "form",
          },
        ],
      });
    }

    // Intent: Contact / Office info
    if (
      normalized.includes("ติดต่อ") ||
      normalized.includes("เบอร์") ||
      normalized.includes("โทร") ||
      normalized.includes("contact") ||
      normalized.includes("phone") ||
      normalized.includes("email") ||
      normalized.includes("ที่อยู่") ||
      normalized.includes("ออฟฟิศ")
    ) {
      return NextResponse.json({
        success: true,
        reply:
          locale === "th"
            ? "📞 ช่องทางติดต่อ Growkub:\n\n• 💬 Facebook Messenger: แชทคุยกับ Senior Developer ได้โดยตรง\n• ✉️ Email: contact@growkub.com\n• 📍 สำนักงาน: กรุงเทพมหานคร (บริการออนไลน์ & นัดประชุม Discovery Call ทั่วประเทศ)"
            : "📞 Contact Growkub:\n\n• 💬 Facebook Messenger: Chat directly with our engineering team\n• ✉️ Email: contact@growkub.com\n• 📍 Location: Bangkok, Thailand (Online & In-person discovery calls)",
        quickReplies: [
          {
            label: locale === "th" ? "💬 คุยบน Messenger ทันที" : "💬 Chat on Messenger",
            text: "เปิด Messenger",
            action: "link",
            url: `https://m.me/${process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || "growkub"}`,
          },
          {
            label: locale === "th" ? "📝 ฝากเบอร์ให้โทรกลับ" : "📝 Request Callback",
            text: "ขอใบเสนอราคา / ประเมินงบ",
            action: "form",
          },
        ],
      });
    }

    // Default Fallback
    return NextResponse.json({
      success: true,
      reply:
        locale === "th"
          ? "สวัสดีครับ! ผมคือ Growkub Assistant 🚀 พร้อมให้ข้อมูลและช่วยประเมินการพัฒนาระบบ Web Application, Mobile App และระบบจัดการธุรกิจ ERP ครับ สนใจสอบถามหัวข้อใดเป็นพิเศษไหมครับ?"
          : "Hello! I am Growkub Assistant 🚀 I can help you with Web Applications, Mobile Apps, and Custom ERP Systems. How can we assist your business today?",
      quickReplies: [
        {
          label: locale === "th" ? "💻 พัฒนา Web Application" : "💻 Web App Development",
          text: "สนใจพัฒนา Web Application ครับ",
          action: "chat",
        },
        {
          label: locale === "th" ? "📱 พัฒนา Mobile App" : "📱 Mobile App Development",
          text: "สนใจสร้าง Mobile App ครับ",
          action: "chat",
        },
        {
          label: locale === "th" ? "🏢 ระบบคลัง & ERP" : "🏢 Warehouse & ERP",
          text: "สนใจระบบคลังสินค้าและสต็อกครับ",
          action: "chat",
        },
        {
          label: locale === "th" ? "📊 ระบบ Dashboard สถิติ" : "📊 Analytics Dashboard",
          text: "สนใจระบบ Dashboard รายงานสถิติครับ",
          action: "chat",
        },
        {
          label: locale === "th" ? "⚡ ขอใบเสนอราคาด่วน" : "⚡ Instant Quotation",
          text: "ขอใบเสนอราคา / ประเมินงบ",
          action: "form",
        },
      ],
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        success: false,
        reply: "ขออภัยครับ เกิดข้อผิดพลาดชั่วคราว กรุณาลองใหม่อีกครั้ง หรือทักแชททาง Facebook Messenger ได้โดยตรงครับ",
      },
      { status: 500 }
    );
  }
}
