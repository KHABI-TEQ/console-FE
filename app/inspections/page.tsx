"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Search,
  Filter,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Building,
  FileText,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  InspectionFilters,
  InspectionListResponse,
  IInspectionBookingPopulated,
} from "@/lib/types/inspection";
import { InspectionDetailModal } from "@/components/inspection/InspectionDetailModal";
import {
  MultiSelect,
  MultiSelectBadges,
} from "@/components/inspection/MultiSelect";

const statusOptions = [
  { value: "pending_transaction", label: "Pending Transaction" },
  { value: "transaction_failed", label: "Transaction Failed" },
  { value: "pending_inspection", label: "Pending Inspection" },
  { value: "inspection_approved", label: "Inspection Approved" },
  { value: "inspection_rescheduled", label: "Inspection Rescheduled" },
  { value: "inspection_rejected_by_seller", label: "Rejected by Seller" },
  { value: "inspection_rejected_by_buyer", label: "Rejected by Buyer" },
  { value: "negotiation_countered", label: "Negotiation Countered" },
  { value: "negotiation_accepted", label: "Negotiation Accepted" },
  { value: "negotiation_rejected", label: "Negotiation Rejected" },
  { value: "negotiation_cancelled", label: "Negotiation Cancelled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

import { apiService } from "@/lib/services/apiService";
import { Pagination } from "@/components/shared/Pagination";
import { InspectionsProvider } from "@/contexts/InspectionsContext";
import { InspectionsSkeleton } from "@/components/skeletons/PageSkeletons";
import { useRequestLoader } from "@/components/ui/request-loader";

export default function InspectionsPage() {
  const [filters, setFilters] = useState<InspectionFilters>({});
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selectedInspectionId, setSelectedInspectionId] = useState<
    string | null
  >(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const limit = 10;

  const {
    data: inspectionsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["inspections", filters, page],
    queryFn: () => apiService.getInspections({ ...filters, page, limit }),
  });

  const handleFilterChange = (key: keyof InspectionFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
    setPage(1);
  };

  const handleStatusChange = (statuses: string[]) => {
    setSelectedStatuses(statuses);
    setFilters((prev) => ({
      ...prev,
      status: statuses.length > 0 ? (statuses as any) : undefined,
    }));
    setPage(1);
  };

  const handleViewInspection = (inspection: IInspectionBookingPopulated) => {
    setSelectedInspectionId(inspection._id);
    setIsDetailOpen(true);
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

  const inspectionsData = inspectionsResponse?.data || [];
  const totalCount = inspectionsResponse?.total || 0;

  const statsData = [
    {
      title: "Pending Transaction Status",
      value:
        inspectionsData.filter((i) => i.status === "pending_transaction")
          .length || 0,
      change: "+12%",
      trend: "up",
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Active Negotiations",
      value: inspectionsData.filter((i) => i.isNegotiating).length || 0,
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Pending Responses",
      value:
        inspectionsData.filter((i) => i.pendingResponseFrom !== "none")
          .length || 0,
      change: "-5%",
      trend: "down",
      icon: Clock,
      color: "orange",
    },
    {
      title: "Total Inspections",
      value: totalCount,
      change: "+15%",
      trend: "up",
      icon: Building,
      color: "purple",
    },
  ];

  if (error) {
    return (
      <InspectionsProvider>
        <AdminLayout>
          <div className="p-6">
            <Card className="max-w-md mx-auto border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Activity className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900">
                      Error Loading Data
                    </h3>
                    <p className="text-red-700 text-sm">
                      Failed to load inspections. Please try again.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => refetch()}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        </AdminLayout>
      </InspectionsProvider>
    );
  }

  return (
    <InspectionsProvider>
      <AdminLayout>
        <div className="p-4 sm:p-6 space-y-6">
          {/* Enhanced Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Inspection Management
              </h1>
              <p className="text-gray-600">
                Monitor and manage property inspection requests in real-time
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, index) => (
              <Card
                key={index}
                className="border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                        {stat.title}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-1 sm:mt-2"></div>
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center flex-shrink-0 ml-2`}
                    >
                      <stat.icon
                        className={`h-5 w-5 sm:h-6 sm:w-6 text-${stat.color}-600`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Filters */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="flex items-center text-lg font-medium">
                <Filter className="h-5 w-5 mr-2 text-gray-600" />
                Advanced Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search properties, buyers, sellers, or addresses..."
                    value={filters.search || ""}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <MultiSelect
                    options={statusOptions}
                    value={selectedStatuses}
                    onValueChange={handleStatusChange}
                    placeholder="Select statuses..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Stage
                  </label>
                  <Select
                    value={filters.stage || "all_stages"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "stage",
                        value === "all_stages" ? "" : value,
                      )
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_stages">All Stages</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="LOI">Letter of Intent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Pending Response
                  </label>
                  <Select
                    value={filters.pendingResponseFrom || "all_responses"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "pendingResponseFrom",
                        value === "all_responses" ? "" : value,
                      )
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pending Response" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_responses">All</SelectItem>
                      <SelectItem value="buyer">Buyer</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({});
                      setSelectedStatuses([]);
                      setPage(1);
                    }}
                    className="w-full h-11"
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              <MultiSelectBadges
                options={statusOptions}
                value={selectedStatuses}
                onValueChange={handleStatusChange}
              />
            </CardContent>
          </Card>

          {/* Enhanced Data Table */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gray-600" />
                  <div>
                    <span className="text-lg font-medium">
                      Active Inspections
                    </span>
                    <p className="text-sm text-gray-600 font-normal">
                      {totalCount} total records found
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {inspectionsData.length || 0} showing
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-medium">
                    Loading inspection data...
                  </p>
                  <p className="text-gray-500 text-sm">
                    Please wait while we fetch the latest information
                  </p>
                </div>
              ) : (
                <>
                  <div className="hidden lg:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold text-gray-900">
                            Property
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Participants
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Schedule
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Financial
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inspectionsData.map((inspection, index) => (
                          <TableRow
                            key={inspection._id}
                            className={`hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }`}
                          >
                            <TableCell className="py-4">
                              <div className="flex items-start space-x-3">
                                <div className="relative">
                                  <img
                                    src={
                                      inspection.propertyId.pictures[0] ||
                                      "/placeholder.svg"
                                    }
                                    alt="Property"
                                    className="w-16 h-12 object-cover rounded-lg border shadow-sm"
                                  />
                                  {inspection.status ===
                                    "pending_transaction" && (
                                    <div className="absolute -top-1 -right-1">
                                      <Badge className="text-xs px-1.5 py-0.5 bg-red-500 hover:bg-red-600 text-white border-0 rounded-full">
                                        PT
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {inspection.propertyId.briefType} Property
                                  </p>
                                  <p className="text-sm text-gray-500 flex items-center mt-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {inspection.propertyId.location.area},{" "}
                                    {
                                      inspection.propertyId.location
                                        .localGovernment
                                    }
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {
                                      inspection.propertyId.additionalFeatures
                                        .noOfBedrooms
                                    }{" "}
                                    bed • {inspection.propertyId.propertyType}
                                  </p>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="py-4">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-xs font-medium text-blue-600">
                                      {inspection.requestedBy.fullName?.charAt(
                                        0,
                                      ) || "B"}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {inspection.requestedBy.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Buyer
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-xs font-medium text-green-600">
                                      {inspection.owner.firstName?.charAt(0) ||
                                        "S"}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {inspection.owner.firstName}{" "}
                                      {inspection.owner.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {inspection.owner.role || "Seller"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="py-4">
                              <div>
                                <p className="text-sm font-medium">
                                  {formatDate(inspection.inspectionDate)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {inspection.inspectionTime}
                                </p>
                              </div>
                            </TableCell>

                            <TableCell className="py-4">
                              <div className="space-y-1">
                                <Badge variant="outline" className="text-xs">
                                  {inspection.status.replace(/_/g, " ")}
                                </Badge>
                                <br />
                                <Badge variant="secondary" className="text-xs">
                                  {inspection.stage}
                                </Badge>
                              </div>
                            </TableCell>

                            <TableCell className="py-4">
                              <div>
                                <p className="text-sm font-medium">
                                  {formatCurrency(inspection.propertyId.price)}
                                </p>
                                {inspection.isNegotiating && (
                                  <p className="text-xs text-orange-600">
                                    Offer:{" "}
                                    {formatCurrency(
                                      inspection.negotiationPrice,
                                    )}
                                  </p>
                                )}
                                {inspection.pendingResponseFrom !== "none" && (
                                  <p className="text-xs text-amber-600">
                                    Awaiting {inspection.pendingResponseFrom}
                                  </p>
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="py-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewInspection(inspection)}
                                className="hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile View */}
                  <div className="lg:hidden divide-y divide-gray-200">
                    {inspectionsData.map((inspection) => (
                      <div
                        key={inspection._id}
                        className="p-4 hover:bg-gray-50"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="relative">
                              <img
                                src={
                                  inspection.propertyId.pictures[0] ||
                                  "/placeholder.svg"
                                }
                                alt="Property"
                                className="w-16 h-12 object-cover rounded-lg border shadow-sm flex-shrink-0"
                              />
                              {inspection.status === "pending_transaction" && (
                                <div className="absolute -top-1 -right-1">
                                  <Badge className="text-xs px-1.5 py-0.5 bg-orange-500 hover:bg-orange-500 text-white border-0 rounded-full">
                                    PT
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-gray-900 truncate">
                                {inspection.propertyId.briefType} Property
                              </h3>
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">
                                  {inspection.propertyId.location.area},{" "}
                                  {
                                    inspection.propertyId.location
                                      .localGovernment
                                  }
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {inspection.status.replace(/_/g, " ")}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {inspection.stage}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-500">Date</p>
                              <p className="font-medium">
                                {formatDate(inspection.inspectionDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Time</p>
                              <p className="font-medium">
                                {inspection.inspectionTime}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Price</p>
                              <p className="font-medium">
                                {formatCurrency(inspection.propertyId.price)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Buyer</p>
                              <p className="font-medium truncate">
                                {inspection.requestedBy.fullName}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <div className="text-xs text-gray-500">
                              {inspection.pendingResponseFrom !== "none" && (
                                <span className="text-amber-600">
                                  Awaiting {inspection.pendingResponseFrom}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewInspection(inspection)}
                              className="px-3 hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Pagination
                    currentPage={page}
                    totalItems={totalCount}
                    itemsPerPage={limit}
                    onPageChange={setPage}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <InspectionDetailModal
            inspectionId={selectedInspectionId}
            isOpen={isDetailOpen}
            onClose={() => {
              setIsDetailOpen(false);
              setSelectedInspectionId(null);
            }}
          />
        </div>
      </AdminLayout>
    </InspectionsProvider>
  );
}
