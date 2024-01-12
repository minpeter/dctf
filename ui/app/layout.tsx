import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import Navbar from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";

import { cn } from "@/lib/utils";
import { Metadata } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Telos | Telos CTF platform",
  description: "Telos CTF platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Navbar />
        <div className="flex flex-col items-center justify-center p-10 mb-24">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
