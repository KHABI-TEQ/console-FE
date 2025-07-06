"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { apiService } from "@/lib/services/apiService";

interface PropertiesTabProps {
  userId: string;
  userType: "agent" | "landlord";
}

export function PropertiesTab({ userId, userType }: PropertiesTabProps) {
  const {
    data: propertiesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-properties", userId],
    queryFn: () => apiService.getUserProperties(userId),
    enabled: !!userId,
  });

  const properties = propertiesResponse?.data || [];

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Properties</span>
            <Badge variant="secondary">Loading...</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse border rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Error loading properties
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Failed to load properties. Please try again.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Properties</span>
          <Badge variant="secondary">{properties.length} properties</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.length > 0 ? (
            properties.map((property: any) => (
              <PropertyCard
                key={property.id || property._id}
                property={property}
                variant="grid"
                showActionButtons={false}
                onRefresh={handleRefresh}
                className="h-full"
              />
            ))
          ) : (
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No properties found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This {userType} hasn't added any properties yet.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
