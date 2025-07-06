"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

interface PropertyFiltersProps {
  onFiltersChange: (filters: any) => void;
  initialFilters?: any;
  className?: string;
}

export function PropertyFilters({
  onFiltersChange,
  initialFilters = {},
  className = "",
}: PropertyFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");
  const [ownerType, setOwnerType] = useState(initialFilters.ownerType || "all");
  const [isApproved, setIsApproved] = useState(
    initialFilters.isApproved || "all",
  );
  const [isAvailable, setIsAvailable] = useState(
    initialFilters.isAvailable || "all",
  );
  const [briefType, setBriefType] = useState(initialFilters.briefType || "all");
  const [propertyType, setPropertyType] = useState(
    initialFilters.propertyType || "all",
  );
  const [buildingType, setBuildingType] = useState(
    initialFilters.buildingType || "all",
  );
  const [isPremium, setIsPremium] = useState(initialFilters.isPremium || "all");
  const [isPreference, setIsPreference] = useState(
    initialFilters.isPreference || "all",
  );
  const [priceMin, setPriceMin] = useState(initialFilters.priceMin || "");
  const [priceMax, setPriceMax] = useState(initialFilters.priceMax || "");
  const [location, setLocation] = useState(initialFilters.location || "");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFiltersChange();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    handleFiltersChange();
  }, [
    ownerType,
    isApproved,
    isAvailable,
    briefType,
    propertyType,
    buildingType,
    isPremium,
    isPreference,
    priceMin,
    priceMax,
    location,
  ]);

  const handleFiltersChange = () => {
    const filters: any = {};

    if (searchQuery) filters.search = searchQuery;
    if (ownerType !== "all") filters.ownerType = ownerType;
    if (isApproved !== "all") filters.isApproved = isApproved === "approved";
    if (isAvailable !== "all") filters.isAvailable = isAvailable;
    if (briefType !== "all") filters.briefType = briefType;
    if (propertyType !== "all") filters.propertyType = propertyType;
    if (buildingType !== "all") filters.buildingType = buildingType;
    if (isPremium !== "all") filters.isPremium = isPremium === "true";
    if (isPreference !== "all") filters.isPreference = isPreference === "true";
    if (priceMin) filters.priceMin = parseInt(priceMin);
    if (priceMax) filters.priceMax = parseInt(priceMax);
    if (location) filters.location = location;

    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setOwnerType("all");
    setIsApproved("all");
    setIsAvailable("all");
    setBriefType("all");
    setPropertyType("all");
    setBuildingType("all");
    setIsPremium("all");
    setIsPreference("all");
    setPriceMin("");
    setPriceMax("");
    setLocation("");
  };

  const hasActiveFilters =
    searchQuery ||
    ownerType !== "all" ||
    isApproved !== "all" ||
    isAvailable !== "all" ||
    briefType !== "all" ||
    propertyType !== "all" ||
    buildingType !== "all" ||
    isPremium !== "all" ||
    isPreference !== "all" ||
    priceMin ||
    priceMax ||
    location;

  return (
    <Card className={`border border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-600" />
            Filter Properties
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by location, type, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          {/* Owner Type */}
          <Select value={ownerType} onValueChange={setOwnerType}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Owner Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Owners</SelectItem>
              <SelectItem value="Agent">Agents</SelectItem>
              <SelectItem value="Landowners">Landowners</SelectItem>
            </SelectContent>
          </Select>

          {/* Approval Status */}
          <Select value={isApproved} onValueChange={setIsApproved}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Approval Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Availability */}
          <Select value={isAvailable} onValueChange={setIsAvailable}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Available</SelectItem>
              <SelectItem value="no">Not Available</SelectItem>
            </SelectContent>
          </Select>

          {/* Brief Type */}
          <Select value={briefType} onValueChange={setBriefType}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Brief Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="lease">Lease</SelectItem>
            </SelectContent>
          </Select>

          {/* Property Type */}
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>

          {/* Building Type */}
          <Select value={buildingType} onValueChange={setBuildingType}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Building Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Buildings</SelectItem>
              <SelectItem value="Flat/Apartment">Flat/Apartment</SelectItem>
              <SelectItem value="Duplex">Duplex</SelectItem>
              <SelectItem value="Bungalow">Bungalow</SelectItem>
              <SelectItem value="Office Space">Office Space</SelectItem>
              <SelectItem value="Shop">Shop</SelectItem>
              <SelectItem value="Warehouse">Warehouse</SelectItem>
            </SelectContent>
          </Select>

          {/* Premium */}
          <Select value={isPremium} onValueChange={setIsPremium}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Premium" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Premium Only</SelectItem>
              <SelectItem value="false">Non-Premium</SelectItem>
            </SelectContent>
          </Select>

          {/* Location */}
          <Input
            placeholder="Location (state, LGA, area)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-11"
          />

          {/* Price Range */}
          <Input
            placeholder="Min Price"
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="h-11"
          />

          <Input
            placeholder="Max Price"
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="h-11"
          />
        </div>
      </CardContent>
    </Card>
  );
}
