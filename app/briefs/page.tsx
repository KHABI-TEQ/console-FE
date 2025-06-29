"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
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
  FileText,
  ClipboardList,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Building,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Shield,
  Users,
  UserCheck,
  Grid3X3,
  List,
  Share2,
  MoreHorizontal,
  TrendingUp,
  Target,
  MapPin,
  Briefcase,
  PenTool,
  Archive,
  Activity,
} from "lucide-react";
import { LoadingPlaceholder } from "@/components/shared/LoadingPlaceholder";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiService } from "@/lib/services/apiService";

interface BriefFilters {
  search?: string;
  status?: string;
  type?: string;
  priority?: string;
  assignedTo?: string;
  page?: number;
  limit?: number;
}

export default function BriefsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    briefId: string | null;
    briefTitle: string;
  }>({ isOpen: false, briefId: null, briefTitle: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const limit = 12;

  const filters: BriefFilters = {
    ...(searchQuery && { search: searchQuery }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(typeFilter !== "all" && { type: typeFilter }),
    ...(priorityFilter !== "all" && { priority: priorityFilter }),
    page,
    limit,
  };

  const {
    data: briefsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["briefs", filters],
    queryFn: async () => {
      const response = await apiService.getBriefs(filters);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch briefs");
      }
      return response;
    },
  });

  // Mock data for demonstration
  const mockBriefs = [
    {
      _id: "1",
      title: "Luxury Apartment Marketing Strategy",
      description:
        "Comprehensive marketing plan for high-end residential properties in Victoria Island",
      type: "Marketing",
      status: "active",
      priority: "high",
      property: {
        type: "Residential",
        location: "Victoria Island, Lagos",
        price: 450000000,
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
        ],
      },
      assignedTo: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg",
        role: "Marketing Manager",
      },
      agent: {
        name: "Khabi Tek",
        company: "Khabi Teq Realty",
      },
      createdAt: "2025-01-15T10:30:00Z",
      dueDate: "2025-02-15T10:30:00Z",
      progress: 75,
      tags: ["Premium", "Marketing", "Social Media"],
      isApproved: false,
      approvedBy: null,
      attachments: 8,
      comments: 12,
    },
    {
      _id: "2",
      title: "Property Inspection Checklist",
      description: "Detailed inspection guidelines for commercial properties",
      type: "Inspection",
      status: "pending",
      priority: "medium",
      property: {
        type: "Commercial",
        location: "Lekki Phase 1, Lagos",
        price: 1200000000,
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
        ],
      },
      assignedTo: {
        name: "Mike Wilson",
        avatar: "/placeholder.svg",
        role: "Inspector",
      },
      agent: {
        name: "John Doe",
        company: "Prime Properties",
      },
      createdAt: "2025-01-10T14:20:00Z",
      dueDate: "2025-01-25T14:20:00Z",
      progress: 45,
      tags: ["Inspection", "Commercial", "Guidelines"],
      isApproved: true,
      approvedBy: "Admin User",
      attachments: 5,
      comments: 8,
    },
    {
      _id: "3",
      title: "Sales Process Documentation",
      description: "Step-by-step sales process for new property developments",
      type: "Sales",
      status: "completed",
      priority: "low",
      property: {
        type: "Development",
        location: "Ikeja GRA, Lagos",
        price: 850000000,
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
        ],
      },
      assignedTo: {
        name: "Emma Davis",
        avatar: "/placeholder.svg",
        role: "Sales Manager",
      },
      agent: {
        name: "Jane Smith",
        company: "Elite Realty",
      },
      createdAt: "2025-01-05T09:15:00Z",
      dueDate: "2025-01-20T09:15:00Z",
      progress: 100,
      tags: ["Sales", "Process", "Development"],
      isApproved: true,
      approvedBy: "Admin User",
      attachments: 3,
      comments: 15,
    },
  ];

  const briefs = mockBriefs;
  const totalCount = briefs.length;

  const stats = [
    {
      title: "Total Briefs",
      value: totalCount.toString(),
      change: "+12.5%",
      trend: "up" as const,
      icon: FileText,
      color: "blue" as const,
    },
    {
      title: "Active Briefs",
      value: briefs.filter((b: any) => b.status === "active").length.toString(),
      change: "+8.2%",
      trend: "up" as const,
      icon: ClipboardList,
      color: "green" as const,
    },
    {
      title: "Pending Approval",
      value: briefs.filter((b: any) => !b.isApproved).length.toString(),
      change: "-8.2%",
      trend: "down" as const,
      icon: Clock,
      color: "orange" as const,
    },
    {
      title: "Completed",
      value: briefs
        .filter((b: any) => b.status === "completed")
        .length.toString(),
      change: "+25.1%",
      trend: "up" as const,
      icon: CheckCircle,
      color: "purple" as const,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case "on_hold":
        return <Badge className="bg-gray-100 text-gray-800">On Hold</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const handleDeleteBrief = (briefId: string, briefTitle: string) => {
    setDeleteModal({
      isOpen: true,
      briefId,
      briefTitle,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.briefId) return;

    setIsDeleting(true);
    try {
      await apiService.deleteBrief(deleteModal.briefId);
      refetch();
      setDeleteModal({ isOpen: false, briefId: null, briefTitle: "" });
    } catch (error) {
      console.error("Failed to delete brief:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApproveBrief = async (briefId: string) => {
    try {
      // Add approve brief API call
      await apiService.patch(`/briefs/${briefId}/approve`);
      refetch();
    } catch (error) {
      console.error("Failed to approve brief:", error);
    }
  };

  const BriefCard = ({ brief }: { brief: any }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={brief.property.images[0] || "/placeholder.svg"}
          alt={brief.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          {getStatusBadge(brief.status)}
          {getPriorityBadge(brief.priority)}
        </div>
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/briefs/${brief._id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/briefs/${brief._id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Brief
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!brief.isApproved && (
                <DropdownMenuItem onClick={() => handleApproveBrief(brief._id)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Brief
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => handleDeleteBrief(brief._id, brief.title)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {brief.isApproved && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Approved
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {brief.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {brief.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                <span>{brief.property.type}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate">{brief.property.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(brief.property.price)}
              </p>
              <p className="text-xs text-gray-500">
                Due: {new Date(brief.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={brief.assignedTo.avatar} />
                <AvatarFallback className="text-xs">
                  {brief.assignedTo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600">
                {brief.assignedTo.name}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <span>{brief.attachments} files</span>
                <span>{brief.comments} comments</span>
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-1">
                <div
                  className="bg-blue-600 h-1 rounded-full"
                  style={{ width: `${brief.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {brief.tags.slice(0, 3).map((tag: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {brief.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{brief.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const BriefListItem = ({ brief }: { brief: any }) => (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <img
            src={brief.property.images[0] || "/placeholder.svg"}
            alt={brief.title}
            className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {brief.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                  {brief.description}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(brief.property.price)}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusBadge(brief.status)}
                  {getPriorityBadge(brief.priority)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  <span>{brief.property.type}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{brief.property.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Due: {new Date(brief.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Avatar className="h-5 w-5 mr-1">
                    <AvatarImage src={brief.assignedTo.avatar} />
                    <AvatarFallback className="text-xs">
                      {brief.assignedTo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{brief.assignedTo.name}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/briefs/${brief._id}`)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/briefs/${brief._id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Brief
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!brief.isApproved && (
                      <DropdownMenuItem
                        onClick={() => handleApproveBrief(brief._id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve Brief
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleDeleteBrief(brief._id, brief.title)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
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
                    Error Loading Data
                  </h3>
                  <p className="text-red-700 text-sm">
                    Failed to load briefs. Please try again.
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
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Brief Management"
          description="Manage property briefs, assignments, and approval workflow"
        >
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => router.push("/briefs/new")}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Brief
          </Button>
        </PageHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Filters */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-gray-600" />
              Filter Briefs
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search briefs by title, description, or property..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Briefs */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <span className="text-lg font-medium">Active Briefs</span>
                  <p className="text-sm text-gray-600 font-normal">
                    {totalCount} briefs found
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {briefs.length} showing
                </Badge>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <LoadingPlaceholder type="grid" count={6} />
            ) : briefs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No briefs found"
                description="No briefs match your current filters. Try adjusting your search criteria."
                secondaryActionLabel="Clear Filters"
                onSecondaryAction={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setPriorityFilter("all");
                }}
              />
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {briefs.map((brief: any) =>
                  viewMode === "grid" ? (
                    <BriefCard key={brief._id} brief={brief} />
                  ) : (
                    <BriefListItem key={brief._id} brief={brief} />
                  ),
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() =>
            setDeleteModal({ isOpen: false, briefId: null, briefTitle: "" })
          }
          onConfirm={confirmDelete}
          title="Delete Brief"
          description={`Are you sure you want to delete "${deleteModal.briefTitle}"? This action cannot be undone.`}
          confirmText="Delete Brief"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </AdminLayout>
  );
}
