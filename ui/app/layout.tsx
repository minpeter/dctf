import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import Navbar from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";

import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Telos | Telos Ctf Platform</title>
      </head>
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
