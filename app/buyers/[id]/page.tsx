"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Home,
  Building,
  DollarSign,
  Eye,
  Star,
  Heart,
  Activity,
  FileText,
  Clock,
  AlertTriangle,
  RefreshCw,
  Edit,
  Settings,
} from "lucide-react";
import { ListPageSkeleton } from "@/components/skeletons/PageSkeletons";
import { LoadingPlaceholder } from "@/components/shared/LoadingPlaceholder";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { apiService } from "@/lib/services/apiService";

export default function BuyerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const buyerId = params.id as string;
  const [activeTab, setActiveTab] = useState("inspections");
  const [inspectionsPage, setInspectionsPage] = useState(1);
  const [preferencesPage, setPreferencesPage] = useState(1);
  const limit = 10;

  // Fetch buyer details
  const {
    data: buyerResponse,
    isLoading: isBuyerLoading,
    error: buyerError,
    refetch: refetchBuyer,
  } = useQuery({
    queryKey: ["buyer", buyerId],
    queryFn: () => apiService.getBuyer(buyerId),
    enabled: !!buyerId,
  });

  // Fetch buyer inspections
  const {
    data: inspectionsResponse,
    isLoading: isInspectionsLoading,
    error: inspectionsError,
    refetch: refetchInspections,
  } = useQuery({
    queryKey: ["buyer-inspections", buyerId, inspectionsPage],
    queryFn: () =>
      apiService.getBuyerInspections(buyerId, {
        page: inspectionsPage,
        limit,
      }),
    enabled: !!buyerId && activeTab === "inspections",
  });

  // Fetch buyer preferences
  const {
    data: preferencesResponse,
    isLoading: isPreferencesLoading,
    error: preferencesError,
    refetch: refetchPreferences,
  } = useQuery({
    queryKey: ["buyer-preferences", buyerId, preferencesPage],
    queryFn: () =>
      apiService.getBuyerPreferencesByBuyerId(buyerId, {
        page: preferencesPage,
        limit,
      }),
    enabled: !!buyerId && activeTab === "preferences",
  });

  const buyer = buyerResponse?.data;
  const inspections = inspectionsResponse?.data || [];
  const inspectionsPagination = inspectionsResponse?.pagination || {
    total: 0,
    currentPage: 1,
    page: 1,
    totalPages: 1,
  };
  const preferences = preferencesResponse?.data || [];
  const preferencesPagination = preferencesResponse?.pagination || {
    total: 0,
    currentPage: 1,
    page: 1,
    totalPages: 1,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      pending_inspection: { color: "blue", label: "Pending Inspection" },
      inspection_approved: { color: "green", label: "Approved" },
      completed: { color: "green", label: "Completed" },
      cancelled: { color: "gray", label: "Cancelled" },
      pending_transaction: { color: "orange", label: "Pending Transaction" },
    };

    const config = statusMap[status] || { color: "gray", label: status };
    return (
      <Badge className={`bg-${config.color}-100 text-${config.color}-800`}>
        {config.label}
      </Badge>
    );
  };

  const getPreferenceStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      pending: { color: "orange", label: "Pending" },
      active: { color: "green", label: "Active" },
      matched: { color: "blue", label: "Matched" },
      closed: { color: "gray", label: "Closed" },
    };

    const config = statusMap[status] || { color: "gray", label: status };
    return (
      <Badge className={`bg-${config.color}-100 text-${config.color}-800`}>
        {config.label}
      </Badge>
    );
  };

  const handleRefresh = () => {
    refetchBuyer();
    if (activeTab === "inspections") {
      refetchInspections();
    } else if (activeTab === "preferences") {
      refetchPreferences();
    }
  };

  if (isBuyerLoading) {
    return (
      <AdminLayout>
        <ListPageSkeleton title="Buyer Details" />
      </AdminLayout>
    );
  }

  if (buyerError || !buyer) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Card className="max-w-md mx-auto border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900">
                    Error Loading Buyer
                  </h3>
                  <p className="text-red-700 text-sm">
                    Failed to load buyer details. Please try again.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button
                  onClick={handleRefresh}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Buyer Details"
          description={`Complete profile and activity for ${buyer?.fullName || `${buyer?.firstName || ""} ${buyer?.lastName || ""}`.trim() || "Unknown Buyer"}`}
        >
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Buyers
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Edit className="h-4 w-4 mr-2" />
            Edit Buyer
          </Button>
        </PageHeader>

        {/* Buyer Info Card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
              <Avatar className="h-20 w-20 mx-auto sm:mx-0 mb-4 sm:mb-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xl">
                  {(
                    buyer?.fullName ||
                    `${buyer?.firstName || ""} ${buyer?.lastName || ""}`.trim() ||
                    "Unknown Buyer"
                  )
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("") || "B"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {buyer?.fullName ||
                    `${buyer?.firstName || ""} ${buyer?.lastName || ""}`.trim() ||
                    "Unknown Buyer"}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {buyer?.email || "No email"}
                    </span>
                  </div>
                  {buyer?.phoneNumber && (
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {buyer.phoneNumber}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Joined{" "}
                      {buyer?.createdAt
                        ? formatDate(buyer.createdAt)
                        : "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    ID: {buyer?.accountId || buyer?._id || "Unknown"}
                  </Badge>
                  {buyer?.isAccountVerified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Star className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending Verification
                    </Badge>
                  )}
                  {buyer?.isPremium && (
                    <Badge className="bg-purple-100 text-purple-800">
                      <Star className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  {buyer?.isFlagged && (
                    <Badge className="bg-red-100 text-red-800">Flagged</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="inspections"
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Inspections ({inspectionsPagination.total || 0})</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center space-x-2"
            >
              <Heart className="h-4 w-4" />
              <span>Preferences ({preferencesPagination.total || 0})</span>
            </TabsTrigger>
          </TabsList>

          {/* Inspections Tab */}
          <TabsContent value="inspections" className="space-y-6 mt-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-gray-600" />
                    <div>
                      <span className="text-lg font-medium">Inspections</span>
                      <p className="text-sm text-gray-600 font-normal">
                        {inspectionsPagination.total || 0} total inspections
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {inspections.length} showing
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isInspectionsLoading ? (
                  <LoadingPlaceholder type="table" count={5} />
                ) : inspectionsError ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">Failed to load inspections</p>
                  </div>
                ) : inspections.length === 0 ? (
                  <EmptyState
                    icon={Eye}
                    title="No inspections found"
                    description="This buyer hasn't made any inspection requests yet."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold text-gray-900">
                            Property
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Date & Time
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Stage
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Owner
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inspections.map((inspection: any, index: number) => (
                          <TableRow
                            key={inspection._id}
                            className={`hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }`}
                          >
                            <TableCell className="py-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {inspection?.propertyId?.title || "Property"}
                                </p>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {inspection?.propertyId?.location?.area ||
                                    "Unknown"}
                                  ,{" "}
                                  {inspection?.propertyId?.location
                                    ?.localGovernment || "Unknown"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div>
                                <p className="text-sm font-medium">
                                  {inspection?.inspectionDate
                                    ? formatDate(inspection.inspectionDate)
                                    : "Unknown"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {inspection?.inspectionTime || "Unknown"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              {getStatusBadge(inspection?.status || "unknown")}
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge variant="secondary" className="text-xs">
                                {inspection?.stage || "Unknown"}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4">
                              <div>
                                <p className="text-sm font-medium">
                                  {inspection?.owner?.firstName || "Unknown"}{" "}
                                  {inspection?.owner?.lastName || ""}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {inspection?.owner?.email || "No email"}
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                {inspections.length > 0 &&
                  inspectionsPagination.totalPages > 1 && (
                    <div className="px-6 pb-6">
                      <Pagination
                        currentPage={
                          inspectionsPagination.currentPage ||
                          inspectionsPagination.page ||
                          inspectionsPage
                        }
                        totalItems={inspectionsPagination.total || 0}
                        itemsPerPage={limit}
                        onPageChange={setInspectionsPage}
                      />
                    </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6 mt-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-gray-600" />
                    <div>
                      <span className="text-lg font-medium">Preferences</span>
                      <p className="text-sm text-gray-600 font-normal">
                        {preferencesPagination.total || 0} saved preferences
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {preferences.length} showing
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isPreferencesLoading ? (
                  <LoadingPlaceholder type="table" count={5} />
                ) : preferencesError ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">Failed to load preferences</p>
                  </div>
                ) : preferences.length === 0 ? (
                  <EmptyState
                    icon={Heart}
                    title="No preferences found"
                    description="This buyer hasn't set any property preferences yet."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold text-gray-900">
                            Property Type
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Location
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Budget Range
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Details
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Created
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {preferences.map((preference: any, index: number) => (
                          <TableRow
                            key={preference._id}
                            className={`hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }`}
                          >
                            <TableCell className="py-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {preference?.propertyType || "Unknown"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {preference?.propertyCondition || "N/A"}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="text-xs mt-1"
                                >
                                  {preference?.preferenceType || "N/A"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="text-sm">
                                <p className="font-medium">
                                  {preference?.location?.area || "Unknown"}
                                </p>
                                <p className="text-gray-500">
                                  {preference?.location?.localGovernment ||
                                    "Unknown"}
                                  , {preference?.location?.state || "Unknown"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="text-sm">
                                <p className="font-medium">
                                  {preference?.budgetMin
                                    ? formatCurrency(preference.budgetMin)
                                    : "N/A"}{" "}
                                  -{" "}
                                  {preference?.budgetMax
                                    ? formatCurrency(preference.budgetMax)
                                    : "N/A"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="text-sm space-y-1">
                                <p>
                                  <Building className="h-3 w-3 inline mr-1" />
                                  {preference?.noOfBedrooms || 0} beds,{" "}
                                  {preference?.noOfBathrooms || 0} baths
                                </p>
                                {preference?.landSize && (
                                  <p>
                                    <Home className="h-3 w-3 inline mr-1" />
                                    {preference.landSize}{" "}
                                    {preference?.measurementType || ""}
                                  </p>
                                )}
                                {preference?.features?.length > 0 && (
                                  <p className="text-xs text-gray-500">
                                    +{preference.features.length} features
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              {getPreferenceStatusBadge(
                                preference?.status || "unknown",
                              )}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="text-sm">
                                <p className="font-medium">
                                  {preference?.createdAt
                                    ? formatDate(preference.createdAt)
                                    : "Unknown"}
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                {preferences.length > 0 &&
                  preferencesPagination.totalPages > 1 && (
                    <Pagination
                      currentPage={preferencesPage}
                      totalItems={preferencesPagination.total}
                      itemsPerPage={limit}
                      onPageChange={setPreferencesPage}
                    />
                  )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
