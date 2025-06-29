"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center shadow-xl border-0">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Something went wrong!
                </h1>
                <p className="text-gray-600 mt-2">
                  An unexpected error occurred. Our team has been notified and
                  is working on a fix.
                </p>
                {error.digest && (
                  <p className="text-xs text-gray-500 mt-2 font-mono">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Button
                  onClick={reset}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => (window.location.href = "/")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  If the problem persists, please contact support
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
