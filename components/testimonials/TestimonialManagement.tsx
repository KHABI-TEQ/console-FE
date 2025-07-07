"use client";

import { useState, useEffect } from "react";
import { useTestimonials } from "@/contexts/TestimonialsContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  MessageSquare,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddTestimonialModal } from "@/components/modals/AddTestimonialModal";
import { ListPageSkeleton } from "@/components/skeletons/PageSkeletons";
import { useConfirmation } from "@/contexts/ConfirmationContext";
import type { Testimonial } from "@/lib/types/testimonial";

export default function TestimonialManagement() {
  const {
    testimonials,
    isLoading,
    pagination,
    filters,
    fetchTestimonials,
    deleteTestimonial,
    updateTestimonialStatus,
    setFilters,
    setPage,
  } = useTestimonials();

  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [statusFilter, setStatusFilter] = useState(filters.status || "all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);

  const { confirmAction } = useConfirmation();

  // Mutation hooks for better error handling
  const deleteTestimonialMutation = useApiMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      // Testimonials will be refetched automatically
    },
    invalidateQueries: ["testimonials"],
    successMessage: "Testimonial deleted successfully",
    errorMessage: "Failed to delete testimonial",
  });

  const updateStatusMutation = useApiMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "rejected";
    }) => updateTestimonialStatus(id, status),
    onSuccess: () => {
      // Testimonials will be refetched automatically
    },
    invalidateQueries: ["testimonials"],
    successMessage: "Testimonial status updated successfully",
    errorMessage: "Failed to update testimonial status",
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSearch = () => {
    setFilters({
      ...filters,
      search: searchQuery,
      status: statusFilter,
      page: 1,
    });
    fetchTestimonials({
      search: searchQuery,
      status: statusFilter,
      page: 1,
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchTestimonials();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchTestimonials({ page: newPage });
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsEditModalOpen(true);
  };

  const handleDelete = (testimonial: Testimonial) => {
    confirmAction({
      title: "Delete Testimonial",
      description: `Are you sure you want to delete the testimonial from ${testimonial.fullName}? This action cannot be undone.`,
      confirmText: "Delete Testimonial",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: () => {
        deleteTestimonialMutation.mutate(testimonial._id);
      },
    });
  };

  const handleStatusUpdate = (
    testimonial: Testimonial,
    status: "approved" | "rejected",
  ) => {
    confirmAction({
      title: `${status === "approved" ? "Approve" : "Reject"} Testimonial`,
      description: `Are you sure you want to ${status === "approved" ? "approve" : "reject"} this testimonial from ${testimonial.fullName}?`,
      confirmText: status === "approved" ? "Approve" : "Reject",
      cancelText: "Cancel",
      variant: status === "approved" ? "default" : "danger",
      onConfirm: () => {
        updateStatusMutation.mutate({
          id: testimonial._id,
          status,
        });
      },
    });
  };

  if (isLoading && testimonials.length === 0) {
    return <ListPageSkeleton title="Testimonial Management" />;
  }

  const stats = [
    {
      title: "Total Testimonials",
      value: pagination.total.toString(),
      change: "+12.5%",
      trend: "up" as const,
      icon: MessageSquare,
      color: "blue" as const,
    },
    {
      title: "Approved",
      value: testimonials
        .filter((t) => t.status === "approved")
        .length.toString(),
      change: "+8.2%",
      trend: "up" as const,
      icon: CheckCircle,
      color: "green" as const,
    },
    {
      title: "Pending",
      value: testimonials
        .filter((t) => t.status === "pending")
        .length.toString(),
      change: "+3.1%",
      trend: "up" as const,
      icon: Clock,
      color: "yellow" as const,
    },
    {
      title: "Rejected",
      value: testimonials
        .filter((t) => t.status === "rejected")
        .length.toString(),
      change: "-2.5%",
      trend: "down" as const,
      icon: XCircle,
      color: "red" as const,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "pending":
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Testimonial Management"
        description="Manage customer testimonials and reviews"
      >
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Filters */}
      <Card className="border shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b">
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-600" />
            Filter Testimonials
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, occupation, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Table */}
      <Card className="border shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-gray-600" />
              <div>
                <span className="text-lg font-medium">Testimonials</span>
                <p className="text-sm text-gray-600 font-normal">
                  {testimonials.length} of {pagination.total} testimonials
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Page {pagination.page} of {pagination.totalPages}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Rating & Message
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Created
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No testimonials found
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {isLoading
                            ? "Loading testimonials..."
                            : "Get started by creating your first testimonial or check if the API endpoints are configured."}
                        </p>
                        {!isLoading && (
                          <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Testimonial
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  testimonials.map((testimonial) => (
                    <TableRow
                      key={testimonial._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={testimonial.profileImage} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                              {testimonial.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {testimonial.fullName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {testimonial.occupation}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          {renderStars(testimonial.rating)}
                          <p className="text-sm text-gray-600 max-w-xs truncate">
                            {testimonial.message}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(testimonial.status)}
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="text-sm">
                          {formatDate(testimonial.createdAt)}
                        </p>
                      </TableCell>
                      <TableCell className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(testimonial)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {testimonial.status !== "approved" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(testimonial, "approved")
                                }
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {testimonial.status !== "rejected" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(testimonial, "rejected")
                                }
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDelete(testimonial)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} testimonials
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  )
                    .slice(
                      Math.max(0, pagination.page - 3),
                      Math.min(pagination.totalPages, pagination.page + 2),
                    )
                    .map((page) => (
                      <Button
                        key={page}
                        variant={
                          pagination.page === page ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddTestimonialModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => fetchTestimonials()}
      />

      <AddTestimonialModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTestimonial(null);
        }}
        testimonialData={selectedTestimonial || undefined}
        onSuccess={() => fetchTestimonials()}
      />
    </div>
  );
}
