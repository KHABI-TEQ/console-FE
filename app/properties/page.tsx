"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { PropertyStats } from "@/components/shared/PropertyStats";
import { PropertyFilters } from "@/components/shared/PropertyFilters";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Plus, RefreshCw, Grid3X3, List } from "lucide-react";
import { PropertiesSkeleton } from "@/components/skeletons/PageSkeletons";
import { Pagination } from "@/components/shared/Pagination";
import { PropertiesEmptyState } from "@/components/shared/EmptyState";
import {
  useProperties,
  PropertiesProvider,
} from "@/contexts/PropertiesContext";
import { apiService } from "@/lib/services/apiService";

function PropertiesContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Use properties context
  const {
    properties,
    isLoading: isPropertiesLoading,
    filters,
    pagination,
    fetchProperties,
    refreshProperties,
    setFilters,
    setPage,
  } = useProperties();

  // Fetch property stats (separate from context)
  const {
    data: statsResponse,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["property-stats"],
    queryFn: () => apiService.getPropertyStats(),
  });

  // Initialize pagination with 12 items per page for properties grid
  useEffect(() => {
    if (pagination.perPage !== 12) {
      fetchProperties({ ...filters, page: 1, limit: 12 });
    }
  }, []);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    fetchProperties({ ...newFilters, page: 1, limit: 12 });
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    fetchProperties({ ...filters, page, limit: 12 });
  };

  const handleRefresh = () => {
    refetchStats();
    refreshProperties();
  };

  if (isPropertiesLoading && !propertiesResponse) {
    return (
      <AdminLayout>
        <PropertiesSkeleton />
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
        <PropertyStats
          data={statsResponse?.data || {}}
          isLoading={isStatsLoading}
        />

        {/* Filters */}
        <PropertyFilters
          onFiltersChange={handleFiltersChange}
          initialFilters={filters}
        />

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
                    {pagination.total} properties found
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
            {isPropertiesLoading && properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">
                  Loading properties...
                </p>
                <p className="text-gray-500 text-sm">
                  Please wait while we fetch the latest information
                </p>
              </div>
            ) : isPropertiesLoading ? (
              <div className="relative">
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <div
                  className={
                    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50"
                  }
                >
                  {properties.map((property: any) => (
                    <PropertyCard
                      key={property._id || property.id}
                      property={property}
                      variant={viewMode}
                      onRefresh={handleRefresh}
                    />
                  ))}
                </div>
              </div>
            ) : properties.length === 0 ? (
              <PropertiesEmptyState
                onAction={() => {}}
                onSecondaryAction={() => {
                  setFilters({});
                  setPage(1);
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
                {properties.map((property: any) => (
                  <PropertyCard
                    key={property._id || property.id}
                    property={property}
                    variant={viewMode}
                    onRefresh={handleRefresh}
                  />
                ))}
              </div>
            )}
          </CardContent>
          {properties.length > 0 && pagination.totalPages > 1 && (
            <div
              className={
                isPropertiesLoading ? "opacity-50 pointer-events-none" : ""
              }
            >
              <Pagination
                currentPage={pagination.currentPage}
                totalItems={pagination.total}
                itemsPerPage={pagination.perPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}

export default function PropertiesPage() {
  return (
    <PropertiesProvider>
      <PropertiesContent />
    </PropertiesProvider>
  );
}
