"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  Shield,
  FileText,
  ExternalLink,
} from "lucide-react";
import { useAgents } from "@/contexts/AgentsContext";
import { useConfirmation } from "@/contexts/ConfirmationContext";

interface UpgradeRequest {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  accountStatus: string;
  isVerified: boolean;
  isFlagged: boolean;
  agentId: string;
  currentAgentType: string;
  requestedUpgradeAgentType: string;
  upgradeRequestDate: string;
  upgradeCompanyInfo?: {
    companyName: string;
    cacNumber: string;
  };
  upgradeMeansOfId: Array<{
    name: string;
    docImg: string[];
  }>;
}

interface UpgradeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: UpgradeRequest | null;
}

export function UpgradeRequestModal({
  isOpen,
  onClose,
  request,
}: UpgradeRequestModalProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { approveUpgradeRequest, rejectUpgradeRequest } = useAgents();
  const { confirmAction } = useConfirmation();

  if (!request) return null;

  const handleApprove = async () => {
    confirmAction({
      title: "Approve Upgrade Request",
      description: `Are you sure you want to approve ${request.fullName}'s upgrade request from ${request.currentAgentType} to ${request.requestedUpgradeAgentType}?`,
      confirmText: "Approve",
      cancelText: "Cancel",
      variant: "success",
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          await approveUpgradeRequest(request.id);
          onClose();
        } catch (error) {
          console.error("Error approving upgrade request:", error);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  const handleReject = async () => {
    const confirmed = await showConfirmation({
      title: "Reject Upgrade Request",
      message: `Are you sure you want to reject ${request.fullName}'s upgrade request?`,
      confirmText: "Reject",
      cancelText: "Cancel",
    });

    if (confirmed) {
      setIsSubmitting(true);
      try {
        await rejectUpgradeRequest(request.id, rejectReason);
        onClose();
        setRejectReason("");
      } catch (error) {
        console.error("Error rejecting upgrade request:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setRejectReason("");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Agent Upgrade Request
          </SheetTitle>
          <SheetDescription>
            Review and manage the agent's upgrade request details.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Agent Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Agent Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" alt={request.fullName} />
                  <AvatarFallback className="text-lg">
                    {request.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{request.fullName}</h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        request.accountStatus === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {request.accountStatus}
                    </Badge>
                    {request.isVerified && (
                      <Badge variant="outline" className="text-green-600">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {request.isFlagged && (
                      <Badge variant="destructive">Flagged</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{request.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{request.phoneNumber}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Upgrade Request Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Current Agent Type
                  </Label>
                  <div className="mt-1">
                    <Badge variant="outline">{request.currentAgentType}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Requested Upgrade To
                  </Label>
                  <div className="mt-1">
                    <Badge variant="default">
                      {request.requestedUpgradeAgentType}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Request Date:{" "}
                  <span className="font-medium">
                    {request.upgradeRequestDate}
                  </span>
                </span>
              </div>

              {request.upgradeCompanyInfo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Company Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm text-gray-600">
                        Company Name
                      </Label>
                      <p className="text-sm font-medium">
                        {request.upgradeCompanyInfo.companyName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">
                        CAC Number
                      </Label>
                      <p className="text-sm font-medium">
                        {request.upgradeCompanyInfo.cacNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Identification Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Identification Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {request.upgradeMeansOfId.map((idDoc, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      {idDoc.name}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {idDoc.docImg.map((imageUrl, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img
                            src={imageUrl}
                            alt={`${idDoc.name} ${imgIndex + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => window.open(imageUrl, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rejection Reason (only shown when rejecting) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Rejection Reason (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter reason for rejection (optional)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isSubmitting ? "Approving..." : "Approve Request"}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isSubmitting}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {isSubmitting ? "Rejecting..." : "Reject Request"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
