"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Key,
  Bell,
  Eye,
  EyeOff,
  Camera,
  Save,
  RefreshCw,
  Edit,
  Trash2,
  Plus,
  Activity,
  Clock,
  Building,
  Users,
  DollarSign,
  Star,
  Settings,
  Lock,
  Smartphone,
  Globe,
  Download,
  Upload,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    // Personal Information
    firstName: "John",
    lastName: "Admin",
    email: "john.admin@propertyadmin.com",
    phone: "+1 (555) 123-4567",
    title: "Senior Property Administrator",
    department: "Administration",
    location: "New York, NY",
    bio: "Experienced property management professional with over 8 years in real estate administration and team leadership.",
    avatar: "/placeholder.svg",

    // Account Settings
    username: "johnadmin",
    language: "en",
    timezone: "America/New_York",

    // Security Settings
    twoFactorEnabled: true,
    loginNotifications: true,
    sessionTimeout: "30",

    // Notification Preferences
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    systemAlerts: true,
    marketingEmails: false,

    // Privacy Settings
    profileVisibility: "team",
    showEmail: false,
    showPhone: false,
    activityTracking: true,
  });

  const [stats] = useState({
    accountAge: "2 years, 3 months",
    lastLogin: "2024-02-16 09:23 AM",
    totalLogins: 1247,
    propertiesManaged: 156,
    agentsSupervised: 23,
    reportsGenerated: 89,
    avgResponseTime: "12 minutes",
  });

  const [recentActivity] = useState([
    {
      action: "Generated monthly report",
      time: "2 hours ago",
      type: "report",
    },
    {
      action: "Approved agent application",
      time: "5 hours ago",
      type: "approval",
    },
    {
      action: "Updated property listing",
      time: "1 day ago",
      type: "property",
    },
    {
      action: "Conducted team meeting",
      time: "2 days ago",
      type: "meeting",
    },
    {
      action: "Reviewed inspection reports",
      time: "3 days ago",
      type: "inspection",
    },
  ]);

  const handleProfileUpdate = () => {
    // Handle profile update logic
    console.log("Updating profile:", profile);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    // Handle password change logic
    console.log("Changing password");
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic
      console.log("Uploading avatar:", file);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Profile Settings"
          description="Manage your account settings, preferences, and security options"
        >
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
          <Button
            onClick={handleProfileUpdate}
            disabled={!isEditing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </PageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
                      {profile.firstName[0]}
                      {profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-gray-600">{profile.title}</p>
                  <Badge variant="outline" className="mt-2">
                    {profile.department}
                  </Badge>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Age</span>
                  <span className="font-medium">{stats.accountAge}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="font-medium text-sm">{stats.lastLogin}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Logins</span>
                  <span className="font-medium">
                    {stats.totalLogins.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Properties Managed
                  </span>
                  <span className="font-medium">{stats.propertiesManaged}</span>
                </div>
              </div>

              {/* Security Status */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium text-sm">Security Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Two-Factor Auth
                    </span>
                    <Badge
                      className={
                        profile.twoFactorEnabled
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {profile.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Session Timeout
                    </span>
                    <span className="text-sm font-medium">
                      {profile.sessionTimeout} min
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          value={profile.title}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select
                          value={profile.department}
                          onValueChange={(value) =>
                            setProfile((prev) => ({
                              ...prev,
                              department: value,
                            }))
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Administration">
                              Administration
                            </SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={profile.language}
                          onValueChange={(value) =>
                            setProfile((prev) => ({ ...prev, language: value }))
                          }
                          disabled={!isEditing}
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
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={profile.timezone}
                          onValueChange={(value) =>
                            setProfile((prev) => ({ ...prev, timezone: value }))
                          }
                          disabled={!isEditing}
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
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium">Privacy Settings</h4>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Profile Visibility</Label>
                            <p className="text-sm text-gray-600">
                              Who can see your profile information
                            </p>
                          </div>
                          <Select
                            value={profile.profileVisibility}
                            onValueChange={(value) =>
                              setProfile((prev) => ({
                                ...prev,
                                profileVisibility: value,
                              }))
                            }
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="team">Team Only</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Show Email</Label>
                            <p className="text-sm text-gray-600">
                              Display email in your profile
                            </p>
                          </div>
                          <Switch
                            checked={profile.showEmail}
                            onCheckedChange={(checked) =>
                              setProfile((prev) => ({
                                ...prev,
                                showEmail: checked,
                              }))
                            }
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Show Phone</Label>
                            <p className="text-sm text-gray-600">
                              Display phone number in your profile
                            </p>
                          </div>
                          <Switch
                            checked={profile.showPhone}
                            onCheckedChange={(checked) =>
                              setProfile((prev) => ({
                                ...prev,
                                showPhone: checked,
                              }))
                            }
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Activity Tracking</Label>
                            <p className="text-sm text-gray-600">
                              Allow system to track your activity
                            </p>
                          </div>
                          <Switch
                            checked={profile.activityTracking}
                            onCheckedChange={(checked) =>
                              setProfile((prev) => ({
                                ...prev,
                                activityTracking: checked,
                              }))
                            }
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-gray-600">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch
                          checked={profile.twoFactorEnabled}
                          onCheckedChange={(checked) =>
                            setProfile((prev) => ({
                              ...prev,
                              twoFactorEnabled: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Login Notifications</Label>
                          <p className="text-sm text-gray-600">
                            Get notified of new login attempts
                          </p>
                        </div>
                        <Switch
                          checked={profile.loginNotifications}
                          onCheckedChange={(checked) =>
                            setProfile((prev) => ({
                              ...prev,
                              loginNotifications: checked,
                            }))
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
                          value={profile.sessionTimeout}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              sessionTimeout: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Key className="h-5 w-5 mr-2" />
                        Password & Authentication
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <Lock className="h-4 w-4 mr-2" />
                            Change Password
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                              Enter your current password and choose a new one.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">
                                Current Password
                              </Label>
                              <Input
                                id="currentPassword"
                                type={showPassword ? "text" : "password"}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">
                                Confirm New Password
                              </Label>
                              <Input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={showPassword}
                                onCheckedChange={setShowPassword}
                              />
                              <Label>Show passwords</Label>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button onClick={handlePasswordChange}>
                              Change Password
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Backup Codes
                      </Button>

                      <Button variant="outline" className="w-full">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Manage Connected Devices
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Communication Preferences</h4>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-gray-600">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          checked={profile.emailNotifications}
                          onCheckedChange={(checked) =>
                            setProfile((prev) => ({
                              ...prev,
                              emailNotifications: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-gray-600">
                            Browser push notifications
                          </p>
                        </div>
                        <Switch
                          checked={profile.pushNotifications}
                          onCheckedChange={(checked) =>
                            setProfile((prev) => ({
                              ...prev,
                              pushNotifications: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-gray-600">
                            Text message notifications
                          </p>
                        </div>
                        <Switch
                          checked={profile.smsNotifications}
                          onCheckedChange={(checked) =>
                            setProfile((prev) => ({
                              ...prev,
                              smsNotifications: checked,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium">Content Preferences</h4>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Weekly Reports</Label>
                          <p className="text-sm text-gray-600">
                            Receive weekly performance reports
                          </p>
                        </div>
                        <Switch
                          checked={profile.weeklyReports}
                          onCheckedChange={(checked) =>
                            setProfile((prev) => ({
                              ...prev,
                              weeklyReports: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>System Alerts</Label>
                          <p className="text-sm text-gray-600">
                            Important system updates and alerts
                          </p>
                        </div>
                        <Switch
                          checked={profile.systemAlerts}
                          onCheckedChange={(checked) =>
                            setProfile((prev) => ({
                              ...prev,
                              systemAlerts: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Marketing Emails</Label>
                          <p className="text-sm text-gray-600">
                            Product updates and promotional content
                          </p>
                        </div>
                        <Switch
                          checked={profile.marketingEmails}
                          onCheckedChange={(checked) =>
                            setProfile((prev) => ({
                              ...prev,
                              marketingEmails: checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-5 w-5 mr-2" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Properties Managed
                          </span>
                          <span className="font-semibold">
                            {stats.propertiesManaged}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Agents Supervised
                          </span>
                          <span className="font-semibold">
                            {stats.agentsSupervised}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Reports Generated
                          </span>
                          <span className="font-semibold">
                            {stats.reportsGenerated}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Avg Response Time
                          </span>
                          <span className="font-semibold">
                            {stats.avgResponseTime}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 text-sm"
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                activity.type === "report"
                                  ? "bg-blue-500"
                                  : activity.type === "approval"
                                    ? "bg-green-500"
                                    : activity.type === "property"
                                      ? "bg-purple-500"
                                      : activity.type === "meeting"
                                        ? "bg-orange-500"
                                        : "bg-gray-500"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-gray-500 text-xs">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                      >
                        <Download className="h-6 w-6" />
                        <span>Export Data</span>
                        <span className="text-xs text-gray-500">
                          Download your account data
                        </span>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                      >
                        <RefreshCw className="h-6 w-6" />
                        <span>Reset Preferences</span>
                        <span className="text-xs text-gray-500">
                          Restore default settings
                        </span>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center space-y-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-6 w-6" />
                            <span>Delete Account</span>
                            <span className="text-xs text-gray-500">
                              Permanently delete account
                            </span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Account</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove all
                              associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
