"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserX, AlertTriangle, Shield } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

interface DisableAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminId: string | null;
  adminName?: string;
  currentStatus?: string;
}

export function DisableAdminModal({
  isOpen,
  onClose,
  adminId,
  adminName,
  currentStatus,
}: DisableAdminModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { changeAdminStatus } = useAdmin();

  const isCurrentlyActive = currentStatus === "active";
  const actionText = isCurrentlyActive ? "disable" : "enable";
  const newStatus = isCurrentlyActive ? "inactive" : "active";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminId) return;

    setIsSubmitting(true);

    try {
      await changeAdminStatus(adminId, newStatus);

      // Reset form
      setReason("");
      onClose();
    } catch (error) {
      console.error(`Failed to ${actionText} admin:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center space-x-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isCurrentlyActive
                  ? "bg-gradient-to-br from-red-500 to-orange-500"
                  : "bg-gradient-to-br from-green-500 to-blue-500"
              }`}
            >
              {isCurrentlyActive ? (
                <UserX className="h-5 w-5 text-white" />
              ) : (
                <Shield className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <SheetTitle className="capitalize">
                {actionText} Administrator
              </SheetTitle>
              <SheetDescription>
                {adminName
                  ? `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} ${adminName}'s account`
                  : `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} administrator account`}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <div
              className={`border rounded-lg p-4 ${
                isCurrentlyActive
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle
                  className={`h-5 w-5 mt-0.5 ${
                    isCurrentlyActive ? "text-red-600" : "text-green-600"
                  }`}
                />
                <div>
                  <h4
                    className={`font-semibold ${
                      isCurrentlyActive ? "text-red-900" : "text-green-900"
                    }`}
                  >
                    {isCurrentlyActive ? "Disable Account" : "Enable Account"}
                  </h4>
                  <p
                    className={`text-sm mt-1 ${
                      isCurrentlyActive ? "text-red-700" : "text-green-700"
                    }`}
                  >
                    {isCurrentlyActive ? (
                      <>
                        This will prevent the administrator from logging in and
                        accessing the system. The account can be re-enabled
                        later if needed.
                      </>
                    ) : (
                      <>
                        This will restore the administrator's access to the
                        system and allow them to log in again.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason {isCurrentlyActive ? "(Optional)" : "(Optional)"}
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Enter reason for ${actionText === "disable" ? "disabling" : "enabling"} this account...`}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                This reason will be logged for audit purposes.
              </p>
            </div>

            {isCurrentlyActive && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">
                  What happens when you disable this account:
                </h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Administrator will be logged out immediately</li>
                  <li>• Account will not be able to sign in</li>
                  <li>• All active sessions will be terminated</li>
                  <li>• Account data will be preserved</li>
                  <li>• Can be re-enabled at any time</li>
                </ul>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 ${
                isCurrentlyActive
                  ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              }`}
            >
              {isSubmitting
                ? `${actionText.charAt(0).toUpperCase() + actionText.slice(1)}ing...`
                : `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Account`}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
