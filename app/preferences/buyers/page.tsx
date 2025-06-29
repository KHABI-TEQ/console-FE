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

        {/* Preferences Table */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-blue-600" />
              Buyer Preference Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Setting
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Description
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Value
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">
                      Auto-Match Notifications
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      Automatically notify buyers of matching properties
                    </td>
                    <td className="p-4">
                      <Switch
                        checked={preferences.autoMatchNotifications}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange(
                            "autoMatchNotifications",
                            checked,
                          )
                        }
                      />
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          preferences.autoMatchNotifications
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {preferences.autoMatchNotifications
                          ? "Enabled"
                          : "Disabled"}
                      </Badge>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Daily Digest</td>
                    <td className="p-4 text-sm text-gray-600">
                      Send daily summary of new matching properties
                    </td>
                    <td className="p-4">
                      <Switch
                        checked={preferences.dailyDigest}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("dailyDigest", checked)
                        }
                      />
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          preferences.dailyDigest
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {preferences.dailyDigest ? "Enabled" : "Disabled"}
                      </Badge>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Instant Alerts</td>
                    <td className="p-4 text-sm text-gray-600">
                      Send immediate notifications for high-priority matches
                    </td>
                    <td className="p-4">
                      <Switch
                        checked={preferences.instantAlerts}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("instantAlerts", checked)
                        }
                      />
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          preferences.instantAlerts
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {preferences.instantAlerts ? "Enabled" : "Disabled"}
                      </Badge>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Default Match Radius</td>
                    <td className="p-4 text-sm text-gray-600">
                      Default search radius for property matching
                    </td>
                    <td className="p-4">
                      <Select
                        value={preferences.matchRadius}
                        onValueChange={(value) =>
                          handlePreferenceChange("matchRadius", value)
                        }
                      >
                        <SelectTrigger className="w-32">
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
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">
                        {preferences.matchRadius} miles
                      </Badge>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Default Min Budget</td>
                    <td className="p-4 text-sm text-gray-600">
                      Default minimum budget for new buyers
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        value={preferences.defaultBudgetRange.min}
                        onChange={(e) =>
                          handlePreferenceChange("defaultBudgetRange", {
                            ...preferences.defaultBudgetRange,
                            min: e.target.value,
                          })
                        }
                        className="w-32"
                        placeholder="400000"
                      />
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">
                        $
                        {parseInt(
                          preferences.defaultBudgetRange.min,
                        ).toLocaleString()}
                      </Badge>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Default Max Budget</td>
                    <td className="p-4 text-sm text-gray-600">
                      Default maximum budget for new buyers
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        value={preferences.defaultBudgetRange.max}
                        onChange={(e) =>
                          handlePreferenceChange("defaultBudgetRange", {
                            ...preferences.defaultBudgetRange,
                            max: e.target.value,
                          })
                        }
                        className="w-32"
                        placeholder="800000"
                      />
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">
                        $
                        {parseInt(
                          preferences.defaultBudgetRange.max,
                        ).toLocaleString()}
                      </Badge>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Show Above Budget</td>
                    <td className="p-4 text-sm text-gray-600">
                      Include properties slightly above buyer's budget
                    </td>
                    <td className="p-4">
                      <Switch
                        checked={preferences.showAboveBudget}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("showAboveBudget", checked)
                        }
                      />
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          preferences.showAboveBudget
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {preferences.showAboveBudget ? "Enabled" : "Disabled"}
                      </Badge>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Minimum Agent Rating</td>
                    <td className="p-4 text-sm text-gray-600">
                      Required minimum rating for agent recommendations
                    </td>
                    <td className="p-4">
                      <Select
                        value={preferences.minimumRating}
                        onValueChange={(value) =>
                          handlePreferenceChange("minimumRating", value)
                        }
                      >
                        <SelectTrigger className="w-32">
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
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">
                        {preferences.minimumRating} stars
                      </Badge>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Email Notifications</td>
                    <td className="p-4 text-sm text-gray-600">
                      Send property matches via email
                    </td>
                    <td className="p-4">
                      <Switch
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("emailNotifications", checked)
                        }
                      />
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          preferences.emailNotifications
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {preferences.emailNotifications
                          ? "Enabled"
                          : "Disabled"}
                      </Badge>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">SMS Notifications</td>
                    <td className="p-4 text-sm text-gray-600">
                      Send urgent updates via SMS
                    </td>
                    <td className="p-4">
                      <Switch
                        checked={preferences.smsNotifications}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("smsNotifications", checked)
                        }
                      />
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          preferences.smsNotifications
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {preferences.smsNotifications ? "Enabled" : "Disabled"}
                      </Badge>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Push Notifications</td>
                    <td className="p-4 text-sm text-gray-600">
                      Mobile app notifications
                    </td>
                    <td className="p-4">
                      <Switch
                        checked={preferences.pushNotifications}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("pushNotifications", checked)
                        }
                      />
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          preferences.pushNotifications
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {preferences.pushNotifications ? "Enabled" : "Disabled"}
                      </Badge>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Require Pre-Approval</td>
                    <td className="p-4 text-sm text-gray-600">
                      Only show buyers pre-approved properties
                    </td>
                    <td className="p-4">
                      <Switch
                        checked={preferences.requirePreApproval}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("requirePreApproval", checked)
                        }
                      />
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          preferences.requirePreApproval
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {preferences.requirePreApproval
                          ? "Required"
                          : "Optional"}
                      </Badge>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">Verified Listings Only</td>
                    <td className="p-4 text-sm text-gray-600">
                      Show only verified property listings
                    </td>
                    <td className="p-4">
                      <Switch
                        checked={preferences.verifiedListingsOnly}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange(
                            "verifiedListingsOnly",
                            checked,
                          )
                        }
                      />
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          preferences.verifiedListingsOnly
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {preferences.verifiedListingsOnly
                          ? "Verified Only"
                          : "All Listings"}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
