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
  Building,
  Hammer,
  DollarSign,
  FileText,
  Settings,
  Save,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function DeveloperPreferencesPage() {
  const [preferences, setPreferences] = useState({
    // Project Settings
    requireEnvironmentalImpact: true,
    mandatoryPermitVerification: true,
    minimumProjectValue: "1000000",
    maxProjectDuration: "36", // months

    // Approval Process
    requireBoardApproval: true,
    autoApprovalThreshold: "500000",
    requiredDocuments: ["permits", "environmental", "financial", "timeline"],

    // Quality Standards
    requireGreenCertification: false,
    minimumEnergyRating: "B",
    accessibilityCompliance: true,

    // Financial Requirements
    minimumCapitalReserve: "20", // percentage
    requirePerformanceBond: true,
    bondPercentage: "10",
    progressPaymentSchedule: "monthly",

    // Monitoring & Reporting
    requireProgressReports: true,
    reportingFrequency: "monthly",
    inspectionSchedule: "quarterly",

    // Community Impact
    requireCommunityConsultation: true,
    affordableHousingQuota: "15", // percentage

    // Technology Integration
    requireBIMModeling: false,
    mandatoryIoTReadiness: false,
    smartHomeTechnology: true,
  });

  const stats = [
    {
      title: "Active Projects",
      value: "24",
      change: "+15.2%",
      trend: "up" as const,
      icon: Building,
      color: "blue" as const,
    },
    {
      title: "Total Investment",
      value: "₦142M",
      change: "+22.1%",
      trend: "up" as const,
      icon: DollarSign,
      color: "green" as const,
    },
    {
      title: "Completion Rate",
      value: "87%",
      change: "+5.3%",
      trend: "up" as const,
      icon: CheckCircle,
      color: "purple" as const,
    },
    {
      title: "Avg Timeline",
      value: "28 months",
      change: "-8.2%",
      trend: "down" as const,
      icon: Clock,
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
    console.log("Saving developer preferences:", preferences);
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Developer Preferences"
          description="Configure development project requirements, approval processes, and quality standards"
        >
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
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
          {/* Project Requirements */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-orange-600" />
                Project Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label>Minimum Project Value (₦)</Label>
                <Input
                  type="number"
                  value={preferences.minimumProjectValue}
                  onChange={(e) =>
                    handlePreferenceChange(
                      "minimumProjectValue",
                      e.target.value,
                    )
                  }
                  placeholder="1000000"
                />
              </div>

              <div className="space-y-2">
                <Label>Maximum Project Duration (months)</Label>
                <Select
                  value={preferences.maxProjectDuration}
                  onValueChange={(value) =>
                    handlePreferenceChange("maxProjectDuration", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">
                    Environmental Impact Assessment
                  </Label>
                  <p className="text-sm text-gray-600">
                    Require environmental impact studies
                  </p>
                </div>
                <Switch
                  checked={preferences.requireEnvironmentalImpact}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange(
                      "requireEnvironmentalImpact",
                      checked,
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Permit Verification</Label>
                  <p className="text-sm text-gray-600">
                    Mandatory verification of all permits
                  </p>
                </div>
                <Switch
                  checked={preferences.mandatoryPermitVerification}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange(
                      "mandatoryPermitVerification",
                      checked,
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Approval Process */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Approval Process
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Require Board Approval</Label>
                  <p className="text-sm text-gray-600">
                    Board approval for all projects
                  </p>
                </div>
                <Switch
                  checked={preferences.requireBoardApproval}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("requireBoardApproval", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Auto-Approval Threshold (₦)</Label>
                <Input
                  type="number"
                  value={preferences.autoApprovalThreshold}
                  onChange={(e) =>
                    handlePreferenceChange(
                      "autoApprovalThreshold",
                      e.target.value,
                    )
                  }
                  placeholder="500000"
                />
                <p className="text-xs text-gray-500">
                  Projects below this value can be auto-approved
                </p>
              </div>

              <div className="space-y-2">
                <Label>Required Documents</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "permits",
                    "environmental",
                    "financial",
                    "timeline",
                    "insurance",
                    "safety",
                  ].map((doc) => (
                    <div key={doc} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={doc}
                        checked={preferences.requiredDocuments.includes(doc)}
                        onChange={(e) => {
                          const newDocs = e.target.checked
                            ? [...preferences.requiredDocuments, doc]
                            : preferences.requiredDocuments.filter(
                                (d) => d !== doc,
                              );
                          handlePreferenceChange("requiredDocuments", newDocs);
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={doc} className="capitalize text-sm">
                        {doc}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Standards */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b">
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Quality Standards
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">
                    Green Certification Required
                  </Label>
                  <p className="text-sm text-gray-600">
                    LEED or equivalent certification
                  </p>
                </div>
                <Switch
                  checked={preferences.requireGreenCertification}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("requireGreenCertification", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Minimum Energy Rating</Label>
                <Select
                  value={preferences.minimumEnergyRating}
                  onValueChange={(value) =>
                    handlePreferenceChange("minimumEnergyRating", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+ (Highest)</SelectItem>
                    <SelectItem value="A">A (Very High)</SelectItem>
                    <SelectItem value="B">B (High)</SelectItem>
                    <SelectItem value="C">C (Medium)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">
                    Accessibility Compliance
                  </Label>
                  <p className="text-sm text-gray-600">
                    ADA and accessibility standards
                  </p>
                </div>
                <Switch
                  checked={preferences.accessibilityCompliance}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("accessibilityCompliance", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Smart Home Technology</Label>
                  <p className="text-sm text-gray-600">
                    Include smart home features
                  </p>
                </div>
                <Switch
                  checked={preferences.smartHomeTechnology}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("smartHomeTechnology", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Financial & Monitoring */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
                Financial & Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label>Minimum Capital Reserve (%)</Label>
                <Input
                  type="number"
                  value={preferences.minimumCapitalReserve}
                  onChange={(e) =>
                    handlePreferenceChange(
                      "minimumCapitalReserve",
                      e.target.value,
                    )
                  }
                  placeholder="20"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">
                    Performance Bond Required
                  </Label>
                  <p className="text-sm text-gray-600">
                    Require completion guarantee bond
                  </p>
                </div>
                <Switch
                  checked={preferences.requirePerformanceBond}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("requirePerformanceBond", checked)
                  }
                />
              </div>

              {preferences.requirePerformanceBond && (
                <div className="space-y-2">
                  <Label>Bond Percentage (%)</Label>
                  <Input
                    type="number"
                    value={preferences.bondPercentage}
                    onChange={(e) =>
                      handlePreferenceChange("bondPercentage", e.target.value)
                    }
                    placeholder="10"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Progress Reporting Frequency</Label>
                <Select
                  value={preferences.reportingFrequency}
                  onValueChange={(value) =>
                    handlePreferenceChange("reportingFrequency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Affordable Housing Quota (%)</Label>
                <Input
                  type="number"
                  value={preferences.affordableHousingQuota}
                  onChange={(e) =>
                    handlePreferenceChange(
                      "affordableHousingQuota",
                      e.target.value,
                    )
                  }
                  placeholder="15"
                />
                <p className="text-xs text-gray-500">
                  Percentage of units that must be affordable housing
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
