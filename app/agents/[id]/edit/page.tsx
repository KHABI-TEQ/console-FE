"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Shield,
  Star,
  Trophy,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { apiService } from "@/lib/services/apiService";

interface AgentEditPageProps {
  params: { id: string };
}

export default function AgentEditPage({ params }: AgentEditPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    company: "",
    location: "",
    bio: "",
    isAccountVerified: false,
    accountApproved: false,
    isFlagged: false,
    isInActive: false,
    agentData: {
      specialties: [] as string[],
      tier: "basic",
      rating: 0,
      commission: 0,
      sales: 0,
    },
  });

  const {
    data: agentResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agent", params.id],
    queryFn: () => apiService.getAgent(params.id),
  });

  // Handle data update using useEffect instead of onSuccess
  useEffect(() => {
    if (agentResponse?.success && agentResponse.data) {
      const data = agentResponse;
      setFormData({
        firstName: data.data.firstName || "",
        lastName: data.data.lastName || "",
        email: data.data.email || "",
        phoneNumber: data.data.phoneNumber || "",
        company: data.data.company || "",
        location: data.data.location || "",
        bio: data.data.bio || "",
        isAccountVerified: data.data.isAccountVerified || false,
          accountApproved: data.data.accountApproved || false,
          isFlagged: data.data.isFlagged || false,
          isInActive: data.data.isInActive || false,
          agentData: {
            specialties: data.data.agentData?.specialties || [],
            tier: data.data.agentData?.tier || "basic",
            rating: data.data.agentData?.rating || 0,
            commission: data.data.agentData?.commission || 0,
            sales: data.data.agentData?.sales || 0,
          },
        });
      }
    },
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith("agentData.")) {
      const agentField = field.replace("agentData.", "");
      setFormData((prev) => ({
        ...prev,
        agentData: {
          ...prev.agentData,
          [agentField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addSpecialty = () => {
    if (
      newSpecialty.trim() &&
      !formData.agentData.specialties.includes(newSpecialty.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        agentData: {
          ...prev.agentData,
          specialties: [...prev.agentData.specialties, newSpecialty.trim()],
        },
      }));
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      agentData: {
        ...prev.agentData,
        specialties: prev.agentData.specialties.filter((s) => s !== specialty),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiService.updateAgent(params.id, formData);

      if (response.success) {
        router.push(`/agents/${params.id}`);
      } else {
        alert("Failed to update agent: " + (response.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update agent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading agent details...</p>
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
                    Error Loading Agent
                  </h3>
                  <p className="text-red-700 text-sm">
                    Failed to load agent details. Please try again.
                  </p>
                </div>
              </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Agent</h1>
              <p className="text-gray-600">
                Update agent information and settings
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/agents/${params.id}`)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="Enter location"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Enter agent bio"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Agent Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Agent Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tier">Tier</Label>
                      <Select
                        value={formData.agentData.tier}
                        onValueChange={(value) =>
                          handleInputChange("agentData.tier", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.agentData.rating}
                        onChange={(e) =>
                          handleInputChange(
                            "agentData.rating",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        placeholder="0.0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sales">Total Sales</Label>
                      <Input
                        id="sales"
                        type="number"
                        min="0"
                        value={formData.agentData.sales}
                        onChange={(e) =>
                          handleInputChange(
                            "agentData.sales",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commission">Commission (₦)</Label>
                    <Input
                      id="commission"
                      type="number"
                      min="0"
                      value={formData.agentData.commission}
                      onChange={(e) =>
                        handleInputChange(
                          "agentData.commission",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Specialties</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.agentData.specialties.map(
                        (specialty, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs cursor-pointer"
                            onClick={() => removeSpecialty(specialty)}
                          >
                            {specialty}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ),
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        placeholder="Add specialty"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSpecialty();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSpecialty}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Settings */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Account Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={formData.isAccountVerified}
                      onCheckedChange={(checked) =>
                        handleInputChange("isAccountVerified", checked)
                      }
                    />
                    <Label htmlFor="verified">Account Verified</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="approved"
                      checked={formData.accountApproved}
                      onCheckedChange={(checked) =>
                        handleInputChange("accountApproved", checked)
                      }
                    />
                    <Label htmlFor="approved">Account Approved</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flagged"
                      checked={formData.isFlagged}
                      onCheckedChange={(checked) =>
                        handleInputChange("isFlagged", checked)
                      }
                    />
                    <Label htmlFor="flagged">Account Flagged</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inactive"
                      checked={formData.isInActive}
                      onCheckedChange={(checked) =>
                        handleInputChange("isInActive", checked)
                      }
                    />
                    <Label htmlFor="inactive">Account Inactive</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}