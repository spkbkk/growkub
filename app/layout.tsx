import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | HelmetDev",
    default: "HelmetDev | Digital Product & Software Development",
  },
  description: "HelmetDev is a premium digital product and software engineering studio. We design and build high-performance web applications, mobile apps, and custom business systems.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "HelmetDev | Digital Product & Software Development",
    description: "Build scalable web applications, mobile apps, and business systems with HelmetDev.",
    siteName: "HelmetDev",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
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
                  var saved = localStorage.getItem('helmetdev_theme');
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
      <body className={`${inter.variable} bg-smoke-black text-text-primary antialiased min-h-screen flex flex-col font-sans selection:bg-brand-orange/20 selection:text-brand-orange`}>
        {children}
      </body>
    </html>
  );
}
