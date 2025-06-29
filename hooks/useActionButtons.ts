import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";

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

  const handleView = (id: string) => {
    router.push(`/${entityType}s/${id}` as any);
  };

  const handleEdit = (id: string) => {
    router.push(`/${entityType}s/${id}/edit` as any);
  };

  const handleDelete = async (id: string, name?: string) => {
    if (
      !confirm(
        `Are you sure you want to delete ${name ? `"${name}"` : `this ${entityType}`}? This action cannot be undone.`,
      )
    ) {
      return;
    }

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

  const handleApprove = async (id: string, name?: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      addNotification({
        type: "success",
        title: "Approved successfully",
        message: `${name || entityType} has been approved.`,
      });

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Approval failed",
        message: `Failed to approve ${entityType}. Please try again.`,
      });
    }
  };

  const handleReject = async (id: string, name?: string) => {
    const reason = prompt("Please provide a reason for rejection (optional):");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      addNotification({
        type: "success",
        title: "Rejected successfully",
        message: `${name || entityType} has been rejected.`,
      });

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Rejection failed",
        message: `Failed to reject ${entityType}. Please try again.`,
      });
    }
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
