"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  EyeOff,
  Edit,
  Flag,
  Trash2,
  UserCheck,
  UserX,
  MessageSquare,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useConfirmation } from "@/contexts/ConfirmationContext";
import { apiService } from "@/lib/services/apiService";
import { LandlordQuickViewModal } from "@/components/modals/LandlordQuickViewModal";

interface LandlordActionsProps {
  landlord: any;
  onRefresh?: () => void;
}

export function LandlordActions({ landlord, onRefresh }: LandlordActionsProps) {
  const router = useRouter();
  const { addNotification } = useApp();
  const { confirmAction } = useConfirmation();
  const [showQuickView, setShowQuickView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const landlordId = landlord.id || landlord._id;
  const landlordName =
    landlord.fullName ||
    `${landlord.firstName || ""} ${landlord.lastName || ""}`.trim() ||
    "Unknown Landlord";

  const handleQuickView = () => {
    setShowQuickView(true);
  };

  const handleView = () => {
    router.push(`/landlords/${landlordId}`);
  };

  const handleEdit = () => {
    router.push(`/landlords/${landlordId}/edit`);
  };

  const handleContact = () => {
    if (landlord.email) {
      window.location.href = `mailto:${landlord.email}`;
    } else if (landlord.phoneNumber) {
      window.location.href = `tel:${landlord.phoneNumber}`;
    } else {
      addNotification({
        type: "warning",
        title: "No contact information",
        message: "No email or phone number available for this landlord.",
      });
    }
  };

  const handleChangeStatus = () => {
    const newStatus =
      landlord.accountStatus === "active" ? "inactive" : "active";
    const action = newStatus === "active" ? "activate" : "deactivate";

    confirmAction({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Landlord`,
      description: `Are you sure you want to ${action} "${landlordName}"? This will ${newStatus === "active" ? "grant" : "revoke"} their access to the platform.`,
      confirmText: `${action.charAt(0).toUpperCase() + action.slice(1)} Landlord`,
      cancelText: "Cancel",
      variant: newStatus === "active" ? "success" : "warning",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          // Simulate API call for changing status
          await new Promise((resolve) => setTimeout(resolve, 1000));

          addNotification({
            type: "success",
            title: `Landlord ${action}d successfully`,
            message: `${landlordName} has been ${action}d.`,
          });

          if (onRefresh) {
            onRefresh();
          }
        } catch (error) {
          addNotification({
            type: "error",
            title: `Failed to ${action} landlord`,
            message: `Failed to ${action} ${landlordName}. Please try again.`,
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleFlagAccount = () => {
    const action = landlord.isFlagged ? "unflag" : "flag";
    const newStatus = !landlord.isFlagged;

    confirmAction({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Landlord Account`,
      description: `Are you sure you want to ${action} "${landlordName}"? ${
        action === "flag"
          ? "This will mark the account for review and may restrict access."
          : "This will remove the flag and restore normal access."
      }`,
      confirmText: `${action.charAt(0).toUpperCase() + action.slice(1)} Account`,
      cancelText: "Cancel",
      variant: action === "flag" ? "warning" : "success",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const response = await apiService.flagLandlordAccount(
            landlordId,
            newStatus,
          );

          if (response.success) {
            addNotification({
              type: "success",
              title: `Account ${action}ged successfully`,
              message:
                response.message || `${landlordName} has been ${action}ged.`,
            });

            if (onRefresh) {
              onRefresh();
            }
          } else {
            addNotification({
              type: "error",
              title: `Failed to ${action} account`,
              message: response.error || `Failed to ${action} ${landlordName}.`,
            });
          }
        } catch (error) {
          addNotification({
            type: "error",
            title: `Failed to ${action} account`,
            message: `Failed to ${action} ${landlordName}. Please try again.`,
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleDelete = () => {
    confirmAction({
      title: "Delete Landlord Account",
      description: `Are you sure you want to delete "${landlordName}"? This action cannot be undone and will remove all associated data including properties and transactions.`,
      confirmText: "Delete Account",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const response = await apiService.deleteLandowner(landlordId);

          if (response.success) {
            addNotification({
              type: "success",
              title: "Account deleted successfully",
              message: `${landlordName} has been deleted.`,
            });

            if (onRefresh) {
              onRefresh();
            }
          } else {
            addNotification({
              type: "error",
              title: "Failed to delete account",
              message: response.error || `Failed to delete ${landlordName}.`,
            });
          }
        } catch (error) {
          addNotification({
            type: "error",
            title: "Failed to delete account",
            message: `Failed to delete ${landlordName}. Please try again.`,
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="p-2"
            disabled={isLoading}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleQuickView}>
            <EyeOff className="mr-2 h-4 w-4" />
            Quick View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleContact}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleChangeStatus}>
            {landlord.accountStatus === "active" ? (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleFlagAccount}
            className={
              landlord.isFlagged ? "text-green-600" : "text-orange-600"
            }
          >
            <Flag className="mr-2 h-4 w-4" />
            {landlord.isFlagged ? "Unflag Account" : "Flag Account"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LandlordQuickViewModal
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        landlord={landlord}
      />
    </>
  );
}
