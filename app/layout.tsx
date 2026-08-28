import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Growkub",
    default: "Growkub | Digital Product & Software Development",
  },
  description: "Growkub is a premium digital product and software engineering studio. We design and build high-performance web applications, mobile apps, and custom business systems.",
  keywords: [
    "Growkub",
    "รับทำเว็บ",
    "รับพัฒนาระบบ",
    "Web Application",
    "Software Development",
    "Mobile App",
    "Next.js",
    "React",
    "TypeScript",
    "รับทำเว็บไซต์",
    "พัฒนาซอฟต์แวร์",
    "ระบบจัดการธุรกิจ",
    "ERP",
    "Digital Product Studio",
    "Bangkok",
    "Thailand",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Growkub | Digital Product & Software Development",
    description: "Build scalable web applications, mobile apps, and business systems with Growkub.",
    siteName: "Growkub",
    type: "website",
    locale: "th_TH",
    alternateLocale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Growkub | Digital Product & Software Development",
    description: "Build scalable web applications, mobile apps, and business systems with Growkub.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "YOUR_GOOGLE_VERIFICATION_CODE",
    // other: { "facebook-domain-verification": "YOUR_FB_CODE" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('growkub_theme') || localStorage.getItem('helmetdev_theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${prompt.variable} bg-smoke-black text-text-primary antialiased min-h-screen flex flex-col font-sans selection:bg-brand-orange/20 selection:text-brand-orange`}>
        {children}
      </body>
    </html>
  );
}
