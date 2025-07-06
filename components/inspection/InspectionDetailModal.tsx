"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useToast } from "@/components/ui/use-toast";
import { LoadingPlaceholder } from "@/components/shared/LoadingPlaceholder";
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  DollarSign,
  Home,
  Bath,
  Bed,
  Square,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
  Building,
  CreditCard,
  FileText,
  Activity,
  TrendingUp,
  Star,
  Shield,
  AlertTriangle,
  Info,
  Award,
  Target,
  ImageIcon,
  Users,
  HandCoins,
  Timer,
  CheckSquare,
} from "lucide-react";
import { apiService } from "@/lib/services/apiService";
import { cn } from "@/lib/utils";
import { useInspections } from "@/contexts/InspectionsContext";
import { useApiMutation } from "@/hooks/useApiMutation";

interface InspectionDetailModalProps {
  inspectionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors = {
  pending_transaction:
    "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200",
  transaction_failed:
    "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
  pending_inspection:
    "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200",
  inspection_approved:
    "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200",
  inspection_rescheduled:
    "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200",
  inspection_rejected_by_seller:
    "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200",
  inspection_rejected_by_buyer:
    "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200",
  negotiation_countered:
    "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200",
  negotiation_accepted:
    "bg-gradient-to-r from-green-100 to-teal-100 text-green-800 border-green-200",
  negotiation_rejected:
    "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
  negotiation_cancelled:
    "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200",
  completed:
    "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200",
  cancelled:
    "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200",
};

const stageColors = {
  inspection:
    "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200",
  negotiation:
    "bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-800 border-purple-200",
  LOI: "bg-gradient-to-r from-green-100 to-teal-100 text-green-800 border-green-200",
};

export function InspectionDetailModal({
  inspectionId,
  isOpen,
  onClose,
}: InspectionDetailModalProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { updateInspectionStatus } = useInspections();

  const {
    data: inspectionResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["inspection", inspectionId],
    queryFn: async () => {
      if (!inspectionId) return null;
      const response = await apiService.getInspection(inspectionId);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch inspection");
      }
      return response;
    },
    enabled: !!inspectionId && isOpen,
  });

  const inspection = inspectionResponse?.data;

  const approveMutation = useApiMutation({
    mutationFn: () => updateInspectionStatus(inspectionId!, "approve"),
    invalidateQueries: ["inspections", `inspection-${inspectionId}`],
    successMessage: "Inspection approved successfully",
    errorMessage: "Failed to approve inspection",
    onSuccess: () => {
      refetch();
      onClose();
    },
  });

  const rejectMutation = useApiMutation({
    mutationFn: () => updateInspectionStatus(inspectionId!, "reject"),
    invalidateQueries: ["inspections", `inspection-${inspectionId}`],
    successMessage: "Inspection rejected successfully",
    errorMessage: "Failed to reject inspection",
    onSuccess: () => {
      setRejectReason("");
      refetch();
      onClose();
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending_transaction":
        return "Pending Transaction Approval";
      case "transaction_failed":
        return "Transaction Failed";
      case "pending_inspection":
        return "Inspection Scheduled";
      case "inspection_approved":
        return "Inspection Approved";
      case "inspection_rescheduled":
        return "Inspection Rescheduled";
      case "inspection_rejected_by_seller":
      case "inspection_rejected_by_buyer":
        return "Inspection Rejected";
      case "negotiation_countered":
        return "Negotiation In Progress";
      case "negotiation_accepted":
        return "Negotiation Accepted";
      case "negotiation_rejected":
        return "Negotiation Rejected";
      case "negotiation_cancelled":
        return "Negotiation Cancelled";
      case "completed":
        return "Inspection Completed";
      case "cancelled":
        return "Inspection Cancelled";
      default:
        return "No Actions Available";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending_transaction":
        return "Transaction is pending approval. You can approve or reject this transaction.";
      case "transaction_failed":
        return "The transaction has failed and cannot proceed.";
      case "pending_inspection":
        return "Inspection is scheduled and awaiting confirmation.";
      case "inspection_approved":
        return "This inspection has been approved and can proceed.";
      case "inspection_rescheduled":
        return "The inspection has been rescheduled to a new date.";
      case "inspection_rejected_by_seller":
        return "The seller has rejected this inspection request.";
      case "inspection_rejected_by_buyer":
        return "The buyer has rejected this inspection request.";
      case "negotiation_countered":
        return "Price negotiation is ongoing between parties.";
      case "negotiation_accepted":
        return "Both parties have agreed on the negotiated price.";
      case "negotiation_rejected":
        return "The price negotiation has been rejected.";
      case "negotiation_cancelled":
        return "The negotiation process has been cancelled.";
      case "completed":
        return "This inspection has been successfully completed.";
      case "cancelled":
        return "This inspection has been cancelled.";
      default:
        return "This inspection is in a state that doesn't require administrative action at this time.";
    }
  };

  if (isLoading) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-5xl overflow-y-auto">
          <div className="flex items-center justify-center h-96">
            <LoadingPlaceholder />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (error || !inspection) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-5xl overflow-y-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to Load Inspection
              </h3>
              <p className="text-gray-600">
                Unable to fetch inspection details. Please try again.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const canApprove = inspection.status === "pending_transaction";
  const canReject = inspection.status === "pending_transaction";

  const propertyFeatures = [
    {
      icon: Bed,
      label: "Bedrooms",
      value: inspection.propertyId.additionalFeatures?.noOfBedrooms || "N/A",
    },
    {
      icon: Bath,
      label: "Bathrooms",
      value: inspection.propertyId.additionalFeatures?.noOfBathrooms || "N/A",
    },
    {
      icon: Square,
      label: "Property Type",
      value: inspection.propertyId.propertyType || "N/A",
    },
    {
      icon: Building,
      label: "Brief Type",
      value: inspection.propertyId.briefType || "N/A",
    },
  ];

  const activities = [
    {
      id: 1,
      type: "created",
      title: "Inspection Request Created",
      description: `${inspection.requestedBy.fullName} requested an inspection for this property`,
      timestamp: inspection.createdAt,
      icon: Calendar,
      color: "blue",
    },
    {
      id: 2,
      type: "payment",
      title: "Transaction Payment",
      description: "Payment receipt uploaded for inspection",
      timestamp: inspection.transaction?.createdAt || inspection.createdAt,
      icon: CreditCard,
      color: "green",
    },
    ...(inspection.status === "inspection_approved"
      ? [
          {
            id: 3,
            type: "approved",
            title: "Inspection Approved",
            description: "Admin approved the inspection request",
            timestamp: inspection.updatedAt,
            icon: CheckCircle,
            color: "green",
          },
        ]
      : []),
    ...(inspection.isNegotiating
      ? [
          {
            id: 4,
            type: "negotiation",
            title: "Price Negotiation Started",
            description: `Buyer offered ${formatCurrency(
              inspection.negotiationPrice,
            )}`,
            timestamp: inspection.updatedAt,
            icon: HandCoins,
            color: "purple",
          },
        ]
      : []),
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-5xl overflow-y-auto">
        <SheetHeader className="pb-4 sm:pb-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                Inspection Details
              </SheetTitle>
              <SheetDescription className="text-gray-600 mt-1 text-sm sm:text-base">
                Complete inspection information and actions
              </SheetDescription>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs sm:text-sm",
                  statusColors[
                    inspection.status as keyof typeof statusColors
                  ] || "bg-gray-100",
                )}
              >
                {inspection.status.replace(/_/g, " ")}
              </Badge>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs sm:text-sm",
                  stageColors[inspection.stage as keyof typeof stageColors] ||
                    "bg-gray-100",
                )}
              >
                {inspection.stage}
              </Badge>
            </div>
          </div>

          {/* Show approve/reject buttons for pending transactions */}
          {canApprove && (
            <div className="flex items-center justify-center gap-3 mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Pending Transaction Approval
                </span>
              </div>
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>Approve Inspection</span>
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to approve this inspection
                        transaction? This action will notify both the buyer and
                        seller and allow the inspection to proceed as scheduled.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => approveMutation.mutate("approve")}
                        disabled={approveMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {approveMutation.isPending ? "Approving..." : "Approve"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center space-x-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span>Reject Inspection</span>
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Please provide a reason for rejecting this inspection.
                        This will be communicated to the parties involved.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Textarea
                        placeholder="Enter reason for rejection..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="border-gray-300 focus:border-red-500"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => rejectMutation.mutate("reject")}
                        disabled={
                          rejectMutation.isPending || !rejectReason.trim()
                        }
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </SheetHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mt-4 sm:mt-6"
        >
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger
              value="overview"
              className="flex-col sm:flex-row p-2 sm:p-3"
            >
              <Eye className="h-4 w-4 sm:mr-2" />
              <span className="text-xs sm:text-sm mt-1 sm:mt-0">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="property"
              className="flex-col sm:flex-row p-2 sm:p-3"
            >
              <Home className="h-4 w-4 sm:mr-2" />
              <span className="text-xs sm:text-sm mt-1 sm:mt-0">Property</span>
            </TabsTrigger>
            <TabsTrigger
              value="people"
              className="flex-col sm:flex-row p-2 sm:p-3"
            >
              <Users className="h-4 w-4 sm:mr-2" />
              <span className="text-xs sm:text-sm mt-1 sm:mt-0">People</span>
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="flex-col sm:flex-row p-2 sm:p-3"
            >
              <DollarSign className="h-4 w-4 sm:mr-2" />
              <span className="text-xs sm:text-sm mt-1 sm:mt-0">Financial</span>
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="flex-col sm:flex-row p-2 sm:p-3"
            >
              <Activity className="h-4 w-4 sm:mr-2" />
              <span className="text-xs sm:text-sm mt-1 sm:mt-0">
                Activities
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="overview"
            className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Inspection Date</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(inspection.inspectionDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {inspection.inspectionTime}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Property Value</p>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(inspection.propertyId.price)}
                      </p>
                      {inspection.isNegotiating && (
                        <p className="text-sm text-orange-600">
                          Offer: {formatCurrency(inspection.negotiationPrice)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Stage</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {inspection.stage}
                      </p>
                      {inspection.pendingResponseFrom !== "none" && (
                        <p className="text-sm text-amber-600">
                          Awaiting {inspection.pendingResponseFrom}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {inspection.letterOfIntention && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Letter of Intention</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-gray-700 leading-relaxed italic">
                      &quot;{inspection.letterOfIntention}&quot;
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent
            value="property"
            className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
          >
            <Card className="overflow-hidden border-gray-200">
              {inspection.propertyId.pictures &&
              inspection.propertyId.pictures.length > 0 ? (
                <div className="relative">
                  <img
                    src={inspection.propertyId.pictures[0]}
                    alt="Property"
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl sm:text-2xl font-bold">
                      {inspection.propertyId.propertyType} Property
                    </h3>
                    <p className="flex items-center mt-1 opacity-90 text-sm sm:text-base">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {inspection.propertyId.location.area},{" "}
                        {inspection.propertyId.location.localGovernment},{" "}
                        {inspection.propertyId.location.state}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-48 sm:h-64 bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}

              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6">
                  {propertyFeatures.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-2">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-600">{feature.label}</p>
                      <p className="font-semibold">{feature.value}</p>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div>
                  <h4 className="font-semibold mb-3">Property Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {inspection.propertyId.features?.map(
                      (feature: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                {inspection.propertyId.pictures &&
                  inspection.propertyId.pictures.length > 1 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Additional Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {inspection.propertyId.pictures
                          .slice(1)
                          .map((image: string, index: number) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Property view ${index + 2}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="people" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span>Buyer Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {inspection.requestedBy.fullName}
                      </h3>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Primary Buyer
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {inspection.requestedBy.email}
                        </span>
                      </div>
                      {inspection.requestedBy.phoneNumber && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {inspection.requestedBy.phoneNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Home className="h-4 w-4 text-white" />
                    </div>
                    <span>Seller Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {inspection.owner.firstName} {inspection.owner.lastName}
                      </h3>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Property Owner / {inspection.owner.role}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {inspection.owner.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6 mt-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Transaction Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inspection.transaction ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                      <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Transaction Receipt
                      </p>
                      <a
                        href={inspection.transaction.transactionReceipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 font-semibold hover:underline"
                      >
                        View Receipt
                      </a>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                      <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Transaction Date</p>
                      <p className="text-lg font-semibold">
                        {formatDate(inspection.transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-xl">
                    <Info className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      No transaction information available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Pricing Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Listed Price</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(inspection.propertyId.price)}
                    </span>
                  </div>

                  {inspection.isNegotiating && (
                    <>
                      <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <span className="font-medium text-orange-800">
                          Buyer&apos;s Offer
                        </span>
                        <span className="text-lg font-bold text-orange-700">
                          {formatCurrency(inspection.negotiationPrice)}
                        </span>
                      </div>

                      {inspection.sellerCounterOffer && (
                        <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <span className="font-medium text-purple-800">
                            Seller&apos;s Counter
                          </span>
                          <span className="text-lg font-bold text-purple-700">
                            {formatCurrency(inspection.sellerCounterOffer)}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6 mt-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Activity Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4"
                    >
                      <div
                        className={`w-10 h-10 rounded-full bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}
                      >
                        <activity.icon
                          className={`h-5 w-5 text-${activity.color}-600`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {activity.title}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        {index < activities.length - 1 && (
                          <div className="w-px h-6 bg-gray-200 ml-5 mt-4"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {!canApprove && !canReject && (
              <Card className="border-gray-200">
                <CardContent className="text-center p-8">
                  <Info className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-600 mb-2">
                    {getStatusMessage(inspection.status)}
                  </h3>
                  <p className="text-gray-500">
                    {getStatusDescription(inspection.status)}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
