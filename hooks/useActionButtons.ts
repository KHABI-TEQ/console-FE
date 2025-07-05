import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { useConfirmation } from "@/contexts/ConfirmationContext";
import { apiService } from "@/lib/services/apiService";

interface UseActionButtonsProps {
  entityType:
    | "agent"
    | "landlord"
    | "property"
    | "contact"
    | "inspection"
    | "buyer";
  onRefresh?: () => void;
}

export function useActionButtons({
  entityType,
  onRefresh,
}: UseActionButtonsProps) {
  const router = useRouter();
  const { addNotification } = useApp();
  const { confirmAction } = useConfirmation();

  const handleView = (id: string) => {
    router.push(`/${entityType}s/${id}` as any);
  };

  const handleEdit = (id: string) => {
    router.push(`/${entityType}s/${id}/edit` as any);
  };

  const handleDelete = (id: string, name?: string) => {
    confirmAction({
      title: `Delete ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
      description: `Are you sure you want to delete ${name ? `"${name}"` : `this ${entityType}`}? This action cannot be undone and will remove all associated data.`,
      confirmText: `Delete ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          addNotification({
            type: "success",
            title: "Deleted successfully",
            message: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} has been deleted.`,
          });

          if (onRefresh) {
            onRefresh();
          }
        } catch (error) {
          addNotification({
            type: "error",
            title: "Delete failed",
            message: `Failed to delete ${entityType}. Please try again.`,
          });
        }
      },
    });
  };

  const handleContact = (email?: string, phone?: string) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    } else if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      addNotification({
        type: "warning",
        title: "No contact information",
        message: "No email or phone number available for this contact.",
      });
    }
  };

  const handleApprove = (id: string, name?: string) => {
    confirmAction({
      title: `Approve ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
      description: `Are you sure you want to approve ${name ? `"${name}"` : `this ${entityType}`}? This will grant the appropriate access and permissions.`,
      confirmText: `Approve ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
      cancelText: "Cancel",
      variant: "success",
      onConfirm: async () => {
        try {
          let response;

          switch (entityType) {
            case "property":
              response = await apiService.approveBrief(id);
              break;
            case "agent":
              response = await apiService.approveAgent(id, 1);
              break;
            default:
              throw new Error(`Approval not implemented for ${entityType}`);
          }

          if (response.success) {
            addNotification({
              type: "success",
              title: "Approved successfully",
              message:
                response.message || `${name || entityType} has been approved.`,
            });

            if (onRefresh) {
              onRefresh();
            }
          } else {
            addNotification({
              type: "error",
              title: "Approval failed",
              message: response.error || `Failed to approve ${entityType}.`,
            });
          }
        } catch (error) {
          addNotification({
            type: "error",
            title: "Approval failed",
            message: `Failed to approve ${entityType}. Please try again.`,
          });
        }
      },
    });
  };

  const handleReject = (id: string, name?: string) => {
    confirmAction({
      title: `Reject ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
      description: `Are you sure you want to reject ${name ? `"${name}"` : `this ${entityType}`}? This action can be undone later.`,
      confirmText: `Reject ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
      cancelText: "Cancel",
      variant: "warning",
      onConfirm: async () => {
        try {
          let response;

          switch (entityType) {
            case "property":
              response = await apiService.rejectBrief(id);
              break;
            case "agent":
              response = await apiService.approveAgent(id, 0);
              break;
            default:
              throw new Error(`Rejection not implemented for ${entityType}`);
          }

          if (response.success) {
            addNotification({
              type: "success",
              title: "Rejected successfully",
              message:
                response.message || `${name || entityType} has been rejected.`,
            });

            if (onRefresh) {
              onRefresh();
            }
          } else {
            addNotification({
              type: "error",
              title: "Rejection failed",
              message: response.error || `Failed to reject ${entityType}.`,
            });
          }
        } catch (error) {
          addNotification({
            type: "error",
            title: "Rejection failed",
            message: `Failed to reject ${entityType}. Please try again.`,
          });
        }
      },
    });
  };

  return {
    handleView,
    handleEdit,
    handleDelete,
    handleContact,
    handleApprove,
    handleReject,
  };
}
