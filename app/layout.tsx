import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Extension-Safe by Beauvoir | Shampoo Compatibility Checker",
  description:
    "Check if your shampoo is safe to use with hair extensions. AI-powered ingredient analysis with instant compatibility grading.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Extension-Safe",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-sans)] site-bg">
        <div className="site-bg-overlay" aria-hidden="true" />
        <div className="relative flex-1 flex flex-col z-10">{children}</div>
      </body>
    </html>
  );
}
