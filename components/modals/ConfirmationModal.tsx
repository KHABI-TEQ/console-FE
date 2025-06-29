"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2, CheckCircle, Info } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationModalProps) {
  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <Trash2 className="h-6 w-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "info":
        return <Info className="h-6 w-6 text-blue-600" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
    }
  };

  const getButtonStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      default:
        return "bg-red-600 hover:bg-red-700 text-white";
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3">
            {getIcon()}
            <AlertDialogTitle className="text-lg font-semibold">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base leading-relaxed mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex space-x-2">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 ${getButtonStyles()}`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for easier usage
import { useState } from "react";

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<
    Omit<ConfirmationModalProps, "isOpen" | "onClose" | "onConfirm">
  >({
    title: "",
    description: "",
  });
  const [onConfirmCallback, setOnConfirmCallback] = useState<
    (() => void) | null
  >(null);

  const showConfirmation = (
    newConfig: Omit<ConfirmationModalProps, "isOpen" | "onClose" | "onConfirm">,
    onConfirm: () => void,
  ) => {
    setConfig(newConfig);
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
  };

  const closeConfirmation = () => {
    setIsOpen(false);
    setOnConfirmCallback(null);
  };

  const handleConfirm = () => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    closeConfirmation();
  };

  const ConfirmationComponent = () => (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={closeConfirmation}
      onConfirm={handleConfirm}
      {...config}
    />
  );

  return {
    showConfirmation,
    closeConfirmation,
    ConfirmationComponent,
  };
}
