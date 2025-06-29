"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

async function fetchInspections(
  filters: InspectionFilters & { page: number; limit: number },
): Promise<InspectionListResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value.toString());
      }
    }
  });

  const response = await fetch(`/api/inspections?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch inspections");
  }
  return response.json();
}

export default function AdminInspectionsPage() {
  const [filters, setFilters] = useState<InspectionFilters>({});
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selectedInspection, setSelectedInspection] =
    useState<IInspectionBookingPopulated | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const limit = 10;

  const {
    data: inspectionsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["inspections", filters, page],
    queryFn: () => fetchInspections({ ...filters, page, limit }),
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
    setSelectedInspection(inspection);
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const statsData = [
    {
      title: "Pending Inspections",
      value:
        inspectionsData?.inspections.filter(
          (i) => i.status === "pending_inspection",
        ).length || 0,
      change: "+12%",
      trend: "up",
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Active Negotiations",
      value:
        inspectionsData?.inspections.filter((i) => i.isNegotiating).length || 0,
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Pending Responses",
      value:
        inspectionsData?.inspections.filter(
          (i) => i.pendingResponseFrom !== "none",
        ).length || 0,
      change: "-5%",
      trend: "down",
      icon: Clock,
      color: "orange",
    },
    {
      title: "Total Properties",
      value: inspectionsData?.total || 0,
      change: "+15%",
      trend: "up",
      icon: Building,
      color: "purple",
    },
  ];

  if (error) {
    return (
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
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Inspection Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track property inspection requests
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="border border-gray-200 hover:border-gray-300 transition-colors"
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
                  <div className="flex items-center mt-1 sm:mt-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600 mr-1 flex-shrink-0" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600 mr-1 flex-shrink-0" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1 hidden sm:inline">
                      from last month
                    </span>
                  </div>
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

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-medium">
            <Filter className="h-5 w-5 mr-2 text-gray-600" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search properties, buyers, sellers..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
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

            <Select
              value={filters.stage || "all_stages"}
              onValueChange={(value) =>
                handleFilterChange("stage", value === "all_stages" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_stages">All Stages</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="LOI">Letter of Intent</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.pendingResponseFrom || "all_responses"}
              onValueChange={(value) =>
                handleFilterChange(
                  "pendingResponseFrom",
                  value === "all_responses" ? "" : value,
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pending Response" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_responses">All</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setFilters({});
                setSelectedStatuses([]);
                setPage(1);
              }}
            >
              Clear All
            </Button>
          </div>

          <MultiSelectBadges
            options={statusOptions}
            value={selectedStatuses}
            onValueChange={handleStatusChange}
          />
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-gray-600" />
              <div>
                <span className="text-lg font-medium">Inspections</span>
                <p className="text-sm text-gray-600 font-normal">
                  {inspectionsData?.total || 0} total records
                </p>
              </div>
            </div>
            <Badge variant="secondary">
              {inspectionsData?.inspections.length || 0} showing
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">
                Loading inspections...
              </p>
            </div>
          ) : (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium">Property</TableHead>
                      <TableHead className="font-medium">
                        Participants
                      </TableHead>
                      <TableHead className="font-medium">Schedule</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="font-medium">Financial</TableHead>
                      <TableHead className="font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspectionsData?.inspections.map((inspection) => (
                      <TableRow
                        key={inspection._id}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <div className="flex items-start space-x-3">
                            <img
                              src={inspection.propertyId.images[0]}
                              alt={inspection.propertyId.title}
                              className="w-16 h-12 object-cover rounded border"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {inspection.propertyId.title}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {inspection.propertyId.address
                                  .split(",")
                                  .slice(0, 2)
                                  .join(",")}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <img
                                src={inspection.requestedBy.avatar}
                                alt={inspection.requestedBy.name}
                                className="h-6 w-6 rounded-full"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {inspection.requestedBy.name}
                                </p>
                                <p className="text-xs text-gray-500">Buyer</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <img
                                src={inspection.owner.avatar}
                                alt={inspection.owner.name}
                                className="h-6 w-6 rounded-full"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {inspection.owner.name}
                                </p>
                                <p className="text-xs text-gray-500">Seller</p>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">
                              {formatDate(inspection.inspectionDate)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {inspection.inspectionTime}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
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

                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">
                              {formatCurrency(inspection.propertyId.price)}
                            </p>
                            {inspection.isNegotiating && (
                              <p className="text-xs text-orange-600">
                                Offer:{" "}
                                {formatCurrency(inspection.negotiationPrice)}
                              </p>
                            )}
                            {inspection.pendingResponseFrom !== "none" && (
                              <p className="text-xs text-amber-600">
                                Awaiting {inspection.pendingResponseFrom}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewInspection(inspection)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="lg:hidden divide-y divide-gray-200">
                {inspectionsData?.inspections.map((inspection) => (
                  <div key={inspection._id} className="p-4 hover:bg-gray-50">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <img
                          src={inspection.propertyId.images[0]}
                          alt={inspection.propertyId.title}
                          className="w-16 h-12 object-cover rounded border flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {inspection.propertyId.title}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {inspection.propertyId.address
                                .split(",")
                                .slice(0, 2)
                                .join(",")}
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
                            {inspection.requestedBy.name}
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
                          className="px-3"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {inspectionsData && inspectionsData.totalPages > 1 && (
                <div className="border-t border-gray-200 bg-white">
                  <div className="lg:hidden px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Page {page} of {inspectionsData.totalPages}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page === 1}
                          onClick={() => setPage(page - 1)}
                          className="px-3"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium px-2">{page}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page >= inspectionsData.totalPages}
                          onClick={() => setPage(page + 1)}
                          className="px-3"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, inspectionsData.total)} of{" "}
                      {inspectionsData.total} results
                    </div>
                  </div>

                  <div className="hidden lg:flex justify-between items-center px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {(page - 1) * limit + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(page * limit, inspectionsData.total)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {inspectionsData.total}
                        </span>{" "}
                        results
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="flex items-center space-x-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </Button>

                      <div className="flex items-center space-x-1">
                        {(() => {
                          const totalPages = inspectionsData.totalPages;
                          const currentPage = page;
                          const pages = [];

                          if (currentPage > 3) {
                            pages.push(1);
                            if (currentPage > 4) {
                              pages.push("...");
                            }
                          }

                          for (
                            let i = Math.max(1, currentPage - 2);
                            i <= Math.min(totalPages, currentPage + 2);
                            i++
                          ) {
                            pages.push(i);
                          }

                          if (currentPage < totalPages - 2) {
                            if (currentPage < totalPages - 3) {
                              pages.push("...");
                            }
                            pages.push(totalPages);
                          }

                          return pages.map((pageNum, index) => {
                            if (pageNum === "...") {
                              return (
                                <span
                                  key={index}
                                  className="px-3 py-2 text-gray-500"
                                >
                                  ...
                                </span>
                              );
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  page === pageNum ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setPage(pageNum as number)}
                                className="min-w-[2.5rem]"
                              >
                                {pageNum}
                              </Button>
                            );
                          });
                        })()}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= inspectionsData.totalPages}
                        onClick={() => setPage(page + 1)}
                        className="flex items-center space-x-1"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {selectedInspection && (
        <InspectionDetailModal
          inspection={selectedInspection}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedInspection(null);
          }}
        />
      )}
    </div>
  );
}
