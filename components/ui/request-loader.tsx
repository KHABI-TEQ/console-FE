"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestLoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
  setLoading: (loading: boolean) => void;
}

const RequestLoaderContext = createContext<
  RequestLoaderContextType | undefined
>(undefined);

export function useRequestLoader() {
  const context = useContext(RequestLoaderContext);
  if (!context) {
    throw new Error(
      "useRequestLoader must be used within a RequestLoaderProvider",
    );
  }
  return context;
}

interface RequestLoaderProviderProps {
  children: ReactNode;
}

export function RequestLoaderProvider({
  children,
}: RequestLoaderProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);
  const setLoading = (loading: boolean) => setIsLoading(loading);

  return (
    <RequestLoaderContext.Provider
      value={{ isLoading, showLoader, hideLoader, setLoading }}
    >
      {children}
      <RequestLoaderOverlay isVisible={isLoading} />
    </RequestLoaderContext.Provider>
  );
}

interface RequestLoaderOverlayProps {
  isVisible: boolean;
}

function RequestLoaderOverlay({ isVisible }: RequestLoaderOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in-0" />

      {/* Loader Content */}
      <div className="relative flex flex-col items-center justify-center bg-white rounded-xl shadow-2xl p-8 mx-4 animate-in zoom-in-95 duration-200">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Processing Request
        </h3>
        <p className="text-sm text-gray-600 text-center">
          Please wait while we process your request...
        </p>
      </div>
    </div>
  );
}

interface RequestLoaderButtonProps {
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void | Promise<void>;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function RequestLoaderButton({
  children,
  isLoading = false,
  className,
  onClick,
  disabled,
  ...props
}: RequestLoaderButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const { showLoader, hideLoader } = useRequestLoader();

  const handleClick = async () => {
    if (!onClick || isLoading || internalLoading || disabled) return;

    try {
      setInternalLoading(true);
      showLoader();
      await onClick();
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setInternalLoading(false);
      hideLoader();
    }
  };

  const isButtonLoading = isLoading || internalLoading;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "h-10 px-4 py-2",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        className,
      )}
      disabled={disabled || isButtonLoading}
      onClick={handleClick}
      {...props}
    >
      {isButtonLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
