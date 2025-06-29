import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActionButtons } from "@/hooks/useActionButtons";

interface ActionButtonsProps {
  entityType:
    | "agent"
    | "landlord"
    | "property"
    | "contact"
    | "inspection"
    | "buyer";
  entityId: string;
  entityName?: string;
  email?: string;
  phone?: string;
  showApproval?: boolean;
  showContact?: boolean;
  showMore?: boolean;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  size?: "sm" | "default";
  variant?: "inline" | "dropdown";
  onRefresh?: () => void;
}

export function ActionButtons({
  entityType,
  entityId,
  entityName,
  email,
  phone,
  showApproval = false,
  showContact = false,
  showMore = false,
  size = "sm",
  variant = "inline",
  onRefresh,
}: ActionButtonsProps) {
  const {
    handleView,
    handleEdit,
    handleDelete,
    handleContact,
    handleApprove,
    handleReject,
  } = useActionButtons({ entityType, onRefresh });

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={size} className="p-2">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleView(entityId)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleEdit(entityId)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          {showContact && (
            <DropdownMenuItem onClick={() => handleContact(email, phone)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact
            </DropdownMenuItem>
          )}
          {showApproval && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleApprove(entityId, entityName)}
                className="text-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleReject(entityId, entityName)}
                className="text-orange-600"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleDelete(entityId, entityName)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size={size}
        className="hover:bg-blue-50 hover:border-blue-300"
        onClick={() => handleView(entityId)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size={size}
        className="hover:bg-green-50 hover:border-green-300"
        onClick={() => handleEdit(entityId)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      {showContact && (
        <Button
          variant="outline"
          size={size}
          className="hover:bg-purple-50 hover:border-purple-300"
          onClick={() => handleContact(email, phone)}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      )}
      {showApproval && (
        <>
          <Button
            variant="outline"
            size={size}
            className="hover:bg-green-50 hover:border-green-300"
            onClick={() => handleApprove(entityId, entityName)}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size={size}
            className="hover:bg-orange-50 hover:border-orange-300"
            onClick={() => handleReject(entityId, entityName)}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
      {showMore && (
        <Button
          variant="outline"
          size={size}
          className="hover:bg-red-50 hover:border-red-300"
          onClick={() => handleDelete(entityId, entityName)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
