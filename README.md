# HelmetDev — Premium Digital Product & Software Studio

> **HelmetDev** | Digital Product & Software Development  
> Build ideas. Create digital products.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router with Server Components by default)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Dark Smoke Palette with Orange Accent)
- **Motion & Icons**: Framer Motion & Lucide React
- **Database Layer**: PostgreSQL / Supabase ready via Universal Repository Pattern
- **Authentication**: Secure HTTP-Only JWT Session Cookie & Bcrypt Password Hashing
- **Internationalization**: Full Bilingual support (**TH / EN**) across all pages & database fields

---

## 🎨 Brand Design Tokens

| Token | Hex Value | Usage |
|---|---|---|
| **Smoke Black** | `#111111` | Primary background |
| **Smoke Dark** | `#181818` | Card / Container background |
| **Smoke** | `#222222` | Elevation & input background |
| **Smoke Light** | `#303030` | Hover states |
| **Text Primary** | `#F5F5F5` | Headings & primary copy |
| **Text Secondary** | `#A3A3A3` | Subtext & descriptions |
| **Orange Primary** | `#FF6A00` | Accent buttons & glows |
| **Orange Hover** | `#FF7A1A` | Button hover state |
| **Border** | `#333333` | Subtle structural dividers |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your Supabase PostgreSQL connection string:
```env
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.sqbpmcfaxakinqckoloz.supabase.co:5432/postgres"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_JWT_SECRET="your_strong_jwt_secret_key"
```

> **Note**: If `DATABASE_URL` is not yet configured, the system operates seamlessly with the active seed repository store, ensuring zero downtime during development.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Test
```bash
npm run build
npm run start
```

---

## 🔐 Admin Portal

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Default Email**: `admin@helmetdev.com`
- **Default Password**: `admin_helmetdev_2026`

### Admin Features:
- **Dashboard**: Real-time KPI counters (New Leads, Active Projects, Published Works, Monthly Leads) and recent inquiries.
- **Lead Management** (`/admin/leads`): Search, filter by stage (`NEW`, `CONTACTED`, `DISCUSSION`, `QUOTATION`, `WON`, `LOST`), detail modal, and internal notes.
- **Project Management** (`/admin/projects`): Create and edit case studies with full bilingual (TH/EN) fields, feature bullet points, and tech badges.
- **Service Management** (`/admin/services`): Configure the 3 core studio services.
- **Settings** (`/admin/settings`): Edit global hero tagline, contact emails, and studio parameters.

---

## 📁 Project Structure

```text
helmetdev/
├── app/
│   ├── [locale]/             # Bilingual Public Routes (/th, /en)
│   │   ├── layout.tsx        # Public layout with Navbar & Footer
│   │   ├── page.tsx          # Home Page (Hero, Services, Works, Process, About, CTA)
│   │   ├── services/         # Services Breakdown Page
│   │   ├── works/            # Portfolio & Case Studies List
│   │   │   └── [slug]/       # Full Case Study Detail Page
│   │   ├── about/            # Studio & Engineering Values Page
│   │   └── contact/          # Project Request Form & Inquiries
│   ├── admin/                # Protected Admin CMS Area
│   │   ├── login/            # Admin Authentication
│   │   ├── dashboard/        # KPI & Analytics Dashboard
│   │   ├── leads/            # Lead Pipeline Management
│   │   ├── projects/         # Case Study & Project Editor
│   │   ├── services/         # Service Configurator
│   │   └── settings/         # Site Settings
│   ├── api/                  # Route Handlers
│   │   ├── contact/          # Lead Submission API with anti-spam
│   │   └── admin/            # Auth, Leads, Projects, Services APIs
│   ├── layout.tsx            # Root HTML Layout & Fonts
│   ├── page.tsx              # Root Redirect to /th
│   ├── robots.ts             # SEO Robots configuration
│   └── sitemap.ts            # Dynamic SEO XML Sitemap
├── components/
│   ├── ui/                   # Reusable UI (Button, Card, Badge, Input, Select, etc.)
│   ├── layout/               # Navbar, Footer, LanguageSwitcher
│   ├── home/                 # Hero, Services, Works, Process, About, CTA Sections
│   ├── works/                # WorksList with category filter
│   ├── contact/              # Interactive Project Request Form
│   └── admin/                # ProjectForm, Stats, Tables
├── lib/
│   ├── i18n/                 # Thai & English Dictionaries & Types
│   ├── db/                   # Database Client, Types, Seed Data, Schema SQL
│   ├── auth/                 # JWT & Password Hash Verification
│   └── utils/                # Utility helpers & formatters
└── public/
    └── images/projects/      # Project Screenshot Visuals (SVG)
```
