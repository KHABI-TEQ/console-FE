import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface PreloaderProps {
  size?: "sm" | "md" | "lg" | "full";
  text?: string;
  showLogo?: boolean;
}

export function Preloader({
  size = "md",
  text = "Loading...",
  showLogo = false,
}: PreloaderProps) {
  const sizeClasses = {
    sm: "h-32",
    md: "h-48",
    lg: "h-64",
    full: "h-screen",
  };

  const spinnerSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    full: "h-16 w-16",
  };

  return (
    <div
      className={`flex items-center justify-center ${sizeClasses[size]} w-full`}
    >
      <div className="text-center space-y-4">
        {showLogo && (
          <div className="mb-6">
            <img
              src="https://www.khabiteqrealty.com/_next/static/media/khabi-teq.5f752ece.svg"
              alt="KhabiTeq"
              className="h-12 mx-auto"
            />
          </div>
        )}

        <div className="flex items-center justify-center">
          <Loader2
            className={`${spinnerSizes[size]} animate-spin text-blue-600`}
          />
        </div>

        <p className="text-gray-600 text-sm font-medium">{text}</p>

        {size === "full" && (
          <div className="mt-8">
            <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PagePreloader({ text = "Loading page..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8">
          <Preloader size="lg" text={text} showLogo={true} />
        </CardContent>
      </Card>
    </div>
  );
}

export function InlinePreloader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">{text}</p>
      </div>
    </div>
  );
}
