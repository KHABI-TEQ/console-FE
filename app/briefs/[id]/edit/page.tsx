"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  FileText,
  User,
  Building,
  Target,
  AlertCircle,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { apiService } from "@/lib/services/apiService";

const BriefSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(20, "Description must be at least 20 characters")
    .required("Description is required"),
  type: Yup.string().required("Brief type is required"),
  priority: Yup.string().required("Priority is required"),
  propertyId: Yup.string().required("Property selection is required"),
  assignedTo: Yup.string().required("Assignment is required"),
  dueDate: Yup.date().required("Due date is required"),
});

interface BriefFormValues {
  title: string;
  description: string;
  type: string;
  priority: string;
  propertyId: string;
  assignedTo: string;
  dueDate: string;
  tags: string[];
  requirements: string;
  status: string;
}

interface EditBriefPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBriefPage({ params }: EditBriefPageProps) {
  const { id: briefId } = await params;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState("");

  const {
    data: briefResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["brief", briefId],
    queryFn: () => apiService.getBrief(briefId),
  });

  // Mock data for demonstration
  const mockBrief = {
    _id: briefId,
    title: "Luxury Apartment Marketing Strategy",
    description:
      "Comprehensive marketing plan for high-end residential properties in Victoria Island",
    type: "marketing",
    priority: "high",
    propertyId: "1",
    assignedTo: "1",
    dueDate: "2025-02-15",
    tags: ["Premium", "Marketing", "Social Media"],
    requirements:
      "1. Market research and competitor analysis\n2. Digital marketing strategy\n3. Social media campaign plan",
    status: "active",
  };

  const brief = mockBrief;

  // Mock data - replace with actual API calls
  const properties = [
    {
      id: "1",
      title: "Luxury Apartment - Victoria Island",
      type: "Residential",
      location: "Victoria Island, Lagos",
      price: 450000000,
    },
    {
      id: "2",
      title: "Commercial Complex - Lekki",
      type: "Commercial",
      location: "Lekki Phase 1, Lagos",
      price: 1200000000,
    },
  ];

  const assignees = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Marketing Manager",
      avatar: "/placeholder.svg",
    },
    {
      id: "2",
      name: "Mike Wilson",
      role: "Inspector",
      avatar: "/placeholder.svg",
    },
    {
      id: "3",
      name: "Emma Davis",
      role: "Sales Manager",
      avatar: "/placeholder.svg",
    },
  ];

  const initialValues: BriefFormValues = {
    title: brief?.title || "",
    description: brief?.description || "",
    type: brief?.type || "",
    priority: brief?.priority || "",
    propertyId: brief?.propertyId || "",
    assignedTo: brief?.assignedTo || "",
    dueDate: brief?.dueDate || "",
    tags: brief?.tags || [],
    requirements: brief?.requirements || "",
    status: brief?.status || "",
  };

  const handleSubmit = async (values: BriefFormValues) => {
    setIsSubmitting(true);
    try {
      await apiService.updateBrief(briefId, {
        ...values,
        updatedAt: new Date().toISOString(),
      });
      router.push(`/briefs/${briefId}`);
    } catch (error) {
      console.error("Failed to update brief:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = (tag: string, setFieldValue: any, currentTags: string[]) => {
    if (tag && !currentTags.includes(tag)) {
      setFieldValue("tags", [...currentTags, tag]);
      setNewTag("");
    }
  };

  const removeTag = (
    tagToRemove: string,
    setFieldValue: any,
    currentTags: string[],
  ) => {
    setFieldValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove),
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading brief details...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Card className="max-w-md mx-auto border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900">
                    Error Loading Brief
                  </h3>
                  <p className="text-red-700 text-sm">
                    Failed to load brief details. Please try again.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => refetch()}
                className="w-full mt-4 bg-red-600 hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Brief</h1>
              <p className="text-gray-600">
                Update brief details and requirements
              </p>
            </div>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={BriefSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Brief Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Brief Title *</Label>
                      <Field
                        as={Input}
                        id="title"
                        name="title"
                        placeholder="Enter a descriptive title for the brief"
                        className={
                          errors.title && touched.title ? "border-red-300" : ""
                        }
                      />
                      {errors.title && touched.title && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.title}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Field
                        as={Textarea}
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Provide a detailed description of the brief requirements and objectives"
                        className={
                          errors.description && touched.description
                            ? "border-red-300"
                            : ""
                        }
                      />
                      {errors.description && touched.description && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.description}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="type">Brief Type *</Label>
                        <Select
                          value={values.type}
                          onValueChange={(value) =>
                            setFieldValue("type", value)
                          }
                        >
                          <SelectTrigger
                            className={
                              errors.type && touched.type
                                ? "border-red-300"
                                : ""
                            }
                          >
                            <SelectValue placeholder="Select brief type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="inspection">
                              Inspection
                            </SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="documentation">
                              Documentation
                            </SelectItem>
                            <SelectItem value="legal">Legal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="priority">Priority *</Label>
                        <Select
                          value={values.priority}
                          onValueChange={(value) =>
                            setFieldValue("priority", value)
                          }
                        >
                          <SelectTrigger
                            className={
                              errors.priority && touched.priority
                                ? "border-red-300"
                                : ""
                            }
                          >
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={values.status}
                          onValueChange={(value) =>
                            setFieldValue("status", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="requirements">
                        Requirements & Guidelines
                      </Label>
                      <Field
                        as={Textarea}
                        id="requirements"
                        name="requirements"
                        rows={4}
                        placeholder="List specific requirements, guidelines, or deliverables"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Tags & Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag(newTag, setFieldValue, values.tags);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            addTag(newTag, setFieldValue, values.tags)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {values.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center space-x-1"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() =>
                                removeTag(tag, setFieldValue, values.tags)
                              }
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Property Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="h-5 w-5 mr-2" />
                      Property
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="propertyId">Select Property *</Label>
                      <Select
                        value={values.propertyId}
                        onValueChange={(value) =>
                          setFieldValue("propertyId", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.propertyId && touched.propertyId
                              ? "border-red-300"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Choose a property" />
                        </SelectTrigger>
                        <SelectContent>
                          {properties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {property.title}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {property.location}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Assignment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="assignedTo">Assign To *</Label>
                      <Select
                        value={values.assignedTo}
                        onValueChange={(value) =>
                          setFieldValue("assignedTo", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.assignedTo && touched.assignedTo
                              ? "border-red-300"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {assignees.map((assignee) => (
                            <SelectItem key={assignee.id} value={assignee.id}>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={assignee.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {assignee.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {assignee.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {assignee.role}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dueDate">Due Date *</Label>
                      <Field
                        as={Input}
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        className={
                          errors.dueDate && touched.dueDate
                            ? "border-red-300"
                            : ""
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Updating Brief...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Save className="h-4 w-4" />
                            <span>Update Brief</span>
                          </div>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AdminLayout>
  );
}
