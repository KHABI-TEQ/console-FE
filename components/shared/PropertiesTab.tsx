"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Eye, Calendar } from "lucide-react";
import { apiService } from "@/lib/services/apiService";

interface PropertiesTabProps {
  userId: string;
  userType: "agent" | "landlord";
}

export function PropertiesTab({ userId, userType }: PropertiesTabProps) {
  const router = useRouter();

  const {
    data: propertiesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-properties", userId],
    queryFn: () => apiService.getUserProperties(userId),
    enabled: !!userId,
  });

  const properties = propertiesResponse?.data || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (property: any) => {
    if (property.isApproved) {
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    } else if (property.isRejected) {
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getAvailabilityBadge = (property: any) => {
    if (property.isAvailable) {
      return <Badge className="bg-blue-100 text-blue-800">Available</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Unavailable</Badge>;
    }
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
        <div className="space-y-4">
          {properties.length > 0 ? (
            properties.map((property: any) => (
              <Card
                key={property.id}
                className="hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {property.image ? (
                        <img
                          src={property.image}
                          alt="Property"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {property.propertyType} - {property.briefType}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {property.location?.area ||
                              "Unknown Location"},{" "}
                            {property.location?.localGovernment || ""},{" "}
                            {property.location?.state || ""}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            {getStatusBadge(property)}
                            {getAvailabilityBadge(property)}
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
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(property.price)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {property.buildingType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {property.additionalFeatures?.noOfBedrooms && (
                            <span>
                              {property.additionalFeatures.noOfBedrooms} bed
                            </span>
                          )}
                          {property.additionalFeatures?.noOfBathrooms && (
                            <span>
                              {property.additionalFeatures.noOfBathrooms} bath
                            </span>
                          )}
                          {property.additionalFeatures?.noOfCarParks && (
                            <span>
                              {property.additionalFeatures.noOfCarParks} parking
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(property.createdAt).toLocaleDateString()}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/properties/${property.id}`)
                            }
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                      {property.owner && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Owner: </span>
                          {property.owner.fullName} ({property.owner.userType})
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
