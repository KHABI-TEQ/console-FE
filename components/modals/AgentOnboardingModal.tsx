"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  FileText,
  CheckCircle,
  XCircle,
  Building,
  CreditCard,
  Globe,
  Users,
} from "lucide-react";
import { useAgents } from "@/contexts/AgentsContext";
import { useConfirmation } from "@/contexts/ConfirmationContext";

interface AgentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: any;
}

export function AgentOnboardingModal({
  isOpen,
  onClose,
  agent,
}: AgentOnboardingModalProps) {
  const { approveAgent } = useAgents();
  const { confirmAction } = useConfirmation();
  const [isLoading, setIsLoading] = useState(false);

  if (!agent) return null;

  const agentName =
    agent.fullName ||
    `${agent.firstName || ""} ${agent.lastName || ""}`.trim() ||
    "Unknown User";

  const handleApprove = () => {
    confirmAction({
      title: "Approve Agent",
      description: `Are you sure you want to approve ${agentName}? This will grant them access to the platform.`,
      confirmText: "Approve",
      cancelText: "Cancel",
      variant: "success",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await approveAgent(agent.id, 1);
          onClose();
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleReject = () => {
    confirmAction({
      title: "Reject Agent",
      description: `Are you sure you want to reject ${agentName}? This action cannot be undone.`,
      confirmText: "Reject",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await approveAgent(agent.id, 0);
          onClose();
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                {agentName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{agentName}</h2>
              <p className="text-sm text-gray-600">Agent Onboarding Details</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">
                      {agent.phoneNumber || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Joined:</span>
                    <span className="text-sm">
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Agent Type:</span>
                    <Badge variant="outline">{agent.agentType}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Account Status:</span>
                    <Badge
                      className={
                        agent.accountStatus === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {agent.accountStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Verified:</span>
                    <Badge
                      className={
                        agent.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {agent.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          {agent.location && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      State:
                    </span>
                    <p className="text-sm">
                      {agent.location.state || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Local Government:
                    </span>
                    <p className="text-sm">
                      {agent.location.localGovt || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Regions:
                    </span>
                    <p className="text-sm">
                      {agent.location.regions || "Not specified"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* KYC Information */}
          {agent.kyc && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  KYC Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Government ID Type:
                    </span>
                    <p className="text-sm uppercase">
                      {agent.kyc.govtIdType || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Government ID Number:
                    </span>
                    <p className="text-sm">
                      {agent.kyc.govtIdNumber || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Uploaded Documents:
                    </span>
                    <Badge variant="outline">
                      <CreditCard className="h-3 w-3 mr-1" />
                      {agent.kyc.uploadedIdCount || 0} documents
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Onboarding Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Onboarding Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex justify-center mb-2">
                    {agent.isVerified ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium">Email Verification</p>
                  <p className="text-xs text-gray-500">
                    {agent.isVerified ? "Completed" : "Pending"}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex justify-center mb-2">
                    {agent.kyc?.uploadedIdCount > 0 ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium">Document Upload</p>
                  <p className="text-xs text-gray-500">
                    {agent.kyc?.uploadedIdCount > 0 ? "Completed" : "Pending"}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex justify-center mb-2">
                    {agent.onBoarded ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium">Onboarding</p>
                  <p className="text-xs text-gray-500">
                    {agent.onBoarded ? "Completed" : "Pending"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={isLoading}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
