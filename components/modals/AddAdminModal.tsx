"use client";

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
import { Shield, User, Mail, Phone, MapPin } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation schema
const adminValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  phoneNumber: Yup.string()
    .matches(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .required("Phone number is required"),
  address: Yup.string()
    .min(10, "Address must be at least 10 characters")
    .required("Address is required"),
  role: Yup.string()
    .oneOf(["admin", "superAdmin"], "Invalid role selected")
    .required("Role is required"),
  password: Yup.string()
    .min(0) // Optional field
    .when([], {
      is: (password: string) => password && password.length > 0,
      then: (schema) => schema.min(8, "Password must be at least 8 characters"),
    }),
});

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddAdminModal({
  isOpen,
  onClose,
  onSuccess,
}: AddAdminModalProps) {

  const { createAdmin } = useAdmin();

  const createAdminMutation = useApiMutation({
    mutationFn: createAdmin,
    onSuccess: (data, variables) => {
      formik.resetForm();
      onSuccess?.();
      onClose();
    },
    invalidateQueries: ["admins", "users"],
    successMessage: "Administrator created successfully",
    errorMessage: "Failed to create administrator",
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      role: "admin",
      password: "",
    },
    validationSchema: adminValidationSchema,
    onSubmit: (values) => {
      createAdminMutation.mutate(values);
    },
  });

  const getFieldError = (fieldName: keyof typeof formik.values) => {
    return formik.touched[fieldName] && formik.errors[fieldName] 
      ? formik.errors[fieldName] 
      : undefined;
  };

  // Helper function to check if field has error
  const hasFieldError = (fieldName: keyof typeof formik.values) => {
    return !!(formik.touched[fieldName] && formik.errors[fieldName]);
  };


  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <SheetTitle>Add New Administrator</SheetTitle>
              <SheetDescription>
                Create a new admin account with appropriate permissions
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 mt-6">
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
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter first name"
                    className={hasFieldError("firstName") ? "border-red-500" : ""}
                  />
                  {getFieldError("firstName") && (
                    <p className="text-xs text-red-500">{getFieldError("firstName")}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name*</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter last name"
                    className={hasFieldError("lastName") ? "border-red-500" : ""}
                  />
                  {getFieldError("lastName") && (
                    <p className="text-xs text-red-500">{getFieldError("lastName")}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address*</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="admin@example.com"
                    className={`pl-10 ${hasFieldError("email") ? "border-red-500" : ""}`}
                  />
                </div>
                {getFieldError("email") && (
                  <p className="text-xs text-red-500">{getFieldError("email")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number*</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="+234 (XXX) XXX-XXXX"
                    className={`pl-10 ${hasFieldError("phoneNumber") ? "border-red-500" : ""}`}
                  />
                </div>
                {getFieldError("phoneNumber") && (
                  <p className="text-xs text-red-500">{getFieldError("phoneNumber")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address*</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Street, State, Local Government Area"
                    className={`pl-10 ${hasFieldError("address") ? "border-red-500" : ""}`}
                  />
                </div>
                {getFieldError("address") && (
                  <p className="text-xs text-red-500">{getFieldError("address")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password (Optional)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Leave empty to auto-generate"
                  className={hasFieldError("password") ? "border-red-500" : ""}
                />
                {getFieldError("password") && (
                  <p className="text-xs text-red-500">{getFieldError("password")}</p>
                )}
                <p className="text-xs text-gray-500">
                  If left empty, a temporary password will be generated and sent
                  via email
                </p>
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
                value={formik.values.role}
                onValueChange={(value) => formik.setFieldValue("role", value)}
              >
                <SelectTrigger className={hasFieldError("role") ? "border-red-500" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superAdmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("role") && (
                <p className="text-xs text-red-500">{getFieldError("role")}</p>
              )}
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
              disabled={createAdminMutation.isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAdminMutation.isPending || !formik.isValid}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {createAdminMutation.isPending ? "Creating..." : "Create Administrator"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
