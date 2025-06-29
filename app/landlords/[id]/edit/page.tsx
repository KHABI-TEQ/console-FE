"use client";

import { useState, useEffect } from "react";
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
import {
  ArrowLeft,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { apiService } from "@/lib/services/apiService";

interface LandlordEditPageProps {
  params: { id: string };
}

export default function LandlordEditPage({ params }: LandlordEditPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
    userType: "Individual",
    bio: "",
    isAccountVerified: false,
    accountApproved: false,
    isFlagged: false,
    isInActive: false,
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      isVerified: false,
    },
  });

  const {
    data: landlordResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["landlord", params.id],
    queryFn: () => apiService.getLandowner(params.id),
  });

  useEffect(() => {
    if (landlordResponse?.success && landlordResponse.data) {
      const data = landlordResponse;
      setFormData({
        firstName: data.data.firstName || "",
        lastName: data.data.lastName || "",
        email: data.data.email || "",
        phoneNumber: data.data.phoneNumber || "",
        location: data.data.location || "",
        userType: data.data.userType || "Individual",
        bio: data.data.bio || "",
        isAccountVerified: data.data.isAccountVerified || false,
        accountApproved: data.data.accountApproved || false,
        isFlagged: data.data.isFlagged || false,
        isInActive: data.data.isInActive || false,
        bankDetails: {
          accountName: data.data.bankDetails?.accountName || "",
          accountNumber: data.data.bankDetails?.accountNumber || "",
          bankName: data.data.bankDetails?.bankName || "",
        },
      });
    }
  }, [landlordResponse]);

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith("bankDetails.")) {
      const bankField = field.replace("bankDetails.", "");
      setFormData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [bankField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiService.updateLandowner(params.id, formData);

      if (response.success) {
        router.push(`/landlords/${params.id}`);
      } else {
        alert(
          "Failed to update landlord: " + (response.error || "Unknown error"),
        );
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update landlord. Please try again.");
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
              <p className="text-gray-600">Loading landlord details...</p>
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
                    Error Loading Landlord
                  </h3>
                  <p className="text-red-700 text-sm">
                    Failed to load landlord details. Please try again.
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
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Landlord
              </h1>
              <p className="text-gray-600">
                Update landlord information and settings
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/landlords/${params.id}`)}
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
                    <Label htmlFor="userType">Landlord Type</Label>
                    <Select
                      value={formData.userType}
                      onValueChange={(value) =>
                        handleInputChange("userType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select landlord type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Company">Company</SelectItem>
                        <SelectItem value="Trust">Trust</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Enter landlord bio"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Bank Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Bank Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      value={formData.bankDetails.accountName}
                      onChange={(e) =>
                        handleInputChange(
                          "bankDetails.accountName",
                          e.target.value,
                        )
                      }
                      placeholder="Enter account name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={formData.bankDetails.accountNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "bankDetails.accountNumber",
                          e.target.value,
                        )
                      }
                      placeholder="Enter account number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankDetails.bankName}
                      onChange={(e) =>
                        handleInputChange(
                          "bankDetails.bankName",
                          e.target.value,
                        )
                      }
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bankVerified"
                      checked={formData.bankDetails.isVerified}
                      onCheckedChange={(checked) =>
                        handleInputChange("bankDetails.isVerified", checked)
                      }
                    />
                    <Label htmlFor="bankVerified">Bank details verified</Label>
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
