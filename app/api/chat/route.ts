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

interface ChatResponse {
  reply: string;
  quickReplies?: Array<{ label: string; text: string; action?: "link" | "form" | "chat"; url?: string }>;
  showLeadForm?: boolean;
  savedLeadId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = chatRequestSchema.parse(body);
    const { message, locale, contactInfo } = validated;

    // 1. If user submitted contact information via in-chat form
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
          ? `ขอบคุณมากครับคุณ ${contactInfo.name}! 🙏 ทีมงาน Senior Developer ได้รับข้อมูลติดต่อเรียบร้อยแล้ว (${contactInfo.contact}) จะติดต่อกลับเพื่อประเมินราคาและสเปกระบบภายใน 24 ชม. ครับ`
          : `Thank you, ${contactInfo.name}! 🙏 Our engineering team has received your contact details (${contactInfo.contact}) and will reach out to you within 24 hours.`;

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

    // 2. Intelligent Rule-Based Intent Classification
    const normalized = message.toLowerCase().trim();

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
            ? "ราคาของโปรเจกต์จะประเมินตามสโคปและฟังก์ชันที่ต้องการครับ ทีมงาน Growkub พัฒนาด้วย Clean Code สถาปัตยกรรม SSR คุณภาพสูง ไม่มีค่าธรรมเนียมแอบแฝง สามารถกรอกข้อมูลสั้นๆ ด้านล่างเพื่อให้ทีมงานจัดส่งใบประเมินราคาได้ทันทีครับ"
            : "Project pricing is tailored based on scope and technical requirements. We build with type-safe, high-performance architecture with no hidden fees. You can leave your contact info below for a detailed quote.",
        showLeadForm: true,
        quickReplies: [
          {
            label: locale === "th" ? "⚡ ฝากข้อมูลให้ประเมินราคา" : "⚡ Request Quote Form",
            text: "ขอใบเสนอราคา",
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

    // Intent: Web Application / Website
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
            ? "เราเชี่ยวชาญด้านการพัฒนา Web Application ระดับพรีเมียมด้วย Next.js, TypeScript, Node.js และ PostgreSQL รองรับ SEO สูงสุด, โหลดรวดเร็วระดับเสี้ยววินาที, และมีระบบความปลอดภัยมาตรฐานสากลครับ ต้องการพัฒนาเว็บประเภทไหนเป็นพิเศษไหมครับ?"
            : "We engineer enterprise-grade Web Applications with Next.js, TypeScript, Node.js, and PostgreSQL. Engineered for sub-second speeds, top-tier SEO, and robust security. What type of web platform are you planning?",
        quickReplies: [
          {
            label: locale === "th" ? "🛒 Web Commerce / ระบบขาย" : "🛒 E-Commerce / Sales",
            text: "สนใจทำระบบ Web Commerce ครับ",
            action: "chat",
          },
          {
            label: locale === "th" ? "🏢 Web องค์กร & Portal" : "🏢 Enterprise Portal",
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

    // Intent: Mobile App (iOS / Android)
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
            ? "สำหรับ Mobile App เราพัฒนาทั้งระบบ iOS และ Android ด้วย React Native หรือ Flutter รองรับ Push Notifications, ระบบชำระเงิน, Offline-First Sync และดูแลการส่งขึ้น App Store / Google Play ให้ครบวงจรครับ"
            : "We develop native-grade mobile applications for iOS & Android using React Native and Flutter. Includes push notifications, payment gateways, offline-first sync, and complete App Store / Google Play publishing.",
        quickReplies: [
          {
            label: locale === "th" ? "📱 แอปสำหรับลูกค้า (Consumer)" : "📱 Customer App",
            text: "สนใจทำแอปสำหรับลูกค้าทั่วไปครับ",
            action: "chat",
          },
          {
            label: locale === "th" ? "👷 แอปพนักงาน / ภายในองค์กร" : "👷 Staff / Field App",
            text: "สนใจทำแอปสำหรับพนักงาน/หน้างานครับ",
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

    // Intent: ERP / Business Management / Dashboard
    if (
      normalized.includes("erp") ||
      normalized.includes("ระบบธุรกิจ") ||
      normalized.includes("คลัง") ||
      normalized.includes("stock") ||
      normalized.includes("inventory") ||
      normalized.includes("dashboard") ||
      normalized.includes("จัดการ") ||
      normalized.includes("pos")
    ) {
      return NextResponse.json({
        success: true,
        reply:
          locale === "th"
            ? "เราออกแบบและพัฒนาระบบ Business Management, ERP, และ Dashboard ตาม Workflow เฉพาะของธุรกิจคุณ เช่น จัดการสต็อกสินค้าคงคลัง, ระบบสิทธิ์ RBAC, ออกบิล/ใบเสร็จอัตโนมัติ, และเชื่อมต่อ LINE OA / ธนาคารครับ"
            : "We design and build custom Business ERPs and real-time Telemetry Dashboards tailored to your exact business workflows, including inventory control, granular RBAC permissions, and automated report exports.",
        quickReplies: [
          {
            label: locale === "th" ? "📦 ระบบคลังสินค้า & สต็อก" : "📦 Warehouse & Stock",
            text: "สนใจระบบคลังสินค้าและสต็อกครับ",
            action: "chat",
          },
          {
            label: locale === "th" ? "📊 Dashboard วิเคราะห์ข้อมูล" : "📊 Real-time Dashboard",
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
            ? "ระยะเวลาพัฒนาโดยเฉลี่ยอยู่ที่ 2 - 8 สัปดาห์ ขึ้นอยู่กับขนาดและความซับซ้อนของระบบครับ โดยเรามีการอัปเดตงานทุกสัปดาห์ (Sprint Review) เพื่อให้คุณเห็นความคืบหน้าตลอดเวลาครับ"
            : "Average delivery timeline ranges from 2 to 8 weeks depending on system scope and integrations. We provide weekly sprint demos so you can test features as they are built.",
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
            ? "ช่องทางติดต่อ Growkub:\n• 💬 Facebook Messenger: ทักแชทคุยกับ Developer ได้โดยตรง\n• ✉️ Email: contact@growkub.com\n• 📍 สำนักงาน: กรุงเทพมหานคร (บริการออนไลน์ & นัดประชุม Discovery Call ทั่วประเทศ)"
            : "Contact Growkub:\n• 💬 Facebook Messenger: Chat directly with our engineers\n• ✉️ Email: contact@growkub.com\n• 📍 Location: Bangkok, Thailand (Online & In-person discovery calls available)",
        quickReplies: [
          {
            label: locale === "th" ? "💬 คุยบน Messenger ทันที" : "💬 Chat on Messenger",
            text: "เปิด Messenger",
            action: "link",
            url: `https://m.me/${process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || "growkub"}`,
          },
          {
            label: locale === "th" ? "📝 ฝากเบอร์ให้โทรกลับ" : "📝 Request Callback",
            text: "ฝากข้อมูลติดต่อ",
            action: "form",
          },
        ],
      });
    }

    // Default Fallback: Friendly AI Assistant reply
    return NextResponse.json({
      success: true,
      reply:
        locale === "th"
          ? "สวัสดีครับ! ผมคือ Growkub Assistant 🚀 พร้อมช่วยตอบคำถามเรื่องการพัฒนา Web Application, Mobile App, ระบบ ERP หรือรับรายละเอียดโปรเจกต์เพื่อส่งต่อให้ Senior Developer ประเมินราคาได้ทันทีครับ สนใจหัวข้อใดเป็นพิเศษไหมครับ?"
          : "Hello! I am Growkub Assistant 🚀 I can help you with questions about Web Applications, Mobile Apps, Custom ERPs, or project quotations. How can we assist your business today?",
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
          label: locale === "th" ? "⚡ ขอใบเสนอราคาด่วน" : "⚡ Instant Quotation",
          text: "ขอใบเสนอราคา / ประเมินงบ",
          action: "form",
        },
        {
          label: locale === "th" ? "💬 แชทผ่าน Messenger" : "💬 Facebook Messenger",
          text: "เปิด Messenger",
          action: "link",
          url: `https://m.me/${process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || "growkub"}`,
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
