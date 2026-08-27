คุณคือ Senior Full-Stack Developer และ UI/UX Designer

โปรเจกต์นี้ชื่อ "Growkub"
เป็นเว็บไซต์บริษัท Digital Product & Software Development

ฉันได้แนบไฟล์:
Growkub-website-spec.md
Growkub-docs.md
ให้คุณอ่านและทำตาม Specification ในไฟล์นี้เป็นหลัก

==================================================
IMPORTANT
==================================================

1. อ่าน Growkub-website-spec.md ให้ครบก่อนเริ่มเขียน Code
2. ห้ามข้าม Requirement ที่ระบุใน .md
3. หากมีรายละเอียดที่ไม่ได้ระบุ ให้เลือกแนวทางที่เรียบง่าย ปลอดภัย และเหมาะกับ Production
4. ห้ามถามคำถามที่ไม่จำเป็น หากสามารถตัดสินใจทาง Technical ได้เอง
5. อย่าสร้างระบบซับซ้อนเกินความจำเป็น
6. ให้เน้น Premium / Minimal / Fast / Maintainable
7. ใช้ TypeScript แบบ strict
8. ต้อง Responsive ทั้ง Desktop / Tablet / Mobile
9. ต้องรองรับ TH / EN ตั้งแต่ต้น
10. ห้าม Hard-code Database Password
11. ใช้ Environment Variables
12. ห้ามใส่ข้อมูลลูกค้าจริง
13. ทุก Feature ต้องมี Loading / Error / Empty State ที่เหมาะสม

==================================================
BRAND
==================================================

Brand:
Growkub

Tagline:
Digital Product & Software Development

Main Services:
- Web Application
- Mobile App
- Business / Backend System

Design:
- Premium
- Dark
- Minimal
- Modern
- Technical
- Professional

Color:
Smoke Black #111111
Smoke Dark #181818
Smoke #222222
Smoke Light #303030
Text #F5F5F5
Secondary #A3A3A3
Orange #FF6A00
Orange Hover #FF7A1A

Orange ใช้เป็น Accent เท่านั้น

Thai Font:
Sukhumvit

ภาษา:
TH / EN

==================================================
TECH STACK
==================================================

ใช้:

Next.js
App Router
TypeScript
Tailwind CSS
Framer Motion
Lucide React
PostgreSQL / Supabase

ใช้ Server Components เป็น Default

ใช้ Client Components เฉพาะจุดที่จำเป็น

Database Connection ใช้ Environment Variables:

DATABASE_URL=...

ห้ามเขียน Password ลง Source Code

สร้าง:

.env.example

และตรวจสอบให้แน่ใจว่า .env อยู่ใน .gitignore

==================================================
DEVELOPMENT ORDER
==================================================

ให้พัฒนาตามลำดับนี้

PHASE 1
Project Foundation + Design System

PHASE 2
Public Website

PHASE 3
Database + Backend

PHASE 4
Admin Dashboard

PHASE 5
Security + SEO + Performance + Polish

อย่าพยายามทำทุกอย่างแบบมั่ว ๆ ในครั้งเดียว

แต่ละ Phase ต้องสามารถ Build ได้

==================================================
PHASE 1
==================================================

สร้าง Project Structure ให้เรียบร้อย

สร้าง:

- Next.js App Router
- TypeScript
- Tailwind
- Theme
- Typography
- Color System
- Responsive Layout
- Navbar
- Footer
- Button
- Card
- Container
- Section
- Language Switcher

ออกแบบ Theme ให้ดูเหมือน Premium Software Studio

ห้ามใช้ UI สำเร็จรูปที่ทำให้เว็บดู Generic

==================================================
PHASE 2
PUBLIC WEBSITE
==================================================

สร้าง:

/
 /services
 /works
 /works/[slug]
 /about
 /contact

Home ต้องมี:

Hero
Services
Selected Works
Process
About
CTA
Footer

Hero ต้องเด่นมาก

ข้อความน้อย

ตัวอย่าง:

BUILD
DIGITAL
PRODUCTS.

และ

Digital Product & Software Development

CTA:

Start a Project →

View Works

==================================================
PORTFOLIO
==================================================

Projects ต้องโหลดจาก Database

รองรับ:

TH / EN
Cover Image
Gallery
Category
Year
Technology
Description
Features
Published
Featured

สร้าง Case Study Page

/works/[slug]

==================================================
CONTACT
==================================================

สร้าง Project Request Form

Fields:

Name
Email
Phone / LINE
Company
Project Type
Budget
Message

เมื่อ Submit:

1. Validate
2. ส่งไป Server
3. บันทึก Database
4. แสดง Success
5. Handle Error
6. ป้องกัน Spam เบื้องต้น

==================================================
PHASE 3
DATABASE
==================================================

สร้าง PostgreSQL Schema ตาม .md

Tables หลัก:

admins
services
projects
project_images
project_features
leads
site_settings

สร้าง Migration

สร้าง Seed Data

Seed Data ต้องเป็น Demo เท่านั้น

==================================================
PHASE 4
ADMIN
==================================================

สร้าง:

/admin/login
/admin/dashboard
/admin/leads
/admin/projects
/admin/services
/admin/settings

Admin UI ต้อง Premium แต่เรียบง่าย

Dashboard:

- New Leads
- Active Projects
- Published Works
- Monthly Leads

Leads:

- Search
- Filter
- View
- Status
- Note
- Delete

Status:

NEW
CONTACTED
DISCUSSION
QUOTATION
WON
LOST

Projects:

- Create
- Edit
- Delete
- Publish
- Unpublish
- Featured
- Sort Order
- Upload Images

Services:

- Create
- Edit
- Delete
- Enable / Disable
- Sort Order

ทุก Content ต้องรองรับ:

TH
EN

==================================================
AUTHENTICATION
==================================================

Admin ต้อง Authentication จริง

ห้ามใช้แค่ localStorage ซ่อนหน้า

ป้องกัน:

/admin/*
/api/admin/*

ใช้ Secure HTTP-only Cookie หรือ Supabase Auth

Password ต้อง Hash

==================================================
SEO
==================================================

เพิ่ม:

Metadata
Title
Description
Open Graph
Canonical
robots.txt
sitemap.xml
favicon

รองรับ TH / EN

==================================================
PERFORMANCE
==================================================

เน้น:

Fast Loading
Next Image
Lazy Loading
Server Components
Minimal JavaScript
Minimal Dependencies

Animation ใช้เท่าที่จำเป็น

ห้ามทำ Animation เยอะจนเว็บช้า

==================================================
DESIGN RULE
==================================================

จำกฎนี้ไว้ตลอดการพัฒนา:

LESS TEXT
MORE VISUAL
STRONG TYPOGRAPHY
LARGE WHITESPACE
DARK BACKGROUND
ORANGE ACCENT
MINIMAL UI
SUBTLE MOTION

เว็บต้องดูเหมือน Software Product Studio
ไม่ใช่เว็บรับเขียนโปรแกรมราคาถูก

==================================================
IMPORTANT FOR AI
==================================================

อย่าเขียนข้อความยาว ๆ ลงหน้าเว็บ

ให้ใช้:
- Heading สั้น
- Description 1-2 บรรทัด
- Visual
- Screenshot
- Case Study

เป็นหลัก

==================================================
QUALITY CHECK
==================================================

หลังพัฒนาแต่ละ Phase ให้ตรวจ:

- npm run lint
- npm run build
- TypeScript errors
- Responsive
- Console errors
- Broken links
- Database connection
- Authentication
- Form validation

ห้ามบอกว่า "เสร็จแล้ว" ถ้า Build ไม่ผ่าน

==================================================
FINAL GOAL
==================================================

เมื่อเปิดเว็บไซต์ครั้งแรก ผู้ใช้ต้องเข้าใจภายในประมาณ 5 วินาทีว่า:

Growkub คือใคร
ทำอะไร
มีผลงานอะไร
และจะติดต่อเพื่อเริ่ม Project ได้อย่างไร

Final impression:

PREMIUM
MODERN
TECHNICAL
TRUSTWORTHY
MINIMAL

เริ่มต้นจากการอ่าน Growkub-website-spec.md

จากนั้นตรวจสอบ Project ปัจจุบัน

ถ้าเป็น Project ใหม่ ให้สร้างโครงสร้างให้เหมาะสม

ถ้ามี Code อยู่แล้ว ให้รักษาของเดิมที่ดีไว้ และปรับตาม Specification

เริ่มทำ PHASE 1 ก่อน

หลังจาก PHASE 1 เสร็จ:
1. ตรวจ Build
2. ตรวจ Lint
3. ตรวจ Responsive
4. สรุปสิ่งที่สร้าง
5. จากนั้นดำเนิน PHASE 2 ต่อ

อย่าหยุดเพียงแค่สร้าง Mockup
ต้องพัฒนาเป็นระบบที่สามารถเชื่อม Database และใช้งานจริงได้