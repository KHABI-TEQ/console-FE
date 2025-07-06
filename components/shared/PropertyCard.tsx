"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Bed, Bath, Calendar, Star, Car } from "lucide-react";
import { ActionButtons } from "@/components/shared/ActionButtons";

interface PropertyData {
  id: string;
  image?: string;
  pictures?: string[];
  owner?: {
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
  features?: string[];
  additionalFeatures?: {
    noOfBedrooms?: number;
    noOfBathrooms?: number;
    noOfToilets?: number;
    noOfCarParks?: number;
  };
  createdAt: string;
  _id?: string;
}

interface PropertyCardProps {
  property: PropertyData;
  variant?: "grid" | "list";
  showActionButtons?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function PropertyCard({
  property,
  variant = "grid",
  showActionButtons = true,
  onRefresh,
  className = "",
}: PropertyCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (property: PropertyData) => {
    if (property.isApproved) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (property.isRejected) {
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const propertyImage =
    property.image || property.pictures?.[0] || "/placeholder.svg";
  const propertyId = property._id || property.id;

  if (variant === "list") {
    return (
      <Card
        className={`hover:shadow-md transition-all duration-200 ${className}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <img
              src={propertyImage}
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
                <div className="flex items-center space-x-2 sm:space-x-4 text-sm text-gray-600 overflow-x-auto">
                  {property.additionalFeatures?.noOfBedrooms && (
                    <div className="flex items-center whitespace-nowrap">
                      <Bed className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">
                        {property.additionalFeatures.noOfBedrooms} bed
                      </span>
                      <span className="sm:hidden">
                        {property.additionalFeatures.noOfBedrooms}
                      </span>
                    </div>
                  )}
                  {property.additionalFeatures?.noOfBathrooms && (
                    <div className="flex items-center whitespace-nowrap">
                      <Bath className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">
                        {property.additionalFeatures.noOfBathrooms} bath
                      </span>
                      <span className="sm:hidden">
                        {property.additionalFeatures.noOfBathrooms}
                      </span>
                    </div>
                  )}
                  {property.additionalFeatures?.noOfCarParks && (
                    <div className="flex items-center whitespace-nowrap">
                      <Car className="h-4 w-4 mr-1" />
                      <span>{property.additionalFeatures.noOfCarParks}</span>
                    </div>
                  )}
                  <div className="flex items-center whitespace-nowrap">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                    <span className="sm:hidden">
                      {new Date(property.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                </div>

                {showActionButtons && (
                  <ActionButtons
                    entityType="propertie"
                    entityId={propertyId}
                    entityName={`${property.propertyType} Property`}
                    showView={true}
                    showEdit={true}
                    showDelete={true}
                    showApproval={!property.isApproved}
                    variant="dropdown"
                    onRefresh={onRefresh}
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 ${className}`}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={propertyImage}
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
          {property.isPreference && (
            <Badge className="bg-orange-100 text-orange-800">Preference</Badge>
          )}
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
            <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto">
              {property.additionalFeatures?.noOfBedrooms && (
                <div className="flex items-center whitespace-nowrap">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{property.additionalFeatures.noOfBedrooms}</span>
                </div>
              )}
              {property.additionalFeatures?.noOfBathrooms && (
                <div className="flex items-center whitespace-nowrap">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.additionalFeatures.noOfBathrooms}</span>
                </div>
              )}
              {property.additionalFeatures?.noOfCarParks && (
                <div className="flex items-center whitespace-nowrap">
                  <Car className="h-4 w-4 mr-1" />
                  <span>{property.additionalFeatures.noOfCarParks}</span>
                </div>
              )}
              <div className="flex items-center whitespace-nowrap">
                <Building className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">
                  {property.buildingType}
                </span>
                <span className="sm:hidden">
                  {property?.buildingType?.substring(0, 8)}...
                </span>
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
            {showActionButtons && (
              <ActionButtons
                entityType="propertie"
                entityId={propertyId}
                entityName={`${property.propertyType} Property`}
                showView={true}
                showEdit={true}
                showDelete={true}
                showApproval={!property.isApproved}
                variant="dropdown"
                onRefresh={onRefresh}
              />
            )}
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

          {property.owner && (
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">
                <span className="font-medium">Owner: </span>
                {property.owner.fullName} ({property.owner.userType})
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
