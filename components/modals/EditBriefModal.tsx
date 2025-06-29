"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { X, Plus, Edit, Calendar, User, Building, Target } from "lucide-react";

interface EditBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  briefData?: {
    id: string;
    title: string;
    description: string;
    type: string;
    priority: string;
    property: string;
    assignedTo: string;
    dueDate: string;
    objectives: string[];
    requirements: string;
    notes: string;
  };
}

export function EditBriefModal({
  isOpen,
  onClose,
  onSuccess,
  briefData,
}: EditBriefModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Marketing",
    priority: "Medium",
    property: "",
    assignedTo: "",
    dueDate: "",
    objectives: [] as string[],
    requirements: "",
    notes: "",
  });
  const [newObjective, setNewObjective] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (briefData) {
      setFormData({
        title: briefData.title || "",
        description: briefData.description || "",
        type: briefData.type || "Marketing",
        priority: briefData.priority || "Medium",
        property: briefData.property || "",
        assignedTo: briefData.assignedTo || "",
        dueDate: briefData.dueDate || "",
        objectives: briefData.objectives || [],
        requirements: briefData.requirements || "",
        notes: briefData.notes || "",
      });
    }
  }, [briefData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData((prev) => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()],
      }));
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update brief:", error);
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
              <SheetTitle>Edit Brief</SheetTitle>
              <SheetDescription>
                Update brief details, objectives, and requirements
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Edit className="h-5 w-5 mr-2 text-gray-600" />
              Brief Details
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Brief Title*</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter brief title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Provide a detailed description of the brief..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Brief Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Inspection">Inspection</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Documentation">
                        Documentation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      handleInputChange("priority", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment & Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-600" />
              Assignment & Timeline
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property">Associated Property</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Select
                    value={formData.property}
                    onValueChange={(value) =>
                      handleInputChange("property", value)
                    }
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern-downtown-apartment">
                        Modern Downtown Apartment
                      </SelectItem>
                      <SelectItem value="luxury-family-home">
                        Luxury Family Home
                      </SelectItem>
                      <SelectItem value="cozy-studio-loft">
                        Cozy Studio Loft
                      </SelectItem>
                      <SelectItem value="suburban-villa">
                        Suburban Villa
                      </SelectItem>
                      <SelectItem value="penthouse-suite">
                        Penthouse Suite
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Select
                    value={formData.assignedTo}
                    onValueChange={(value) =>
                      handleInputChange("assignedTo", value)
                    }
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah-johnson">
                        Sarah Johnson
                      </SelectItem>
                      <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                      <SelectItem value="emma-davis">Emma Davis</SelectItem>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="lisa-chen">Lisa Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Target className="h-5 w-5 mr-2 text-gray-600" />
              Objectives & Goals
            </h3>
            <div className="space-y-2">
              <Label>Add Objectives</Label>
              <div className="flex space-x-2">
                <Input
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="e.g., Increase property visibility by 50%"
                  onKeyPress={(e) => e.key === "Enter" && addObjective()}
                />
                <Button type="button" onClick={addObjective} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.objectives.map((objective, index) => (
                  <Badge key={index} variant="outline" className="pr-1">
                    {objective}
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Requirements & Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>

            <div className="space-y-2">
              <Label htmlFor="requirements">
                Requirements & Specifications
              </Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) =>
                  handleInputChange("requirements", e.target.value)
                }
                placeholder="List specific requirements, deliverables, or specifications..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional notes or context..."
                rows={2}
              />
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
              {isSubmitting ? "Updating..." : "Update Brief"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
