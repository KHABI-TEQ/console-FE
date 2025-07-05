"use client";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { apiService } from "@/lib/services/apiService";

interface AddUserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddUserTypeModal({
  isOpen,
  onClose,
  onSuccess,
}: AddUserTypeModalProps) {
  const [userType, setUserType] = useState<"landlord" | "agent">("landlord");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addNotification } = useApp();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "First name is required",
      });
      return false;
    }

    if (!formData.lastName.trim()) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Last name is required",
      });
      return false;
    }

    if (!formData.email.trim()) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Email is required",
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Please enter a valid email address",
      });
      return false;
    }

    if (!formData.password) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Password is required",
      });
      return false;
    }

    if (formData.password.length < 6) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Password must be at least 6 characters long",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Passwords do not match",
      });
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Phone number is required",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.trim(),
        userType: userType === "landlord" ? "Landowner" : "Agent",
      };

      const response =
        userType === "landlord"
          ? await apiService.createLandowner(userData)
          : await apiService.createAgent(userData);

      if (response.success) {
        addNotification({
          type: "success",
          title: "Success",
          message: `${userType === "landlord" ? "Landlord" : "Agent"} created successfully`,
        });

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
        });
        setUserType("landlord");

        onSuccess?.();
        onClose();
      } else {
        addNotification({
          type: "error",
          title: "Error",
          message: response.error || `Failed to create ${userType}`,
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Error",
        message: `Failed to create ${userType}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New User</SheetTitle>
          <SheetDescription>
            Create a new landlord or agent account
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* User Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Type</h3>
            <RadioGroup
              value={userType}
              onValueChange={(value) =>
                setUserType(value as "landlord" | "agent")
              }
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="landlord" id="landlord" />
                <Label htmlFor="landlord" className="cursor-pointer">
                  Landlord
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="agent" id="agent" />
                <Label htmlFor="agent" className="cursor-pointer">
                  Agent
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name*</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="First name"
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
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address*</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number*</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="+234 xxx xxx xxxx"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password*</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Enter password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password*</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSubmitting
                ? "Creating..."
                : `Create ${userType === "landlord" ? "Landlord" : "Agent"}`}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
