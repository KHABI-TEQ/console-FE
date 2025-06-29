"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Home,
  DollarSign,
  Calendar,
  Settings,
  Save,
  RefreshCw,
  Clock,
  Shield,
} from "lucide-react";

export default function TenantPreferencesPage() {
  const [preferences, setPreferences] = useState({
    // Rental Settings
    defaultLeaseLength: "12", // months
    allowShortTermRentals: true,
    minimumLeaseLength: "6",
    maximumLeaseLength: "24",

    // Screening
    requireBackgroundCheck: true,
    requireCreditCheck: true,
    minimumCreditScore: "650",
    requireIncomeVerification: true,

    // Deposits & Fees
    defaultSecurityDeposit: "1", // months of rent
    allowPetDeposit: true,
    petDepositAmount: "500",
    applicationFee: "50",

    // Communication
    autoResponseEnabled: true,
    responseTimeHours: "24",

    // Maintenance
    allowOnlineRequests: true,
    emergencyContactRequired: true,

    // Property Access
    allowVirtualTours: true,
    requireInPersonViewing: false,

    // Notifications
    newApplicationAlerts: true,
    leaseExpirationAlerts: true,
    maintenanceRequestAlerts: true,
  });

  const stats = [
    {
      title: "Active Tenants",
      value: "2,156",
      change: "+8.2%",
      trend: "up" as const,
      icon: Users,
      color: "blue" as const,
    },
    {
      title: "Avg Lease Length",
      value: "14 months",
      change: "+2.1%",
      trend: "up" as const,
      icon: Calendar,
      color: "green" as const,
    },
    {
      title: "Avg Monthly Rent",
      value: "₦2,850",
      change: "+5.7%",
      trend: "up" as const,
      icon: DollarSign,
      color: "purple" as const,
    },
    {
      title: "Approval Rate",
      value: "73%",
      change: "+3.2%",
      trend: "up" as const,
      icon: Shield,
      color: "orange" as const,
    },
  ];

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving tenant preferences:", preferences);
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Tenant Preferences"
          description="Configure tenant screening, lease terms, and rental management settings"
        >
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </PageHeader>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lease & Rental Settings */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b">
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Lease & Rental Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Lease Length (months)</Label>
                  <Select
                    value={preferences.defaultLeaseLength}
                    onValueChange={(value) =>
                      handlePreferenceChange("defaultLeaseLength", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="18">18 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Minimum Lease Length</Label>
                  <Select
                    value={preferences.minimumLeaseLength}
                    onValueChange={(value) =>
                      handlePreferenceChange("minimumLeaseLength", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 month</SelectItem>
                      <SelectItem value="3">3 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">
                    Allow Short-term Rentals
                  </Label>
                  <p className="text-sm text-gray-600">
                    Enable rentals under 6 months
                  </p>
                </div>
                <Switch
                  checked={preferences.allowShortTermRentals}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("allowShortTermRentals", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Auto-Response Time (hours)</Label>
                <Select
                  value={preferences.responseTimeHours}
                  onValueChange={(value) =>
                    handlePreferenceChange("responseTimeHours", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Screening Requirements */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Tenant Screening
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">
                    Background Check Required
                  </Label>
                  <p className="text-sm text-gray-600">
                    Require criminal background check
                  </p>
                </div>
                <Switch
                  checked={preferences.requireBackgroundCheck}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("requireBackgroundCheck", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Credit Check Required</Label>
                  <p className="text-sm text-gray-600">
                    Require credit score verification
                  </p>
                </div>
                <Switch
                  checked={preferences.requireCreditCheck}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("requireCreditCheck", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Minimum Credit Score</Label>
                <Input
                  type="number"
                  value={preferences.minimumCreditScore}
                  onChange={(e) =>
                    handlePreferenceChange("minimumCreditScore", e.target.value)
                  }
                  placeholder="650"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Income Verification</Label>
                  <p className="text-sm text-gray-600">
                    Require proof of income documents
                  </p>
                </div>
                <Switch
                  checked={preferences.requireIncomeVerification}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("requireIncomeVerification", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Deposits & Fees */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
                Deposits & Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label>Security Deposit (months of rent)</Label>
                <Select
                  value={preferences.defaultSecurityDeposit}
                  onValueChange={(value) =>
                    handlePreferenceChange("defaultSecurityDeposit", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5 months</SelectItem>
                    <SelectItem value="1">1 month</SelectItem>
                    <SelectItem value="1.5">1.5 months</SelectItem>
                    <SelectItem value="2">2 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Allow Pet Deposits</Label>
                  <p className="text-sm text-gray-600">
                    Enable additional pet security deposits
                  </p>
                </div>
                <Switch
                  checked={preferences.allowPetDeposit}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("allowPetDeposit", checked)
                  }
                />
              </div>

              {preferences.allowPetDeposit && (
                <div className="space-y-2">
                  <Label>Pet Deposit Amount ($)</Label>
                  <Input
                    type="number"
                    value={preferences.petDepositAmount}
                    onChange={(e) =>
                      handlePreferenceChange("petDepositAmount", e.target.value)
                    }
                    placeholder="500"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Application Fee ($)</Label>
                <Input
                  type="number"
                  value={preferences.applicationFee}
                  onChange={(e) =>
                    handlePreferenceChange("applicationFee", e.target.value)
                  }
                  placeholder="50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Property Access & Viewing */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-orange-600" />
                Property Access & Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Allow Virtual Tours</Label>
                  <p className="text-sm text-gray-600">
                    Enable virtual property viewings
                  </p>
                </div>
                <Switch
                  checked={preferences.allowVirtualTours}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("allowVirtualTours", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">
                    Require In-Person Viewing
                  </Label>
                  <p className="text-sm text-gray-600">
                    Mandate physical property inspection
                  </p>
                </div>
                <Switch
                  checked={preferences.requireInPersonViewing}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("requireInPersonViewing", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">
                    Online Maintenance Requests
                  </Label>
                  <p className="text-sm text-gray-600">
                    Allow tenants to submit requests online
                  </p>
                </div>
                <Switch
                  checked={preferences.allowOnlineRequests}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("allowOnlineRequests", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">
                    Emergency Contact Required
                  </Label>
                  <p className="text-sm text-gray-600">
                    Require emergency contact information
                  </p>
                </div>
                <Switch
                  checked={preferences.emergencyContactRequired}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("emergencyContactRequired", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
