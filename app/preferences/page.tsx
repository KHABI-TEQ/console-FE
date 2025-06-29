"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Bell,
  Mail,
  Shield,
  Palette,
  Globe,
  Clock,
  User,
  Building,
  Save,
  RefreshCw,
} from "lucide-react";

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState({
    // General Settings
    companyName: "PropertyAdmin",
    companyEmail: "admin@propertyadmin.com",
    timezone: "America/New_York",
    currency: "USD",
    language: "en",

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: true,

    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: "30",
    passwordExpiry: "90",

    // Display Settings
    theme: "light",
    sidebarCollapsed: false,
    compactMode: false,
    showTips: true,

    // Business Settings
    autoApprovalLimit: "50000",
    defaultCommission: "3",
    maxListingDays: "180",

    // Integration Settings
    mapsProvider: "google",
    paymentProvider: "stripe",
    emailProvider: "sendgrid",
  });

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    // Save preferences logic
    console.log("Saving preferences:", preferences);
    // You would typically call an API here
  };

  const handleReset = () => {
    // Reset to default values
    console.log("Resetting preferences");
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="System Preferences"
          description="Configure system settings, notifications, and business rules"
        >
          <Button variant="outline" onClick={handleReset}>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-gray-600" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={preferences.companyName}
                  onChange={(e) =>
                    handlePreferenceChange("companyName", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={preferences.companyEmail}
                  onChange={(e) =>
                    handlePreferenceChange("companyEmail", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={preferences.timezone}
                  onValueChange={(value) =>
                    handlePreferenceChange("timezone", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">
                      Eastern Time
                    </SelectItem>
                    <SelectItem value="America/Chicago">
                      Central Time
                    </SelectItem>
                    <SelectItem value="America/Denver">
                      Mountain Time
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      Pacific Time
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={preferences.currency}
                    onValueChange={(value) =>
                      handlePreferenceChange("currency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) =>
                      handlePreferenceChange("language", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-gray-600" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(value) =>
                    handlePreferenceChange("emailNotifications", value)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Browser push notifications
                  </p>
                </div>
                <Switch
                  checked={preferences.pushNotifications}
                  onCheckedChange={(value) =>
                    handlePreferenceChange("pushNotifications", value)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Text message notifications
                  </p>
                </div>
                <Switch
                  checked={preferences.smsNotifications}
                  onCheckedChange={(value) =>
                    handlePreferenceChange("smsNotifications", value)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-gray-600">
                    Product updates and newsletters
                  </p>
                </div>
                <Switch
                  checked={preferences.marketingEmails}
                  onCheckedChange={(value) =>
                    handlePreferenceChange("marketingEmails", value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-gray-600" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">
                    Extra security for your account
                  </p>
                </div>
                <Switch
                  checked={preferences.twoFactorAuth}
                  onCheckedChange={(value) =>
                    handlePreferenceChange("twoFactorAuth", value)
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={preferences.sessionTimeout}
                  onChange={(e) =>
                    handlePreferenceChange("sessionTimeout", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={preferences.passwordExpiry}
                  onChange={(e) =>
                    handlePreferenceChange("passwordExpiry", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2 text-gray-600" />
                Display Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) =>
                    handlePreferenceChange("theme", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-gray-600">
                    Reduce spacing and padding
                  </p>
                </div>
                <Switch
                  checked={preferences.compactMode}
                  onCheckedChange={(value) =>
                    handlePreferenceChange("compactMode", value)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Tips</Label>
                  <p className="text-sm text-gray-600">
                    Display helpful tips and hints
                  </p>
                </div>
                <Switch
                  checked={preferences.showTips}
                  onCheckedChange={(value) =>
                    handlePreferenceChange("showTips", value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Settings */}
          <Card className="border border-gray-200 shadow-sm lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-gray-600" />
                Business Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="autoApprovalLimit">
                    Auto Approval Limit ($)
                  </Label>
                  <Input
                    id="autoApprovalLimit"
                    type="number"
                    value={preferences.autoApprovalLimit}
                    onChange={(e) =>
                      handlePreferenceChange(
                        "autoApprovalLimit",
                        e.target.value,
                      )
                    }
                  />
                  <p className="text-xs text-gray-600">
                    Automatically approve transactions under this amount
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultCommission">
                    Default Commission (%)
                  </Label>
                  <Input
                    id="defaultCommission"
                    type="number"
                    step="0.1"
                    value={preferences.defaultCommission}
                    onChange={(e) =>
                      handlePreferenceChange(
                        "defaultCommission",
                        e.target.value,
                      )
                    }
                  />
                  <p className="text-xs text-gray-600">
                    Default commission rate for new agents
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxListingDays">Max Listing Days</Label>
                  <Input
                    id="maxListingDays"
                    type="number"
                    value={preferences.maxListingDays}
                    onChange={(e) =>
                      handlePreferenceChange("maxListingDays", e.target.value)
                    }
                  />
                  <p className="text-xs text-gray-600">
                    Maximum days a property can stay listed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Settings */}
          <Card className="border border-gray-200 shadow-sm lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-gray-600" />
                Integration Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mapsProvider">Maps Provider</Label>
                  <Select
                    value={preferences.mapsProvider}
                    onValueChange={(value) =>
                      handlePreferenceChange("mapsProvider", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Maps</SelectItem>
                      <SelectItem value="mapbox">Mapbox</SelectItem>
                      <SelectItem value="openstreet">OpenStreetMap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentProvider">Payment Provider</Label>
                  <Select
                    value={preferences.paymentProvider}
                    onValueChange={(value) =>
                      handlePreferenceChange("paymentProvider", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailProvider">Email Provider</Label>
                  <Select
                    value={preferences.emailProvider}
                    onValueChange={(value) =>
                      handlePreferenceChange("emailProvider", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
