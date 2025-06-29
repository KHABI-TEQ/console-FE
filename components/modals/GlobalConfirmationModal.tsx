"use client";

import {
  AlertTriangle,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useConfirmation } from "@/contexts/ConfirmationContext";

export function GlobalConfirmationModal() {
  const { state, closeModal, handleConfirm } = useConfirmation();

  const getIcon = () => {
    switch (state.variant) {
      case "danger":
        return <Trash2 className="h-6 w-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-orange-600" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "info":
        return <Info className="h-6 w-6 text-blue-600" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
    }
  };

  const getButtonStyle = () => {
    switch (state.variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case "warning":
        return "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500";
      case "success":
        return "bg-green-600 hover:bg-green-700 focus:ring-green-500";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
      default:
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
    }
  };

  if (!state.isOpen) return null;

  return (
    <Dialog open={state.isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {state.title}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeModal}
              className="h-8 w-8 p-0"
              disabled={state.isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <DialogDescription className="text-gray-600 leading-relaxed">
          {state.description}
        </DialogDescription>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={closeModal}
            disabled={state.isLoading}
            className="w-full sm:w-auto"
          >
            {state.cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={state.isLoading}
            className={`w-full sm:w-auto text-white ${getButtonStyle()}`}
          >
            {state.isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              state.confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
