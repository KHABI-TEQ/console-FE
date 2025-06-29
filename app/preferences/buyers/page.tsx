"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  UserCheck,
  Heart,
  Home,
  DollarSign,
  Settings,
  Save,
  RefreshCw,
  TrendingUp,
  MapPin,
} from "lucide-react";

export default function BuyerPreferencesPage() {
  const [preferences, setPreferences] = useState({
    // Search & Matching
    autoMatchNotifications: true,
    dailyDigest: true,
    instantAlerts: false,
    matchRadius: "25", // miles

    // Budget Settings
    defaultBudgetRange: {
      min: "400000",
      max: "800000",
    },
    showAboveBudget: false,

    // Property Types
    allowedPropertyTypes: ["apartment", "condo", "townhouse"],

    // Communication
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,

    // Advanced Matching
    requirePreApproval: false,
    minimumRating: "4.0",
    verifiedListingsOnly: true,
  });

  const stats = [
    {
      title: "Active Buyers",
      value: "1,247",
      change: "+18.2%",
      trend: "up" as const,
      icon: UserCheck,
      color: "blue" as const,
    },
    {
      title: "Matched Properties",
      value: "8,432",
      change: "+25.1%",
      trend: "up" as const,
      icon: Heart,
      color: "green" as const,
    },
    {
      title: "Avg Budget",
      value: "$685K",
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "purple" as const,
    },
    {
      title: "Success Rate",
      value: "78%",
      change: "+5.3%",
      trend: "up" as const,
      icon: TrendingUp,
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
    // Save preferences logic
    console.log("Saving buyer preferences:", preferences);
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Buyer Preferences"
          description="Configure buyer matching algorithms, notifications, and default settings"
        >
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
          {/* Matching & Search Settings */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-blue-600" />
                Matching & Search Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">
                    Auto-Match Notifications
                  </Label>
                  <p className="text-sm text-gray-600">
                    Automatically notify buyers of matching properties
                  </p>
                </div>
                <Switch
                  checked={preferences.autoMatchNotifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("autoMatchNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Daily Digest</Label>
                  <p className="text-sm text-gray-600">
                    Send daily summary of new matching properties
                  </p>
                </div>
                <Switch
                  checked={preferences.dailyDigest}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("dailyDigest", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Instant Alerts</Label>
                  <p className="text-sm text-gray-600">
                    Send immediate notifications for high-priority matches
                  </p>
                </div>
                <Switch
                  checked={preferences.instantAlerts}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("instantAlerts", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Default Match Radius (miles)</Label>
                <Select
                  value={preferences.matchRadius}
                  onValueChange={(value) =>
                    handlePreferenceChange("matchRadius", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 miles</SelectItem>
                    <SelectItem value="10">10 miles</SelectItem>
                    <SelectItem value="25">25 miles</SelectItem>
                    <SelectItem value="50">50 miles</SelectItem>
                    <SelectItem value="100">100 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Budget & Pricing */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Budget & Pricing Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Min Budget</Label>
                  <Input
                    type="number"
                    value={preferences.defaultBudgetRange.min}
                    onChange={(e) =>
                      handlePreferenceChange("defaultBudgetRange", {
                        ...preferences.defaultBudgetRange,
                        min: e.target.value,
                      })
                    }
                    placeholder="400000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default Max Budget</Label>
                  <Input
                    type="number"
                    value={preferences.defaultBudgetRange.max}
                    onChange={(e) =>
                      handlePreferenceChange("defaultBudgetRange", {
                        ...preferences.defaultBudgetRange,
                        max: e.target.value,
                      })
                    }
                    placeholder="800000"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Show Above Budget</Label>
                  <p className="text-sm text-gray-600">
                    Include properties slightly above buyer's budget
                  </p>
                </div>
                <Switch
                  checked={preferences.showAboveBudget}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("showAboveBudget", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Minimum Agent Rating</Label>
                <Select
                  value={preferences.minimumRating}
                  onValueChange={(value) =>
                    handlePreferenceChange("minimumRating", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3.0">3.0 stars</SelectItem>
                    <SelectItem value="3.5">3.5 stars</SelectItem>
                    <SelectItem value="4.0">4.0 stars</SelectItem>
                    <SelectItem value="4.5">4.5 stars</SelectItem>
                    <SelectItem value="5.0">5.0 stars only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Communication Preferences */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-purple-600" />
                Communication Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Send property matches via email
                  </p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("emailNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">SMS Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Send urgent updates via SMS
                  </p>
                </div>
                <Switch
                  checked={preferences.smsNotifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("smsNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Push Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Mobile app notifications
                  </p>
                </div>
                <Switch
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("pushNotifications", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-orange-600" />
                Advanced Matching
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Require Pre-Approval</Label>
                  <p className="text-sm text-gray-600">
                    Only show buyers pre-approved properties
                  </p>
                </div>
                <Switch
                  checked={preferences.requirePreApproval}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("requirePreApproval", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Verified Listings Only</Label>
                  <p className="text-sm text-gray-600">
                    Show only verified property listings
                  </p>
                </div>
                <Switch
                  checked={preferences.verifiedListingsOnly}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("verifiedListingsOnly", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Allowed Property Types</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["apartment", "condo", "townhouse", "house", "studio"].map(
                    (type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={type}
                          checked={preferences.allowedPropertyTypes.includes(
                            type,
                          )}
                          onChange={(e) => {
                            const newTypes = e.target.checked
                              ? [...preferences.allowedPropertyTypes, type]
                              : preferences.allowedPropertyTypes.filter(
                                  (t) => t !== type,
                                );
                            handlePreferenceChange(
                              "allowedPropertyTypes",
                              newTypes,
                            );
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={type} className="capitalize text-sm">
                          {type}
                        </Label>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
