"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Shield, User, Mail, Phone, MapPin, Edit } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  adminData?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    role: string;
  };
}

export function EditAdminModal({
  isOpen,
  onClose,
  onSuccess,
  adminData,
}: EditAdminModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    role: "admin",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateAdmin } = useAdmin();

  useEffect(() => {
    if (adminData) {
      setFormData({
        email: adminData.email || "",
        firstName: adminData.firstName || "",
        lastName: adminData.lastName || "",
        phoneNumber: adminData.phoneNumber || "",
        address: adminData.address || "",
        role: adminData.role || "admin",
      });
    }
  }, [adminData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (adminData?.id) {
        await updateAdmin(adminData.id, formData);
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Failed to update admin:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
              <Edit className="h-5 w-5 text-white" />
            </div>
            <div>
              <SheetTitle>Edit Administrator</SheetTitle>
              <SheetDescription>
                Update administrator information and permissions
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-600" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name*</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name*</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address*</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="admin@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number*</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    placeholder="+234 (XXX) XXX-XXXX"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address*</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Street, State, Local Government Area"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role & Access */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Shield className="h-5 w-5 mr-2 text-gray-600" />
              Role & Access
            </h3>

            <div className="space-y-2">
              <Label htmlFor="role">Admin Role*</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superAdmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Super Admin has full system access, Admin has limited
                permissions
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {isSubmitting ? "Updating..." : "Update Administrator"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
