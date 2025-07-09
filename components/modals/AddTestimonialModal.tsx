"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { MessageSquare, User, Star, Upload, X } from "lucide-react";
import { useTestimonials } from "@/contexts/TestimonialsContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { apiService } from "@/lib/services/apiService";
import { toast } from "sonner";
import type { Testimonial } from "@/lib/types/testimonial";

const testimonialValidationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),
  occupation: Yup.string()
    .min(2, "Occupation must be at least 2 characters")
    .required("Occupation is required"),
  rating: Yup.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5")
    .required("Rating is required"),
  message: Yup.string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
  status: Yup.string()
    .oneOf(["pending", "approved", "rejected"], "Invalid status selected")
    .required("Status is required"),
});

interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  testimonialData?: Testimonial;
}

export function AddTestimonialModal({
  isOpen,
  onClose,
  onSuccess,
  testimonialData,
}: AddTestimonialModalProps) {
  const { createTestimonial, updateTestimonial } = useTestimonials();
  const [profileImageUrl, setProfileImageUrl] = useState<string>(
    testimonialData?.profileImage || "",
  );
  const [isUploading, setIsUploading] = useState(false);

  const isEdit = !!testimonialData;

  const createTestimonialMutation = useApiMutation({
    mutationFn: createTestimonial,
    onSuccess: (data, variables) => {
      // Reset form and close modal
      formik.resetForm();
      setProfileImageUrl("");
      onSuccess?.();
      onClose();
    },
    onError: (error, variables) => {
      // Error is already handled by useApiMutation
      console.error("Create testimonial error:", error);
    },
    invalidateQueries: ["testimonials"],
    successMessage: "Testimonial created successfully",
    errorMessage: "Failed to create testimonial",
  });

  const updateTestimonialMutation = useApiMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateTestimonial(id, data),
    onSuccess: (data, variables) => {
      // Reset form and close modal
      formik.resetForm();
      setProfileImageUrl("");
      onSuccess?.();
      onClose();
    },
    onError: (error, variables) => {
      // Error is already handled by useApiMutation
      console.error("Update testimonial error:", error);
    },
    invalidateQueries: ["testimonials"],
    successMessage: "Testimonial updated successfully",
    errorMessage: "Failed to update testimonial",
  });

  const formik = useFormik({
    initialValues: {
      fullName: testimonialData?.fullName || "",
      occupation: testimonialData?.occupation || "",
      rating: testimonialData?.rating || 5,
      message: testimonialData?.message || "",
      status: testimonialData?.status || "pending",
    },
    validationSchema: testimonialValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          profileImage: profileImageUrl || undefined,
        };

        if (isEdit && testimonialData) {
          updateTestimonialMutation.mutate({
            id: testimonialData._id,
            data: payload,
          });
        } else {
          createTestimonialMutation.mutate(payload);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
  });

  const getFieldError = (fieldName: keyof typeof formik.values) => {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? formik.errors[fieldName]
      : undefined;
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    // await toast.promise(
    //   apiService.uploadImage(formData).then((response) => {
    //     console.log("Response from file upload:", response);
    //     if ((response as any).url) {
    //       setProfileImageUrl((response as any).url);
    //       return "Image uploaded successfully";
    //     } else {
    //       throw new Error("Image upload failed");
    //     }
    //   }),
    //   {
    //     loading: "Uploading...",
    //     success: "Image uploaded successfully",
    //     error: "Image upload failed",
    //   },
    // );

    setIsUploading(false);
  };

  const removeImage = () => {
    setProfileImageUrl("");
  };

  const handleClose = () => {
    formik.resetForm();
    setProfileImageUrl(testimonialData?.profileImage || "");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[400px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            {isEdit ? "Edit Testimonial" : "Add New Testimonial"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the testimonial details below."
              : "Fill in the details below to create a new testimonial."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 mt-6">
          {/* Profile Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="profileImage">Profile Image</Label>
            <div className="flex items-center space-x-4">
              {profileImageUrl ? (
                <div className="relative">
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <Label
                  htmlFor="profileImage"
                  className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Image"}
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Optional. JPG, PNG up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter full name"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`pl-10 ${getFieldError("fullName") ? "border-red-500" : ""}`}
              />
            </div>
            {getFieldError("fullName") && (
              <p className="text-sm text-red-600">
                {getFieldError("fullName")}
              </p>
            )}
          </div>

          {/* Occupation */}
          <div className="space-y-2">
            <Label htmlFor="occupation">
              Occupation <span className="text-red-500">*</span>
            </Label>
            <Input
              id="occupation"
              name="occupation"
              type="text"
              placeholder="Enter occupation"
              value={formik.values.occupation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={getFieldError("occupation") ? "border-red-500" : ""}
            />
            {getFieldError("occupation") && (
              <p className="text-sm text-red-600">
                {getFieldError("occupation")}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">
              Rating <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formik.values.rating.toString()}
              onValueChange={(value) =>
                formik.setFieldValue("rating", parseInt(value))
              }
            >
              <SelectTrigger
                className={getFieldError("rating") ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span>
                        {rating} star{rating !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError("rating") && (
              <p className="text-sm text-red-600">{getFieldError("rating")}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formik.values.status}
              onValueChange={(value) => formik.setFieldValue("status", value)}
            >
              <SelectTrigger
                className={getFieldError("status") ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError("status") && (
              <p className="text-sm text-red-600">{getFieldError("status")}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Enter testimonial message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              className={getFieldError("message") ? "border-red-500" : ""}
            />
            {getFieldError("message") && (
              <p className="text-sm text-red-600">{getFieldError("message")}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={
                createTestimonialMutation.isPending ||
                updateTestimonialMutation.isPending
              }
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createTestimonialMutation.isPending ||
                updateTestimonialMutation.isPending ||
                isUploading
              }
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {createTestimonialMutation.isPending ||
              updateTestimonialMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEdit ? "Update Testimonial" : "Create Testimonial"}</>
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
