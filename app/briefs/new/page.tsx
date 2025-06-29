"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Upload,
  X,
  Plus,
  FileText,
  Calendar,
  User,
  Building,
  Target,
  AlertCircle,
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
  attachments: File[];
}

export default function NewBriefPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState("");

  const initialValues: BriefFormValues = {
    title: "",
    description: "",
    type: "",
    priority: "",
    propertyId: "",
    assignedTo: "",
    dueDate: "",
    tags: [],
    requirements: "",
    attachments: [],
  };

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

  const handleSubmit = async (values: BriefFormValues) => {
    setIsSubmitting(true);
    try {
      await apiService.createBrief({
        ...values,
        status: "pending",
        progress: 0,
        createdAt: new Date().toISOString(),
      });
      router.push("/briefs");
    } catch (error) {
      console.error("Failed to create brief:", error);
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
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Brief
              </h1>
              <p className="text-gray-600">
                Create a comprehensive brief for property management tasks
              </p>
            </div>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={BriefSchema}
          onSubmit={handleSubmit}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {errors.type && touched.type && (
                          <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.type}</span>
                          </div>
                        )}
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
                        {errors.priority && touched.priority && (
                          <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.priority}</span>
                          </div>
                        )}
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
                        rows={3}
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
                      {errors.propertyId && touched.propertyId && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.propertyId}</span>
                        </div>
                      )}
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
                      {errors.assignedTo && touched.assignedTo && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.assignedTo}</span>
                        </div>
                      )}
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
                      {errors.dueDate && touched.dueDate && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.dueDate}</span>
                        </div>
                      )}
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
                            <span>Creating Brief...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Save className="h-4 w-4" />
                            <span>Create Brief</span>
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
