"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Settings,
  Users,
  Building,
  UserCheck,
  Save,
  RefreshCw,
  Heart,
  DollarSign,
  MapPin,
  Bell,
  Mail,
  Phone,
  Home,
  Filter,
  Search,
} from "lucide-react";

export default function PreferencesPage() {
  const [buyerPreferences, setBuyerPreferences] = useState({
    autoMatchNotifications: true,
    dailyDigest: true,
    instantAlerts: false,
    matchRadius: "25",
    defaultBudgetMin: "400000",
    defaultBudgetMax: "800000",
    showAboveBudget: false,
    minimumRating: "4.0",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    requirePreApproval: false,
    verifiedListingsOnly: true,
  });

  const [tenantPreferences, setTenantPreferences] = useState({
    autoMatchNotifications: true,
    dailyDigest: false,
    instantAlerts: true,
    matchRadius: "15",
    defaultBudgetMin: "1500",
    defaultBudgetMax: "4000",
    showAboveBudget: true,
    minimumRating: "4.2",
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    requirePreApproval: true,
    verifiedListingsOnly: true,
    petFriendly: false,
    furnished: false,
    shortTermRental: false,
  });

  const [developerPreferences, setDeveloperPreferences] = useState({
    autoMatchNotifications: false,
    dailyDigest: true,
    instantAlerts: false,
    portfolioSize: "50",
    investmentBudgetMin: "5000000",
    investmentBudgetMax: "25000000",
    showOpportunities: true,
    minimumROI: "8",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: false,
    requireMarketAnalysis: true,
    verifiedProjects: true,
    newDevelopments: true,
    commercialOnly: false,
    residentialOnly: false,
  });

  const handleBuyerChange = (key: string, value: any) => {
    setBuyerPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleTenantChange = (key: string, value: any) => {
    setTenantPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeveloperChange = (key: string, value: any) => {
    setDeveloperPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Saving all preferences:", {
      buyer: buyerPreferences,
      tenant: tenantPreferences,
      developer: developerPreferences,
    });
  };

  const handleReset = () => {
    console.log("Resetting preferences");
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Preference Management"
          description="Configure preferences for buyers, tenants, and developers in tabular format"
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
            Save All Changes
          </Button>
        </PageHeader>

        <Tabs defaultValue="buyers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="buyers" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Buyer Preferences</span>
            </TabsTrigger>
            <TabsTrigger
              value="tenants"
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Tenant Preferences</span>
            </TabsTrigger>
            <TabsTrigger
              value="developers"
              className="flex items-center space-x-2"
            >
              <Building className="h-4 w-4" />
              <span>Developer Preferences</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buyers" className="mt-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
                  Buyer Preference Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">
                          Setting
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Description
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Value/Control
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Auto-Match Notifications
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Automatically notify buyers of matching properties
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={buyerPreferences.autoMatchNotifications}
                            onCheckedChange={(checked) =>
                              handleBuyerChange(
                                "autoMatchNotifications",
                                checked,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              buyerPreferences.autoMatchNotifications
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {buyerPreferences.autoMatchNotifications
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Daily Digest
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Send daily summary of new matching properties
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={buyerPreferences.dailyDigest}
                            onCheckedChange={(checked) =>
                              handleBuyerChange("dailyDigest", checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              buyerPreferences.dailyDigest
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {buyerPreferences.dailyDigest
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Default Match Radius
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Default search radius for property matching
                        </TableCell>
                        <TableCell>
                          <Select
                            value={buyerPreferences.matchRadius}
                            onValueChange={(value) =>
                              handleBuyerChange("matchRadius", value)
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
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {buyerPreferences.matchRadius} miles
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Default Min Budget
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Default minimum budget for new buyers
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={buyerPreferences.defaultBudgetMin}
                            onChange={(e) =>
                              handleBuyerChange(
                                "defaultBudgetMin",
                                e.target.value,
                              )
                            }
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            $
                            {parseInt(
                              buyerPreferences.defaultBudgetMin,
                            ).toLocaleString()}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Default Max Budget
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Default maximum budget for new buyers
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={buyerPreferences.defaultBudgetMax}
                            onChange={(e) =>
                              handleBuyerChange(
                                "defaultBudgetMax",
                                e.target.value,
                              )
                            }
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            $
                            {parseInt(
                              buyerPreferences.defaultBudgetMax,
                            ).toLocaleString()}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Email Notifications
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Send property matches via email
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={buyerPreferences.emailNotifications}
                            onCheckedChange={(checked) =>
                              handleBuyerChange("emailNotifications", checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              buyerPreferences.emailNotifications
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {buyerPreferences.emailNotifications
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Minimum Agent Rating
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Required minimum rating for agent recommendations
                        </TableCell>
                        <TableCell>
                          <Select
                            value={buyerPreferences.minimumRating}
                            onValueChange={(value) =>
                              handleBuyerChange("minimumRating", value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3.0">3.0 stars</SelectItem>
                              <SelectItem value="4.0">4.0 stars</SelectItem>
                              <SelectItem value="4.5">4.5 stars</SelectItem>
                              <SelectItem value="5.0">5.0 stars</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {buyerPreferences.minimumRating} stars
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Verified Listings Only
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Show only verified property listings
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={buyerPreferences.verifiedListingsOnly}
                            onCheckedChange={(checked) =>
                              handleBuyerChange("verifiedListingsOnly", checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              buyerPreferences.verifiedListingsOnly
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {buyerPreferences.verifiedListingsOnly
                              ? "Verified Only"
                              : "All Listings"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenants" className="mt-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Tenant Preference Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">
                          Setting
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Description
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Value/Control
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Auto-Match Notifications
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Automatically notify tenants of matching properties
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={tenantPreferences.autoMatchNotifications}
                            onCheckedChange={(checked) =>
                              handleTenantChange(
                                "autoMatchNotifications",
                                checked,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              tenantPreferences.autoMatchNotifications
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {tenantPreferences.autoMatchNotifications
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Instant Alerts
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Send immediate notifications for urgent rental
                          opportunities
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={tenantPreferences.instantAlerts}
                            onCheckedChange={(checked) =>
                              handleTenantChange("instantAlerts", checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              tenantPreferences.instantAlerts
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {tenantPreferences.instantAlerts
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Default Match Radius
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Default search radius for rental matching
                        </TableCell>
                        <TableCell>
                          <Select
                            value={tenantPreferences.matchRadius}
                            onValueChange={(value) =>
                              handleTenantChange("matchRadius", value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 miles</SelectItem>
                              <SelectItem value="10">10 miles</SelectItem>
                              <SelectItem value="15">15 miles</SelectItem>
                              <SelectItem value="25">25 miles</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {tenantPreferences.matchRadius} miles
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Default Min Rent
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Default minimum monthly rent for new tenants
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={tenantPreferences.defaultBudgetMin}
                            onChange={(e) =>
                              handleTenantChange(
                                "defaultBudgetMin",
                                e.target.value,
                              )
                            }
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            $
                            {parseInt(
                              tenantPreferences.defaultBudgetMin,
                            ).toLocaleString()}
                            /mo
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Default Max Rent
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Default maximum monthly rent for new tenants
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={tenantPreferences.defaultBudgetMax}
                            onChange={(e) =>
                              handleTenantChange(
                                "defaultBudgetMax",
                                e.target.value,
                              )
                            }
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            $
                            {parseInt(
                              tenantPreferences.defaultBudgetMax,
                            ).toLocaleString()}
                            /mo
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Pet Friendly Default
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Default setting for pet-friendly properties
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={tenantPreferences.petFriendly}
                            onCheckedChange={(checked) =>
                              handleTenantChange("petFriendly", checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              tenantPreferences.petFriendly
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {tenantPreferences.petFriendly
                              ? "Required"
                              : "Optional"}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Furnished Preference
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Default preference for furnished properties
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={tenantPreferences.furnished}
                            onCheckedChange={(checked) =>
                              handleTenantChange("furnished", checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              tenantPreferences.furnished
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {tenantPreferences.furnished
                              ? "Preferred"
                              : "Not Required"}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Require Pre-Approval
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Require tenant pre-approval for applications
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={tenantPreferences.requirePreApproval}
                            onCheckedChange={(checked) =>
                              handleTenantChange("requirePreApproval", checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              tenantPreferences.requirePreApproval
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {tenantPreferences.requirePreApproval
                              ? "Required"
                              : "Optional"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="developers" className="mt-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-orange-600" />
                  Developer Preference Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">
                          Setting
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Description
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Value/Control
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Portfolio Size Target
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Target number of properties in developer portfolio
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={developerPreferences.portfolioSize}
                            onChange={(e) =>
                              handleDeveloperChange(
                                "portfolioSize",
                                e.target.value,
                              )
                            }
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {developerPreferences.portfolioSize} properties
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Min Investment Budget
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Minimum investment budget for new projects
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={developerPreferences.investmentBudgetMin}
                            onChange={(e) =>
                              handleDeveloperChange(
                                "investmentBudgetMin",
                                e.target.value,
                              )
                            }
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            $
                            {(
                              parseInt(
                                developerPreferences.investmentBudgetMin,
                              ) / 1000000
                            ).toFixed(1)}
                            M
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Max Investment Budget
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Maximum investment budget for new projects
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={developerPreferences.investmentBudgetMax}
                            onChange={(e) =>
                              handleDeveloperChange(
                                "investmentBudgetMax",
                                e.target.value,
                              )
                            }
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            $
                            {(
                              parseInt(
                                developerPreferences.investmentBudgetMax,
                              ) / 1000000
                            ).toFixed(1)}
                            M
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Minimum ROI
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Required minimum return on investment percentage
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={developerPreferences.minimumROI}
                            onChange={(e) =>
                              handleDeveloperChange(
                                "minimumROI",
                                e.target.value,
                              )
                            }
                            className="w-32"
                            step="0.1"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {developerPreferences.minimumROI}% ROI
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Show Investment Opportunities
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Display available investment opportunities
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={developerPreferences.showOpportunities}
                            onCheckedChange={(checked) =>
                              handleDeveloperChange(
                                "showOpportunities",
                                checked,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              developerPreferences.showOpportunities
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {developerPreferences.showOpportunities
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Require Market Analysis
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Require detailed market analysis for all projects
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={developerPreferences.requireMarketAnalysis}
                            onCheckedChange={(checked) =>
                              handleDeveloperChange(
                                "requireMarketAnalysis",
                                checked,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              developerPreferences.requireMarketAnalysis
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {developerPreferences.requireMarketAnalysis
                              ? "Required"
                              : "Optional"}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          New Developments Only
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Focus only on new development projects
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={developerPreferences.newDevelopments}
                            onCheckedChange={(checked) =>
                              handleDeveloperChange("newDevelopments", checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              developerPreferences.newDevelopments
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {developerPreferences.newDevelopments
                              ? "New Only"
                              : "All Projects"}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          Commercial Projects Only
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Restrict to commercial development projects only
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={developerPreferences.commercialOnly}
                            onCheckedChange={(checked) =>
                              handleDeveloperChange("commercialOnly", checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              developerPreferences.commercialOnly
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {developerPreferences.commercialOnly
                              ? "Commercial Only"
                              : "All Types"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
