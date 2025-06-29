"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Search,
  Filter,
  Plus,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Grid3X3,
  List,
  Heart,
  Share2,
  TrendingUp,
  Calendar,
  Users,
  Camera,
} from "lucide-react";
import { LoadingPlaceholder } from "@/components/shared/LoadingPlaceholder";
import { PropertiesSkeleton } from "@/components/skeletons/PageSkeletons";
import { Pagination } from "@/components/shared/Pagination";
import {
  EmptyState,
  PropertiesEmptyState,
} from "@/components/shared/EmptyState";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { apiService } from "@/lib/services/apiService";

interface PropertyFilters {
  search?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const limit = 12;

  const filters: PropertyFilters = {
    ...(searchQuery && { search: searchQuery }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(typeFilter !== "all" && { type: typeFilter }),
    page,
    limit,
  };

  const {
    data: propertiesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => apiService.getProperties(filters),
  });

  const properties = propertiesResponse?.data || [];
  const totalCount = propertiesResponse?.total || 0;

  if (isLoading) {
    return (
      <AdminLayout>
        <PropertiesSkeleton />
      </AdminLayout>
    );
  }

  const stats = [
    {
      title: "Total Properties",
      value: totalCount.toString(),
      change: "+12.5%",
      trend: "up" as const,
      icon: Building,
      color: "blue" as const,
    },
    {
      title: "Active Listings",
      value: properties
        .filter((p: any) => p.isApproved && p.isAvailable)
        .length.toString(),
      change: "+8.2%",
      trend: "up" as const,
      icon: CheckCircle,
      color: "green" as const,
    },
    {
      title: "Pending Approval",
      value: properties
        .filter((p: any) => !p.isApproved && !p.isRejected)
        .length.toString(),
      change: "-15.3%",
      trend: "down" as const,
      icon: Clock,
      color: "orange" as const,
    },
    {
      title: "Total Value",
      value: `₦${(properties.reduce((sum: number, p: any) => sum + (p.price || 0), 0) / 1000000).toFixed(0)}M`,
      change: "+22.1%",
      trend: "up" as const,
      icon: DollarSign,
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

  const getStatusBadge = (property: any) => {
    if (property.isApproved) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (property.isRejected) {
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const PropertyCard = ({ property }: { property: any }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={property.pictures?.[0] || "/placeholder.svg"}
          alt={property.propertyType}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          {getStatusBadge(property)}
          {property.isPremium && (
            <Badge className="bg-purple-100 text-purple-800">
              <Star className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {property.propertyType} - {property.briefType}
            </h3>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {property.location?.area}, {property.location?.localGovernment},{" "}
              {property.location?.state}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-3">
              {property.additionalFeatures?.noOfBedrooms && (
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{property.additionalFeatures.noOfBedrooms}</span>
                </div>
              )}
              {property.additionalFeatures?.noOfBathrooms && (
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.additionalFeatures.noOfBathrooms}</span>
                </div>
              )}
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                <span>{property.propertyType}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(property.price)}
              </p>
              <p className="text-xs text-gray-500">
                Listed {new Date(property.createdAt).toLocaleDateString()}
              </p>
            </div>
            <ActionButtons
              entityType="property"
              entityId={property._id}
              entityName={`${property.propertyType} Property`}
              showView={true}
              showEdit={true}
              showDelete={true}
              showApproval={!property.isApproved}
              onRefresh={handleRefresh}
            />
          </div>

          {property.features && property.features.length > 0 && (
            <div className="pt-2 border-t">
              <div className="flex flex-wrap gap-1">
                {property.features
                  .slice(0, 3)
                  .map((feature: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                {property.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{property.features.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const PropertyListItem = ({ property }: { property: any }) => (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <img
            src={property.pictures?.[0] || "/placeholder.svg"}
            alt={property.propertyType}
            className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {property.propertyType} - {property.briefType}
                </h3>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {property.location?.area},{" "}
                  {property.location?.localGovernment}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(property.price)}
                </p>
                {getStatusBadge(property)}
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {property.additionalFeatures?.noOfBedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.additionalFeatures.noOfBedrooms} bed</span>
                  </div>
                )}
                {property.additionalFeatures?.noOfBathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>
                      {property.additionalFeatures.noOfBathrooms} bath
                    </span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <ActionButtons
                entityType="property"
                entityId={property._id}
                entityName={`${property.propertyType} Property`}
                showView={true}
                showEdit={true}
                showDelete={true}
                showApproval={!property.isApproved}
                onRefresh={handleRefresh}
              />
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
                    Failed to load properties. Please try again.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleRefresh}
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
          title="Property Management"
          description="Manage property listings, approvals, and portfolio"
        >
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
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
              Filter Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search properties by location, type, or features..."
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
                  <SelectItem value="approved">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Properties */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <span className="text-lg font-medium">
                    Property Portfolio
                  </span>
                  <p className="text-sm text-gray-600 font-normal">
                    {totalCount} properties found
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {properties.length} showing
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
            ) : properties.length === 0 ? (
              <PropertiesEmptyState
                onAction={() => {}}
                onSecondaryAction={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
                secondaryActionLabel="Clear Filters"
              />
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {properties.map((property: any) =>
                  viewMode === "grid" ? (
                    <PropertyCard key={property._id} property={property} />
                  ) : (
                    <PropertyListItem key={property._id} property={property} />
                  ),
                )}
              </div>
            )}
          </CardContent>
          <Pagination
            currentPage={page}
            totalItems={totalCount}
            itemsPerPage={limit}
            onPageChange={setPage}
          />
        </Card>
      </div>
    </AdminLayout>
  );
}
