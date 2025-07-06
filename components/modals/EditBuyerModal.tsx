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
import { Switch } from "@/components/ui/switch";
import {
  X,
  Plus,
  Edit,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Home,
} from "lucide-react";

interface EditBuyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  buyerData?: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
}

export function EditBuyerModal({
  isOpen,
  onClose,
  onSuccess,
  buyerData,
}: EditBuyerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    status: "Lead",
    budgetMin: "",
    budgetMax: "",
    preferences: [] as string[],
    agent: "",
    preApproved: false,
    firstTimeBuyer: false,
    notes: "",
  });
  const [newPreference, setNewPreference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (buyerData) {
      setFormData({
        name: buyerData.name || "",
        email: buyerData.email || "",
        phone: buyerData.phone || "",
        location: buyerData.location || "",
        status: buyerData.status || "Lead",
        budgetMin: buyerData.budgetMin?.toString() || "",
        budgetMax: buyerData.budgetMax?.toString() || "",
        preferences: buyerData.preferences || [],
        agent: buyerData.agent || "",
        preApproved: buyerData.preApproved || false,
        firstTimeBuyer: buyerData.firstTimeBuyer || false,
        notes: buyerData.notes || "",
      });
    }
  }, [buyerData]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addPreference = () => {
    if (
      newPreference.trim() &&
      !formData.preferences.includes(newPreference.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        preferences: [...prev.preferences, newPreference.trim()],
      }));
      setNewPreference("");
    }
  };

  const removePreference = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.filter((_, i) => i !== index),
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
      console.error("Failed to update buyer:", error);
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
              <SheetTitle>Edit Buyer</SheetTitle>
              <SheetDescription>
                Update buyer profile, preferences, and budget information
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Edit className="h-5 w-5 mr-2 text-gray-600" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter buyer's full name"
                  required
                />
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
                    placeholder="buyer@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number*</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Preferred Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="City, State"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status & Budget */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-gray-600" />
              Status & Budget
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Buyer Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Looking">Looking</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Under Contract">
                      Under Contract
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetMin">Budget Min ($)</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) =>
                      handleInputChange("budgetMin", e.target.value)
                    }
                    placeholder="250000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budgetMax">Budget Max ($)</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) =>
                      handleInputChange("budgetMax", e.target.value)
                    }
                    placeholder="500000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent">Assigned Agent</Label>
                <Select
                  value={formData.agent}
                  onValueChange={(value) => handleInputChange("agent", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                    <SelectItem value="emma-davis">Emma Davis</SelectItem>
                    <SelectItem value="john-smith">John Smith</SelectItem>
                    <SelectItem value="lisa-chen">Lisa Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Home className="h-5 w-5 mr-2 text-gray-600" />
              Property Preferences
            </h3>

            <div className="space-y-2">
              <Label>Add Preferences</Label>
              <div className="flex space-x-2">
                <Select value={newPreference} onValueChange={setNewPreference}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Modern">Modern</SelectItem>
                    <SelectItem value="Traditional">Traditional</SelectItem>
                    <SelectItem value="Luxury">Luxury</SelectItem>
                    <SelectItem value="1 Bedroom">1 Bedroom</SelectItem>
                    <SelectItem value="2 Bedrooms">2 Bedrooms</SelectItem>
                    <SelectItem value="3+ Bedrooms">3+ Bedrooms</SelectItem>
                    <SelectItem value="Downtown">Downtown</SelectItem>
                    <SelectItem value="Suburbs">Suburbs</SelectItem>
                    <SelectItem value="Waterfront">Waterfront</SelectItem>
                    <SelectItem value="Pet-Friendly">Pet-Friendly</SelectItem>
                    <SelectItem value="Parking">Parking</SelectItem>
                    <SelectItem value="Garden">Garden</SelectItem>
                    <SelectItem value="Pool">Pool</SelectItem>
                    <SelectItem value="Gym">Gym</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addPreference} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.preferences.map((preference, index) => (
                  <Badge key={index} variant="outline" className="pr-1">
                    {preference}
                    <button
                      type="button"
                      onClick={() => removePreference(index)}
                      className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="preApproved">Pre-approved for mortgage</Label>
                  <p className="text-sm text-gray-600">
                    Buyer has pre-approval from lender
                  </p>
                </div>
                <Switch
                  id="preApproved"
                  checked={formData.preApproved}
                  onCheckedChange={(checked) =>
                    handleInputChange("preApproved", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="firstTimeBuyer">First-time buyer</Label>
                  <p className="text-sm text-gray-600">
                    This is their first home purchase
                  </p>
                </div>
                <Switch
                  id="firstTimeBuyer"
                  checked={formData.firstTimeBuyer}
                  onCheckedChange={(checked) =>
                    handleInputChange("firstTimeBuyer", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any additional notes about the buyer..."
                  rows={3}
                />
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
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {isSubmitting ? "Updating..." : "Update Buyer"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
