import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastNotifications } from "@/components/shared/ToastNotifications";
import { RequestLoaderProvider } from "@/components/ui/request-loader";
import QueryProvider from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Property Admin - Management System",
  description: "Advanced real estate property management platform",
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
              <RequestLoaderProvider>
                <TooltipProvider>
                  {children}
                  <ToastNotifications />
                  <Toaster />
                </TooltipProvider>
              </RequestLoaderProvider>
            </AuthProvider>
          </AppProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
