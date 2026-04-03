import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find a Mortuary in the Western Cape | Western Cape Mortuary Finder",
  description:
    "Find mortuaries with available space in the Western Cape, South Africa. Select your city to view mortuaries, availability, services, and contact details.",
  keywords: [
    "mortuary",
    "Western Cape",
    "Cape Town",
    "funeral",
    "bereavement",
    "South Africa",
  ],
  openGraph: {
    title: "Find a Mortuary in the Western Cape",
    description:
      "Find mortuaries with available space in the Western Cape, South Africa. Select your city to view mortuaries, availability, services, and contact details.",
    type: "website",
    locale: "en_ZA",
    siteName: "Western Cape Mortuary Finder",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#FAFBFC]">
        <LanguageProvider>
          <SiteHeader />
          <div className="flex-1 flex flex-col">{children}</div>
          <SiteFooter />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
