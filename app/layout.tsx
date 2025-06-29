import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PropertyAdmin - Management System",
  description: "Advanced property management and inspection system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AppProvider>
            <AuthProvider>
              <TooltipProvider>
                {children}
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </AuthProvider>
          </AppProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
