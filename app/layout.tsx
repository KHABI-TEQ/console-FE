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
import { ConfirmationProvider } from "@/contexts/ConfirmationContext";
import { GlobalConfirmationModal } from "@/components/modals/GlobalConfirmationModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Khabiteq Realty Console",
  description: "Advanced real estate property management platform",
  icons: {
    icon: "/khabi-teq-logo.svg",
    shortcut: "/khabi-teq-logo.svg",
    apple: "/khabi-teq-logo.svg",
  },
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
