"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  Car,
  Phone,
  Mail,
  ChevronLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
} from "lucide-react";
import { WashingMachine } from "lucide-react";
import { apiService } from "@/lib/services/apiService";
import { useApp } from "@/contexts/AppContext";
import { Pagination } from "@/components/shared/Pagination";

interface PropertyData {
  id: string;
  image: string;
  owner: {
    id: string;
    fullName: string;
    email: string;
    userType: string;
    phoneNumber: string;
  };
  propertyType: string;
  briefType: string;
  price: number;
  isApproved: boolean;
  isRejected: boolean;
  isAvailable: string;
  isPremium: boolean;
  isPreference: boolean;
  buildingType: string;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  additionalFeatures: {
    noOfBedrooms: number;
    noOfBathrooms: number;
    noOfToilets: number;
    noOfCarParks: number;
  };
  createdAt: string;
}

interface InspectionRequest {
  _id: string;
  propertyId: string;
  bookedBy: string;
  inspectionDate: string;
  inspectionTime: string;
  status: string;
  transaction?: {
    _id: string;
    amount: number;
  };
  stage: string;
  owner: {
    _id: string;
    fullName: string;
  };
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState("overview");
  const [inspectionPage, setInspectionPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Fetch property details
  const {
    data: propertyResponse,
    isLoading: propertyLoading,
    refetch: refetchProperty,
  } = useQuery({
    queryKey: ["property-details", params.id],
    queryFn: () => apiService.getPropertyDetails(params.id as string),
  });

  // Fetch inspection requests
  const {
    data: inspectionsResponse,
    isLoading: inspectionsLoading,
    refetch: refetchInspections,
  } = useQuery({
    queryKey: ["property-inspections", params.id, inspectionPage],
    queryFn: () =>
      apiService.getPropertyInspections(params.id as string, {
        page: inspectionPage,
        limit: 10,
      }),
  });

  const property: PropertyData | null = propertyResponse?.data || null;
  const inspections: InspectionRequest[] = inspectionsResponse?.data || [];
  const inspectionPagination = inspectionsResponse?.pagination || {
    total: 0,
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (property: PropertyData) => {
    if (property.isApproved) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    } else if (property.isRejected) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    }
  };

  const getInspectionStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleDeleteProperty = async () => {
    if (!property) return;

    setIsDeleting(true);
    try {
      const response = await apiService.deleteProperty(property.id);
      if (response.success) {
        addNotification({
          type: "success",
          title: "Property Deleted",
          message: "Property has been successfully deleted.",
        });
        router.push("/properties");
      } else {
        addNotification({
          type: "error",
          title: "Delete Failed",
          message: response.error || "Failed to delete property.",
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Delete Failed",
        message: "An unexpected error occurred while deleting the property.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdatePropertyStatus = async (action: "approve" | "reject") => {
    if (!property) return;

    setIsUpdatingStatus(true);
    try {
      const response = await apiService.updatePropertyStatus(
        property.id,
        action,
      );
      if (response.success) {
        addNotification({
          type: "success",
          title: `Property ${action === "approve" ? "Approved" : "Rejected"}`,
          message: `Property has been successfully ${action}d.`,
        });
        refetchProperty();
      } else {
        addNotification({
          type: "error",
          title: `${action === "approve" ? "Approval" : "Rejection"} Failed`,
          message: response.error || `Failed to ${action} property.`,
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: `${action === "approve" ? "Approval" : "Rejection"} Failed`,
        message: `An unexpected error occurred while ${action}ing the property.`,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (propertyLoading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!property) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Property Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The property you're looking for doesn't exist.
            </p>
            <Button onClick={() => router.push("/properties")}>
              Back to Properties
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {property.propertyType} - {property.briefType}
              </h1>
              <p className="text-gray-600 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location.area}, {property.location.localGovernment},{" "}
                {property.location.state}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!property.isApproved && !property.isRejected && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-700"
                  onClick={() => handleUpdatePropertyStatus("approve")}
                  disabled={isUpdatingStatus}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-600 hover:text-orange-700"
                  onClick={() => handleUpdatePropertyStatus("reject")}
                  disabled={isUpdatingStatus}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Property</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this property? This action
                    cannot be undone and will remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleDeleteProperty}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Property Image and Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Image */}
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-gray-100">
                <img
                  src={property.image}
                  alt={property.propertyType}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  {getStatusBadge(property)}
                  {property.isPremium && (
                    <Badge className="bg-purple-100 text-purple-800">
                      Premium
                    </Badge>
                  )}
                  {property.isPreference && (
                    <Badge className="bg-orange-100 text-orange-800">
                      Preference
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Detailed Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="inspections">
                  Inspection Requests
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Bed className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-semibold">
                            {property.additionalFeatures.noOfBedrooms}
                          </p>
                          <p className="text-sm text-gray-600">Bedrooms</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bath className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-semibold">
                            {property.additionalFeatures.noOfBathrooms}
                          </p>
                          <p className="text-sm text-gray-600">Bathrooms</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <WashingMachine className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-semibold">
                            {property.additionalFeatures.noOfToilets || 0}
                          </p>
                          <p className="text-sm text-gray-600">Toilets</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Car className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-semibold">
                            {property.additionalFeatures.noOfCarParks}
                          </p>
                          <p className="text-sm text-gray-600">Car Parks</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">
                          Property Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium">
                              {property.propertyType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Building Type:
                            </span>
                            <span className="font-medium">
                              {property.buildingType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Brief Type:</span>
                            <span className="font-medium">
                              {property.briefType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Available:</span>
                            <span className="font-medium">
                              {property.isAvailable}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Listed:</span>
                            <span className="font-medium">
                              {new Date(
                                property.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Location Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">State:</span>
                            <span className="font-medium">
                              {property.location.state}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">LGA:</span>
                            <span className="font-medium">
                              {property.location.localGovernment}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Area:</span>
                            <span className="font-medium">
                              {property.location.area}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inspections" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Inspection Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {inspectionsLoading ? (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-gray-600">Loading inspections...</p>
                      </div>
                    ) : inspections.length === 0 ? (
                      <div className="text-center py-8">
                        <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Inspection Requests
                        </h3>
                        <p className="text-gray-600">
                          There are no inspection requests for this property
                          yet.
                        </p>
                      </div>
                    ) : (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date & Time</TableHead>
                              <TableHead>Booked By</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Stage</TableHead>
                              <TableHead>Transaction</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {inspections.map((inspection) => (
                              <TableRow key={inspection._id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">
                                      {new Date(
                                        inspection.inspectionDate,
                                      ).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {inspection.inspectionTime}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">
                                    {inspection.bookedBy}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {getInspectionStatusBadge(inspection.status)}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {inspection.stage}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {inspection.transaction ? (
                                    <div className="text-sm">
                                      {formatCurrency(
                                        inspection.transaction.amount,
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">
                                      No transaction
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        {inspectionPagination.totalPages > 1 && (
                          <div className="mt-4">
                            <Pagination
                              currentPage={inspectionPagination.currentPage}
                              totalItems={inspectionPagination.total}
                              itemsPerPage={inspectionPagination.perPage}
                              onPageChange={setInspectionPage}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Owner & Property Info */}
          <div className="space-y-6">
            {/* Price and Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Property Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {formatCurrency(property.price)}
                  </div>
                  <div className="flex justify-center">
                    {getStatusBadge(property)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Property Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {property.owner.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {property.owner.fullName}
                    </h4>
                    <Badge variant="secondary" className="mb-2">
                      {property.owner.userType}
                    </Badge>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{property.owner.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{property.owner.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Property ID</span>
                  <span className="font-medium">#{property.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="font-medium">{property.propertyType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Building Type</span>
                  <span className="font-medium">{property.buildingType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Available</span>
                  <span className="font-medium">{property.isAvailable}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Listed Date</span>
                  <span className="font-medium">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
