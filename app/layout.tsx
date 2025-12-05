import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RBP Cheque Printing",
  description: "For Cheque Printing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" />
        <footer className="print:hidden bg-white/80 backdrop-blur-md border-t border-slate-200 mt-auto">
          <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-4">
            <p className="text-center text-sm text-slate-500">
              Created By: Archie
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
