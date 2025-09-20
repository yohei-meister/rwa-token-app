import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Topbar } from "@/components/layout/Topbar";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asian Private Equity Token Marketplace",
  description: "Asian Private Equity Token Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <QueryProvider>
          <Topbar />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
