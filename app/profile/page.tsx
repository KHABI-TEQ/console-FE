"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  Activity,
  Clock,
  Settings,
  Lock,
  Smartphone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { apiService } from "@/lib/services/apiService";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";

interface ProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  isAccountVerified: boolean;
  isAccountInRecovery: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  department: string;
  location: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const { user, updateUser } = useAuth();
  const { addNotification } = useApp();

  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    department: "Administration",
    location: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [settings, setSettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    systemAlerts: true,
    marketingEmails: false,
    profileVisibility: "team",
    showEmail: false,
    showPhone: false,
    activityTracking: true,
  });

  // Fetch profile data
  const {
    data: profileData,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery<{ success: boolean; admin: ProfileData }>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await apiService.getProfile();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch profile");
      }
      return response;
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<ProfileFormData>) => {
      const response = await apiService.put("/profile", data);
      if (!response.success) {
        throw new Error(response.error || "Failed to update profile");
      }
      return response;
    },
    onSuccess: (data) => {
      addNotification({
        type: "success",
        title: "Profile Updated",
        message: "Your profile has been updated successfully.",
      });

      // Update user context if available
      if (user && data.data) {
        updateUser({
          name: `${data.data.firstName || profileForm.firstName} ${data.data.lastName || profileForm.lastName}`,
          email: data.data.email || profileForm.email,
          firstName: data.data.firstName || profileForm.firstName,
          lastName: data.data.lastName || profileForm.lastName,
        });
      }

      setIsEditing(false);
      refetchProfile();
    },
    onError: (error: Error) => {
      addNotification({
        type: "error",
        title: "Update Failed",
        message: error.message,
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordChangeData) => {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      const response = await apiService.post("/profile/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to change password");
      }
      return response;
    },
    onSuccess: () => {
      addNotification({
        type: "success",
        title: "Password Changed",
        message: "Your password has been changed successfully.",
      });
      setIsChangePasswordOpen(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: "error",
        title: "Password Change Failed",
        message: error.message,
      });
    },
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profileData?.admin) {
      const admin = profileData.admin;
      setProfileForm({
        firstName: admin.firstName || "",
        lastName: admin.lastName || "",
        email: admin.email || "",
        phoneNumber: admin.phoneNumber || "",
        bio: "",
        department: "Administration",
        location: "",
      });
    }
  }, [profileData]);

  const handleProfileUpdate = () => {
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordChange = () => {
    changePasswordMutation.mutate(passwordForm);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAccountAge = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? "s" : ""}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}` : ""}`;
    }
  };

  if (profileLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const admin = profileData?.admin;

  if (!admin) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Profile Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              Unable to load your profile information.
            </p>
            <Button onClick={() => refetchProfile()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
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
            disabled={!isEditing || updateProfileMutation.isPending}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {updateProfileMutation.isPending ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
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
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
                      {admin.firstName[0]}
                      {admin.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={() => {
                          addNotification({
                            type: "info",
                            title: "Feature Coming Soon",
                            message:
                              "Avatar upload functionality will be available soon.",
                          });
                        }}
                      />
                    </label>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">
                    {admin.firstName} {admin.lastName}
                  </h3>
                  <p className="text-gray-600 capitalize">{admin.role}</p>
                  <Badge
                    variant="outline"
                    className={
                      admin.isAccountVerified
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }
                  >
                    {admin.isAccountVerified ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Unverified
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Age</span>
                  <span className="font-medium">
                    {getAccountAge(admin.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="font-medium text-sm">
                    {formatDate(admin.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="font-medium text-sm">
                    {formatDate(admin.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Security Status */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium text-sm">Account Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Email Verified
                    </span>
                    <Badge
                      className={
                        admin.isAccountVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {admin.isAccountVerified ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Account Recovery
                    </span>
                    <Badge
                      className={
                        admin.isAccountInRecovery
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {admin.isAccountInRecovery ? "Active" : "None"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
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
                          value={profileForm.firstName}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
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
                          value={profileForm.lastName}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
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
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileForm.phoneNumber}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            phoneNumber: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select
                          value={profileForm.department}
                          onValueChange={(value) =>
                            setProfileForm((prev) => ({
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
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileForm.location}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          placeholder="Your location"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        rows={3}
                        placeholder="Tell us about yourself..."
                      />
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
                          checked={settings.twoFactorEnabled}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({
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
                          checked={settings.loginNotifications}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({
                              ...prev,
                              loginNotifications: checked,
                            }))
                          }
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
                      <Dialog
                        open={isChangePasswordOpen}
                        onOpenChange={setIsChangePasswordOpen}
                      >
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
                                value={passwordForm.currentPassword}
                                onChange={(e) =>
                                  setPasswordForm((prev) => ({
                                    ...prev,
                                    currentPassword: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                value={passwordForm.newPassword}
                                onChange={(e) =>
                                  setPasswordForm((prev) => ({
                                    ...prev,
                                    newPassword: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">
                                Confirm New Password
                              </Label>
                              <Input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                value={passwordForm.confirmPassword}
                                onChange={(e) =>
                                  setPasswordForm((prev) => ({
                                    ...prev,
                                    confirmPassword: e.target.value,
                                  }))
                                }
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
                            <Button
                              variant="outline"
                              onClick={() => setIsChangePasswordOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handlePasswordChange}
                              disabled={changePasswordMutation.isPending}
                            >
                              {changePasswordMutation.isPending ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              ) : null}
                              Change Password
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
                          checked={settings.emailNotifications}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({
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
                          checked={settings.pushNotifications}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({
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
                          checked={settings.smsNotifications}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({
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
                          checked={settings.weeklyReports}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({
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
                          checked={settings.systemAlerts}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({
                              ...prev,
                              systemAlerts: checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      Account Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Account created</p>
                            <p className="text-sm text-gray-600">
                              Your admin account was created
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(admin.createdAt)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Profile updated</p>
                            <p className="text-sm text-gray-600">
                              Last profile modification
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(admin.updatedAt)}
                        </span>
                      </div>
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
