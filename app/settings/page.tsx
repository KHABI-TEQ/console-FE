"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Key,
  Database,
  Code,
  Webhook,
  CreditCard,
  MapPin,
  Phone,
  Monitor,
  Smartphone,
  Tablet,
  Server,
  Cloud,
  FileText,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  X,
  Copy,
  ExternalLink,
  RotateCcw,
  Zap,
  Lock,
  Unlock,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const [settings, setSettings] = useState({
    // General Settings
    companyName: "PropertyAdmin Pro",
    companyEmail: "admin@propertyadmin.com",
    companyPhone: "+1 (555) 123-4567",
    companyAddress: "123 Business Ave, New York, NY 10001",
    timezone: "America/New_York",
    currency: "USD",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12",

    // System Settings
    maxUploadSize: "10",
    sessionTimeout: "30",
    autoBackup: true,
    backupFrequency: "daily",
    logLevel: "info",
    debugMode: false,
    maintenanceMode: false,
    cacheEnabled: true,
    compressionEnabled: true,

    // Security Settings
    twoFactorRequired: false,
    passwordMinLength: "8",
    passwordExpiry: "90",
    maxLoginAttempts: "5",
    lockoutDuration: "15",
    ipWhitelist: [],
    sslRedirect: true,
    corsEnabled: true,

    // Email Settings
    emailProvider: "sendgrid",
    smtpHost: "smtp.sendgrid.net",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    emailFromName: "PropertyAdmin",
    emailFromAddress: "noreply@propertyadmin.com",
    emailSignature: "Best regards,\nPropertyAdmin Team",

    // Payment Settings
    paymentProvider: "stripe",
    stripePublicKey: "",
    stripeSecretKey: "",
    paypalClientId: "",
    paypalSecret: "",
    commissionRate: "3.5",
    processingFee: "2.9",

    // API Settings
    rateLimitEnabled: true,
    rateLimit: "1000",
    apiVersion: "v1",
    webhookSecret: "",
    allowedOrigins: ["localhost:3000", "propertyadmin.com"],

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    slackIntegration: false,
    slackWebhook: "",
    discordIntegration: false,
    discordWebhook: "",

    // Theme Settings
    theme: "light",
    primaryColor: "#3B82F6",
    secondaryColor: "#6B7280",
    accentColor: "#F59E0B",
    borderRadius: "8",
    fontFamily: "Inter",
    compactMode: false,
  });

  const [apiKeys, setApiKeys] = useState([
    {
      id: "1",
      name: "Mobile App API",
      key: "pk_live_*********************",
      permissions: ["read", "write"],
      lastUsed: "2024-02-15 14:30",
      status: "active",
    },
    {
      id: "2",
      name: "Integration API",
      key: "pk_test_*********************",
      permissions: ["read"],
      lastUsed: "2024-02-14 09:15",
      status: "active",
    },
    {
      id: "3",
      name: "Backup Service",
      key: "pk_backup_*******************",
      permissions: ["read", "backup"],
      lastUsed: "2024-02-13 02:00",
      status: "inactive",
    },
  ]);

  const [connectedServices, setConnectedServices] = useState([
    {
      name: "Google Maps",
      status: "connected",
      lastSync: "2024-02-16 10:00",
      apiUsage: "87%",
    },
    {
      name: "Stripe Payments",
      status: "connected",
      lastSync: "2024-02-16 09:45",
      apiUsage: "23%",
    },
    {
      name: "SendGrid Email",
      status: "connected",
      lastSync: "2024-02-16 08:30",
      apiUsage: "45%",
    },
    {
      name: "Twilio SMS",
      status: "disconnected",
      lastSync: "Never",
      apiUsage: "0%",
    },
    {
      name: "Slack Notifications",
      status: "error",
      lastSync: "2024-02-15 16:20",
      apiUsage: "N/A",
    },
  ]);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving settings:", settings);
  };

  const handleReset = () => {
    console.log("Resetting settings");
  };

  const handleMaintenanceMode = (enabled: boolean) => {
    setIsMaintenanceMode(enabled);
    setSettings((prev) => ({ ...prev, maintenanceMode: enabled }));
  };

  const generateApiKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: "New API Key",
      key: `pk_live_${Math.random().toString(36).substring(2, 15)}`,
      permissions: ["read"],
      lastUsed: "Never",
      status: "active",
    };
    setApiKeys((prev) => [...prev, newKey]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      case "disconnected":
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <X className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="System Settings"
          description="Configure system preferences, security, integrations, and advanced settings"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className={
                  isMaintenanceMode
                    ? "bg-red-50 text-red-700 border-red-200"
                    : ""
                }
              >
                {isMaintenanceMode ? (
                  <Unlock className="h-4 w-4 mr-2" />
                ) : (
                  <Lock className="h-4 w-4 mr-2" />
                )}
                {isMaintenanceMode ? "Exit Maintenance" : "Maintenance Mode"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isMaintenanceMode
                    ? "Exit Maintenance Mode"
                    : "Enable Maintenance Mode"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isMaintenanceMode
                    ? "This will make the system accessible to all users again."
                    : "This will temporarily disable the system for all users except administrators."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleMaintenanceMode(!isMaintenanceMode)}
                  className={
                    isMaintenanceMode
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }
                >
                  {isMaintenanceMode
                    ? "Exit Maintenance"
                    : "Enable Maintenance"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

        {isMaintenanceMode && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">
                    Maintenance Mode Active
                  </p>
                  <p className="text-sm text-red-700">
                    The system is currently in maintenance mode. Only
                    administrators can access the application.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) =>
                        handleSettingChange(
                          "general",
                          "companyName",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Company Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={settings.companyEmail}
                      onChange={(e) =>
                        handleSettingChange(
                          "general",
                          "companyEmail",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Company Phone</Label>
                    <Input
                      id="companyPhone"
                      value={settings.companyPhone}
                      onChange={(e) =>
                        handleSettingChange(
                          "general",
                          "companyPhone",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Company Address</Label>
                    <Textarea
                      id="companyAddress"
                      value={settings.companyAddress}
                      onChange={(e) =>
                        handleSettingChange(
                          "general",
                          "companyAddress",
                          e.target.value,
                        )
                      }
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Localization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) =>
                        handleSettingChange("general", "timezone", value)
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
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={settings.currency}
                      onValueChange={(value) =>
                        handleSettingChange("general", "currency", value)
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
                      value={settings.language}
                      onValueChange={(value) =>
                        handleSettingChange("general", "language", value)
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select
                        value={settings.dateFormat}
                        onValueChange={(value) =>
                          handleSettingChange("general", "dateFormat", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Time Format</Label>
                      <Select
                        value={settings.timeFormat}
                        onValueChange={(value) =>
                          handleSettingChange("general", "timeFormat", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12 Hour</SelectItem>
                          <SelectItem value="24">24 Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                    <Input
                      id="maxUploadSize"
                      type="number"
                      value={settings.maxUploadSize}
                      onChange={(e) =>
                        handleSettingChange(
                          "system",
                          "maxUploadSize",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">
                      Session Timeout (minutes)
                    </Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) =>
                        handleSettingChange(
                          "system",
                          "sessionTimeout",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logLevel">Log Level</Label>
                    <Select
                      value={settings.logLevel}
                      onValueChange={(value) =>
                        handleSettingChange("system", "logLevel", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    System Toggles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Backup</Label>
                      <p className="text-sm text-gray-600">
                        Automatically backup system data
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) =>
                        handleSettingChange("system", "autoBackup", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-gray-600">
                        Enable debug logging and error details
                      </p>
                    </div>
                    <Switch
                      checked={settings.debugMode}
                      onCheckedChange={(checked) =>
                        handleSettingChange("system", "debugMode", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Cache Enabled</Label>
                      <p className="text-sm text-gray-600">
                        Enable application caching
                      </p>
                    </div>
                    <Switch
                      checked={settings.cacheEnabled}
                      onCheckedChange={(checked) =>
                        handleSettingChange("system", "cacheEnabled", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compression</Label>
                      <p className="text-sm text-gray-600">
                        Enable response compression
                      </p>
                    </div>
                    <Switch
                      checked={settings.compressionEnabled}
                      onCheckedChange={(checked) =>
                        handleSettingChange(
                          "system",
                          "compressionEnabled",
                          checked,
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Two-Factor Auth</Label>
                      <p className="text-sm text-gray-600">
                        Require 2FA for all users
                      </p>
                    </div>
                    <Switch
                      checked={settings.twoFactorRequired}
                      onCheckedChange={(checked) =>
                        handleSettingChange(
                          "security",
                          "twoFactorRequired",
                          checked,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">
                      Minimum Password Length
                    </Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) =>
                        handleSettingChange(
                          "security",
                          "passwordMinLength",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">
                      Password Expiry (days)
                    </Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      value={settings.passwordExpiry}
                      onChange={(e) =>
                        handleSettingChange(
                          "security",
                          "passwordExpiry",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    Access Control
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) =>
                        handleSettingChange(
                          "security",
                          "maxLoginAttempts",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lockoutDuration">
                      Lockout Duration (minutes)
                    </Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      value={settings.lockoutDuration}
                      onChange={(e) =>
                        handleSettingChange(
                          "security",
                          "lockoutDuration",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SSL Redirect</Label>
                      <p className="text-sm text-gray-600">
                        Force HTTPS connections
                      </p>
                    </div>
                    <Switch
                      checked={settings.sslRedirect}
                      onCheckedChange={(checked) =>
                        handleSettingChange("security", "sslRedirect", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>CORS Enabled</Label>
                      <p className="text-sm text-gray-600">
                        Enable cross-origin requests
                      </p>
                    </div>
                    <Switch
                      checked={settings.corsEnabled}
                      onCheckedChange={(checked) =>
                        handleSettingChange("security", "corsEnabled", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      API Keys
                    </div>
                    <Button onClick={generateApiKey}>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate New Key
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Key</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">
                            {key.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {key.key}
                              </code>
                              <Button size="sm" variant="ghost">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {key.permissions.map((perm, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {key.lastUsed}
                          </TableCell>
                          <TableCell>{getStatusBadge(key.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Rate Limiting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Rate Limiting</Label>
                        <p className="text-sm text-gray-600">
                          Enable API rate limiting
                        </p>
                      </div>
                      <Switch
                        checked={settings.rateLimitEnabled}
                        onCheckedChange={(checked) =>
                          handleSettingChange(
                            "api",
                            "rateLimitEnabled",
                            checked,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rateLimit">Requests per hour</Label>
                      <Input
                        id="rateLimit"
                        type="number"
                        value={settings.rateLimit}
                        onChange={(e) =>
                          handleSettingChange(
                            "api",
                            "rateLimit",
                            e.target.value,
                          )
                        }
                        disabled={!settings.rateLimitEnabled}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Webhook className="h-5 w-5 mr-2" />
                      Webhooks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhookSecret">Webhook Secret</Label>
                      <Input
                        id="webhookSecret"
                        type="password"
                        value={settings.webhookSecret}
                        onChange={(e) =>
                          handleSettingChange(
                            "api",
                            "webhookSecret",
                            e.target.value,
                          )
                        }
                        placeholder="Enter webhook secret"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiVersion">API Version</Label>
                      <Select
                        value={settings.apiVersion}
                        onValueChange={(value) =>
                          handleSettingChange("api", "apiVersion", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="v1">v1 (Current)</SelectItem>
                          <SelectItem value="v2">v2 (Beta)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cloud className="h-5 w-5 mr-2" />
                  Connected Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Sync</TableHead>
                      <TableHead>API Usage</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {connectedServices.map((service, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {service.name}
                        </TableCell>
                        <TableCell>{getStatusBadge(service.status)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {service.lastSync}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: service.apiUsage }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {service.apiUsage}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailProvider">Email Provider</Label>
                    <Select
                      value={settings.emailProvider}
                      onValueChange={(value) =>
                        handleSettingChange("email", "emailProvider", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="ses">Amazon SES</SelectItem>
                        <SelectItem value="smtp">Custom SMTP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailFromName">From Name</Label>
                    <Input
                      id="emailFromName"
                      value={settings.emailFromName}
                      onChange={(e) =>
                        handleSettingChange(
                          "email",
                          "emailFromName",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailFromAddress">From Address</Label>
                    <Input
                      id="emailFromAddress"
                      type="email"
                      value={settings.emailFromAddress}
                      onChange={(e) =>
                        handleSettingChange(
                          "email",
                          "emailFromAddress",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    SMTP Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost}
                      onChange={(e) =>
                        handleSettingChange("email", "smtpHost", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={settings.smtpPort}
                      onChange={(e) =>
                        handleSettingChange("email", "smtpPort", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      value={settings.smtpUser}
                      onChange={(e) =>
                        handleSettingChange("email", "smtpUser", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) =>
                        handleSettingChange(
                          "email",
                          "smtpPassword",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Email Signature</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={settings.emailSignature}
                  onChange={(e) =>
                    handleSettingChange(
                      "email",
                      "emailSignature",
                      e.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Enter your email signature..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Provider
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentProvider">Provider</Label>
                    <Select
                      value={settings.paymentProvider}
                      onValueChange={(value) =>
                        handleSettingChange(
                          "payments",
                          "paymentProvider",
                          value,
                        )
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
                  {settings.paymentProvider === "stripe" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="stripePublicKey">
                          Stripe Public Key
                        </Label>
                        <Input
                          id="stripePublicKey"
                          value={settings.stripePublicKey}
                          onChange={(e) =>
                            handleSettingChange(
                              "payments",
                              "stripePublicKey",
                              e.target.value,
                            )
                          }
                          placeholder="pk_test_..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stripeSecretKey">
                          Stripe Secret Key
                        </Label>
                        <Input
                          id="stripeSecretKey"
                          type="password"
                          value={settings.stripeSecretKey}
                          onChange={(e) =>
                            handleSettingChange(
                              "payments",
                              "stripeSecretKey",
                              e.target.value,
                            )
                          }
                          placeholder="sk_test_..."
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Fee Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      step="0.1"
                      value={settings.commissionRate}
                      onChange={(e) =>
                        handleSettingChange(
                          "payments",
                          "commissionRate",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="processingFee">Processing Fee (%)</Label>
                    <Input
                      id="processingFee"
                      type="number"
                      step="0.1"
                      value={settings.processingFee}
                      onChange={(e) =>
                        handleSettingChange(
                          "payments",
                          "processingFee",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Theme Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) =>
                        handleSettingChange("appearance", "theme", value)
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
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) =>
                          handleSettingChange(
                            "appearance",
                            "primaryColor",
                            e.target.value,
                          )
                        }
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) =>
                          handleSettingChange(
                            "appearance",
                            "primaryColor",
                            e.target.value,
                          )
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select
                      value={settings.fontFamily}
                      onValueChange={(value) =>
                        handleSettingChange("appearance", "fontFamily", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="h-5 w-5 mr-2" />
                    Layout Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="borderRadius">Border Radius (px)</Label>
                    <Input
                      id="borderRadius"
                      type="number"
                      value={settings.borderRadius}
                      onChange={(e) =>
                        handleSettingChange(
                          "appearance",
                          "borderRadius",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-gray-600">
                        Reduce spacing and padding throughout the app
                      </p>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) =>
                        handleSettingChange(
                          "appearance",
                          "compactMode",
                          checked,
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
