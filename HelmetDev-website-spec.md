# HiCode — Website & Admin Development Specification

## 1. Project Overview

สร้างเว็บไซต์บริษัท **HiCode** ในรูปแบบ Premium Digital Product & Software Development Studio

Brand:
- Name: HiCode
- Tagline: Digital Product & Software Development
- Primary language: Thai / English
- UI: Minimal, Premium, Modern, Dark Tech
- Main services:
  1. Web Application
  2. Mobile App
  3. Business / Backend System

เป้าหมายหลักของเว็บไซต์:
- สร้างความน่าเชื่อถือ
- แสดงผลงานแบบ Case Study
- ให้ลูกค้าส่ง Project Request
- รองรับ SEO
- มีระบบ Admin หลังบ้านสำหรับจัดการเนื้อหา
- รองรับ TH/EN ตั้งแต่โครงสร้างข้อมูล

---

# 2. Technology Stack

## Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion สำหรับ animation ที่จำเป็น
- Lucide React สำหรับ icons
- Responsive: Desktop / Tablet / Mobile

## Backend

ใช้ Next.js Server Components / Route Handlers / Server Actions ตามความเหมาะสม

## Database

Supabase PostgreSQL

Connection:

```env
DB_HOST=db.sqbpmcfaxakinqckoloz.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD
```

**IMPORTANT**
- ห้าม hard-code password ใน source code
- ห้าม commit `.env` เข้า Git
- สร้าง `.env.example`
- ใช้ environment variables เท่านั้น
- Production ให้ใช้ Supabase connection ที่ปลอดภัยตาม environment ของ deployment

แนะนำ environment:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.sqbpmcfaxakinqckoloz.supabase.co:5432/postgres
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

# 3. Brand Direction

## Visual Concept

HiCode = Premium / Dark / Minimal / Software Studio

ไม่ต้องทำเว็บแนว Corporate ที่มีข้อความจำนวนมาก

เน้น:
- Typography ใหญ่
- พื้นที่ว่างเยอะ
- ภาพ Screenshot ของผลงาน
- Motion เบา ๆ
- สีส้มใช้เป็น Accent
- Background สีควันบุหรี่ / ดำ
- Card ไม่ควรเยอะเกินไป

## Color System

```text
Smoke Black      #111111
Smoke Dark       #181818
Smoke            #222222
Smoke Light      #303030
Text Primary     #F5F5F5
Text Secondary   #A3A3A3
Orange Primary   #FF6A00
Orange Hover     #FF7A1A
Border           #333333
```

สีส้มใช้เป็น Accent เท่านั้น ไม่ควรใช้เต็มพื้นที่

---

# 4. Typography

Thai:
- Primary: Sukhumvit
- Fallback: Arial, sans-serif

English:
- ใช้ font ที่ modern และอ่านง่าย เช่น Inter / system sans-serif

CSS concept:

```css
font-family:
  "Sukhumvit",
  "Sukhumvit Set",
  Arial,
  sans-serif;
```

หมายเหตุ:
- อย่าโหลด font ที่มี license ไม่ชัดเจน
- ถ้า environment ไม่มี Sukhumvit ให้ fallback อย่างเหมาะสม
- ตัวหนังสือไม่ต้องเยอะ
- เน้น heading ใหญ่และข้อความสั้น

---

# 5. Website Structure

สร้างหน้า:

```text
/
├── Home
├── /services
├── /works
├── /works/[slug]
├── /about
├── /contact
└── /admin
```

## Main Navigation

Desktop:

```text
HiCode

Services
Works
Process
About

[ Start a Project → ]

TH | EN
```

Mobile:
- Logo
- Language switch
- Hamburger menu
- CTA

Navbar ควร sticky และมี background blur เมื่อ scroll

---

# 6. Home Page

Home ต้องเน้น Premium และข้อความน้อย

## Hero

ข้อความหลัก:

```text
BUILD
DIGITAL
PRODUCTS.
```

หรือภาษาไทย:

```text
เปลี่ยนไอเดีย
ให้กลายเป็น
Digital Product
```

Subtext สั้น:

```text
We design and build software
for modern businesses.
```

CTA:

```text
Start a Project →
View Works
```

Hero visual:
- Dark background
- subtle grid / noise
- orange glow เล็กน้อย
- animation เบา ๆ
- ไม่ใช้ animation เยอะจนโหลดช้า

---

# 7. Services Section

แสดงเพียง 3 Services

### Web Application

Build scalable web applications for business.

### Mobile App

Create modern mobile experiences for iOS and Android.

### Business System

Custom systems, dashboards and back-office solutions.

แต่ละ Card:
- Number
- Title
- short description
- icon
- arrow

ไม่ต้องใส่ paragraph ยาว

---

# 8. Selected Works

แสดง Portfolio 3-6 รายการ

Card มี:
- Cover image
- Project name
- Category
- Short description
- Technology
- View Case Study →

ตัวอย่าง Category:

```text
Web Application
Business System
SaaS
Dashboard
Live Commerce
```

---

# 9. Case Study

URL:

```text
/works/[slug]
```

โครงสร้าง:

```text
Project Title
Category
Year

Hero Image

Overview

Challenge

Solution

Features

Technology

Screenshots

Result

[ Start a Similar Project → ]
```

ใช้ข้อความสั้นและภาพเป็นหลัก

---

# 10. Process

แสดง 4 ขั้นตอน:

```text
01 DISCOVER
Understand the idea

02 DESIGN
Shape the product

03 DEVELOP
Build the system

04 LAUNCH
Deliver and improve
```

ไม่ต้องเขียนรายละเอียดเยอะ

---

# 11. About

สั้นมาก

ตัวอย่าง:

```text
HiCode is a digital product studio
focused on building useful software
for modern businesses.
```

แสดง:
- What we do
- Technologies
- Approach

ไม่ต้องมี Team section ถ้ายังไม่มีข้อมูลจริง

---

# 12. Contact / Start a Project

หน้า `/contact`

Heading:

```text
Have a project in mind?
Let's build it.
```

Form:

```text
Name *
Email *
Phone / LINE
Company
Project Type *
Budget
Message *
```

Project Type:

```text
Web Application
Mobile App
Business System
SaaS
API / Integration
Other
```

Budget:

```text
< 50,000
50,000 - 100,000
100,000 - 300,000
300,000+
Let's discuss
```

Submit:

```text
Send Project Request →
```

เมื่อส่งสำเร็จ:
- บันทึกลง database
- แสดง success message
- ไม่ต้องเปิดเผย database structure ฝั่ง client

---

# 13. Bilingual System TH / EN

ต้องรองรับ TH/EN ตั้งแต่ต้น

แนะนำ URL:

```text
/th
/en
```

หรือใช้ locale middleware ตามความเหมาะสมของ Next.js

ต้องมี language switch:

```text
TH | EN
```

เนื้อหาที่จัดการจาก Admin ต้องรองรับ:

```text
title_th
title_en

description_th
description_en

content_th
content_en
```

สำหรับ Portfolio และ Services

ห้ามสร้างระบบที่ต้อง copy database แยกเป็นภาษา

---

# 14. Database Schema

ใช้ PostgreSQL

## admins

```sql
id
email
password_hash
name
role
created_at
updated_at
```

role:

```text
admin
editor
```

## services

```sql
id
slug
title_th
title_en
description_th
description_en
icon
sort_order
is_active
created_at
updated_at
```

## projects

```sql
id
slug
title_th
title_en
short_description_th
short_description_en
description_th
description_en
category
cover_image
client_name
project_year
technologies
is_featured
sort_order
is_published
created_at
updated_at
```

## project_images

```sql
id
project_id
image_url
alt_th
alt_en
sort_order
created_at
```

## project_features

```sql
id
project_id
title_th
title_en
description_th
description_en
sort_order
```

## leads

```sql
id
name
email
phone
company
project_type
budget
message
status
created_at
updated_at
```

status:

```text
NEW
CONTACTED
DISCUSSION
QUOTATION
WON
LOST
```

## site_settings

```sql
id
key
value_th
value_en
updated_at
```

ใช้สำหรับ:
- Hero text
- Contact information
- Social links
- Footer
- SEO settings

---

# 15. Admin Dashboard

สร้าง `/admin`

Admin UI ต้องใช้ Design เดียวกับเว็บไซต์ แต่ลดความ decorative ลง

Layout:

```text
┌────────────────────────────────────────────┐
│ HiCode Admin                    Admin ▾ │
├──────────────┬─────────────────────────────┤
│ Dashboard    │                             │
│ Leads        │        Content Area         │
│ Projects     │                             │
│ Services     │                             │
│ Settings     │                             │
└──────────────┴─────────────────────────────┘
```

Sidebar:
- Dashboard
- Leads
- Projects
- Services
- Settings

---

# 16. Admin Dashboard

แสดง KPI แบบเรียบง่าย:

```text
New Leads
Active Projects
Published Works
This Month Leads
```

และ Recent Leads

ไม่ต้องทำ Dashboard ที่มีกราฟเยอะ

---

# 17. Lead Management

หน้า:

```text
/admin/leads
```

Table:

```text
Date
Name
Company
Project Type
Budget
Status
Action
```

สามารถ:
- Search
- Filter
- View detail
- Change status
- Add note
- Delete

Lead Detail:

```text
Customer Information
Project Information
Message
Status
Internal Note
Created Date
```

---

# 18. Project Management

หน้า:

```text
/admin/projects
```

Functions:

```text
Create
Edit
Delete
Publish / Unpublish
Featured / Unfeatured
Sort order
```

Form ต้องรองรับ TH/EN:

```text
Title TH
Title EN

Short Description TH
Short Description EN

Description TH
Description EN

Category
Year
Client
Technologies

Cover Image

Project Images

Features TH/EN
```

Preview ก่อน Publish ถ้าทำได้

---

# 19. Service Management

หน้า:

```text
/admin/services
```

สามารถ:
- เพิ่ม Service
- แก้ไข
- เปิด/ปิด
- จัดลำดับ
- TH/EN

---

# 20. Authentication

Admin ต้อง login

ห้ามใช้ frontend-only authentication

แนะนำ:
- Secure HTTP-only cookie
- Password hashing
- Server-side authorization
- Middleware ป้องกัน `/admin`
- Role-based access

ถ้าใช้ Supabase Auth สามารถใช้ Supabase Auth แทนระบบ password_hash ได้ และควรพิจารณาเป็นตัวเลือกหลักเพื่อความปลอดภัยและลด code ที่ต้องดูแลเอง

---

# 21. Security

ต้องทำ:

- Validate ทุก form ฝั่ง server
- Rate limit Contact API
- Sanitize input
- CSRF protection ตาม architecture
- Secure cookies
- ไม่ expose DB credentials
- ไม่ expose admin APIs โดยไม่มี authentication
- จำกัด upload file type / size
- ป้องกัน SQL Injection ด้วย parameterized queries / ORM
- `.env` ไม่ commit
- เพิ่ม `.gitignore`

---

# 22. SEO

ทุกหน้าต้องมี:

- title
- description
- Open Graph
- canonical URL
- favicon
- robots
- sitemap

ตัวอย่าง:

TH:

```text
HiCode | รับพัฒนาระบบ Web Application และ Software
```

EN:

```text
HiCode | Digital Product & Software Development
```

สร้าง:

```text
/sitemap.xml
/robots.txt
```

ใช้ Next.js Metadata API

---

# 23. Performance

ให้ความสำคัญกับ Performance

- ใช้ Next.js Image
- Optimize images
- Lazy load images
- ลด JavaScript ฝั่ง client
- ใช้ Server Components เป็น default
- Client Components เฉพาะจุดที่จำเป็น
- Animation ต้องเบา
- หลีกเลี่ยง library ขนาดใหญ่ถ้าไม่จำเป็น

เป้าหมาย:
- Fast first load
- Mobile friendly
- Good Core Web Vitals

---

# 24. Responsive Design

ต้องออกแบบ Mobile First

Breakpoint:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Mobile Home ต้องยังดู Premium

ไม่ย่อ Desktop ลงเฉย ๆ

---

# 25. UI Rules

ใช้หลัก:

```text
Less Text
More Visual
Strong Typography
Large Whitespace
Minimal Cards
Orange Accent
Dark Background
Subtle Motion
```

ห้าม:
- ใส่ข้อความยาว
- gradient สีส้มเต็มหน้า
- animation เยอะ
- card เยอะเกินไป
- icon ทุกบรรทัด
- stock illustration ที่ดู generic

---

# 26. Suggested Folder Structure

```text
HiCode/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx
│   │   ├── services/
│   │   ├── works/
│   │   │   └── [slug]/
│   │   ├── about/
│   │   └── contact/
│   │
│   ├── admin/
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── leads/
│   │   ├── projects/
│   │   ├── services/
│   │   └── settings/
│   │
│   └── api/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── home/
│   ├── portfolio/
│   └── admin/
│
├── lib/
│   ├── db/
│   ├── auth/
│   ├── validation/
│   └── utils/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── prisma/
│   └── schema.prisma
│
├── middleware.ts
├── .env.example
└── README.md
```

ถ้าเลือก Drizzle ORM แทน Prisma ให้ปรับ structure ตาม Drizzle และสร้าง migration อย่างเป็นระบบ

---

# 27. Development Phases

## Phase 1 — Foundation

- [ ] Setup Next.js + TypeScript
- [ ] Tailwind CSS
- [ ] Brand theme
- [ ] Thai / English
- [ ] Responsive layout
- [ ] Navbar
- [ ] Footer

## Phase 2 — Public Website

- [ ] Home
- [ ] Services
- [ ] Works
- [ ] Case Study
- [ ] About
- [ ] Contact
- [ ] SEO

## Phase 3 — Database

- [ ] PostgreSQL connection
- [ ] Migration
- [ ] Tables
- [ ] Seed data
- [ ] Database validation

## Phase 4 — Admin

- [ ] Admin login
- [ ] Dashboard
- [ ] Lead management
- [ ] Project management
- [ ] Service management
- [ ] Settings

## Phase 5 — Polish

- [ ] Motion
- [ ] Image optimization
- [ ] SEO
- [ ] Security
- [ ] Mobile testing
- [ ] Production build
- [ ] Error handling

---

# 28. Seed Content

ให้สร้างข้อมูลตัวอย่างเพื่อให้เว็บดูสมบูรณ์ตั้งแต่เริ่มต้น

Services:

```text
Web Application
Mobile App
Business System
```

Projects สามารถใช้ตัวอย่าง:

```text
Live Commerce Platform
Business Management System
Photo / Media Management
Employee Management System
Dashboard & Analytics
```

แต่ต้องระบุว่าเป็น Demo / Concept ถ้าไม่ใช่ผลงานลูกค้าจริง

---

# 29. Final Design Goal

เมื่อเปิดเว็บไซต์ครั้งแรก ผู้ใช้ควรรู้ภายใน 5 วินาทีว่า:

```text
HiCode คือใคร
↓
ทำอะไร
↓
ทำงานแบบไหน
↓
มีผลงานอะไร
↓
ถ้าสนใจต้องติดต่ออย่างไร
```

เว็บต้องให้ความรู้สึก:

```text
Premium
Modern
Technical
Trustworthy
Minimal
Professional
```

ไม่ต้องทำให้เหมือนเว็บ Agency ทั่วไป

**Core message:**

> HiCode  
> Digital Product & Software Development

> Build ideas. Create digital products.

---

# 30. Antigravity Development Instruction

ให้เริ่มพัฒนาตาม Phase 1 → Phase 5

หลักสำคัญ:

1. ห้ามสร้างทุกอย่างในไฟล์เดียว
2. ใช้ reusable components
3. ใช้ TypeScript strict
4. ใช้ Server Components เป็น default
5. Client Component เฉพาะที่จำเป็น
6. แยก database / business logic / UI
7. ห้ามใส่ DB password ใน source code
8. สร้าง `.env.example`
9. ทุก feature ต้องรองรับ error state และ loading state
10. ต้อง responsive
11. ต้องรองรับ TH/EN ตั้งแต่ต้น
12. ต้องใช้ข้อมูลจาก database สำหรับ Projects / Services / Leads
13. Admin ต้องถูกป้องกันด้วย authentication
14. ห้ามใส่ข้อมูลลูกค้าจริงใน seed
15. ก่อนจบแต่ละ Phase ให้ตรวจ TypeScript, lint และ production build

เริ่มจากสร้าง Project Structure และ Design System ก่อน จากนั้นค่อยพัฒนา Public Website และ Admin ตามลำดับ

**Do not over-engineer. Keep the UI minimal, premium and fast.**
