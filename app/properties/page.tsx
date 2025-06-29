"use client";

import { useState } from "react";
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
import {
  EmptyState,
  PropertiesEmptyState,
} from "@/components/shared/EmptyState";

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);

  const stats = [
    {
      title: "Total Properties",
      value: "2,847",
      change: "+12.5%",
      trend: "up" as const,
      icon: Building,
      color: "blue" as const,
    },
    {
      title: "Active Listings",
      value: "2,156",
      change: "+8.2%",
      trend: "up" as const,
      icon: CheckCircle,
      color: "green" as const,
    },
    {
      title: "Pending Approval",
      value: "43",
      change: "-15.3%",
      trend: "down" as const,
      icon: Clock,
      color: "orange" as const,
    },
    {
      title: "Total Value",
      value: "$485M",
      change: "+22.1%",
      trend: "up" as const,
      icon: DollarSign,
      color: "purple" as const,
    },
  ];

  const properties = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      address: "123 Main St, Downtown, NY 10001",
      price: 850000,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      type: "Apartment",
      status: "Active",
      featured: true,
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      agent: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg",
        rating: 4.8,
      },
      listed: "2024-01-15",
      views: 245,
      likes: 89,
      description:
        "Stunning modern apartment with floor-to-ceiling windows and premium finishes.",
      features: ["Parking", "Balcony", "Pet-Friendly", "Gym"],
    },
    {
      id: 2,
      title: "Luxury Family Home",
      address: "456 Oak Ave, Suburbs, NY 10002",
      price: 1250000,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800,
      type: "House",
      status: "Active",
      featured: false,
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      agent: {
        name: "Mike Wilson",
        avatar: "/placeholder.svg",
        rating: 4.6,
      },
      listed: "2024-01-10",
      views: 189,
      likes: 67,
      description:
        "Beautiful family home with large garden and modern amenities.",
      features: ["Garden", "Garage", "Fireplace", "Pool"],
    },
    {
      id: 3,
      title: "Cozy Studio Loft",
      address: "789 Pine St, Arts District, NY 10003",
      price: 450000,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 650,
      type: "Studio",
      status: "Pending",
      featured: false,
      images: ["/placeholder.svg", "/placeholder.svg"],
      agent: {
        name: "Emma Davis",
        avatar: "/placeholder.svg",
        rating: 4.9,
      },
      listed: "2024-01-20",
      views: 67,
      likes: 23,
      description: "Charming studio in the heart of the arts district.",
      features: ["Loft", "Exposed Brick", "Natural Light"],
    },
  ];

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || property.status.toLowerCase() === statusFilter;
    const matchesType =
      typeFilter === "all" || property.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "sold":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <DollarSign className="h-3 w-3 mr-1" />
            Sold
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  const PropertyCard = ({ property }: { property: any }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
      <div className="relative">
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {property.featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-yellow-500 text-white border-0 shadow-md">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            </div>
          )}
          <div className="absolute top-3 right-3 flex space-x-2">
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
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center space-x-1 text-xs text-white bg-black/50 rounded-full px-2 py-1">
              <Camera className="h-3 w-3" />
              <span>{property.images.length}</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-3 right-3">
          {getStatusBadge(property.status)}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {property.title}
          </h3>
          <p className="text-sm text-gray-600 flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {property.address}
          </p>
        </div>

        <div className="mb-3">
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(property.price)}
          </p>
          <p className="text-sm text-gray-500">
            ${Math.round(property.price / property.sqft)}/ft²
          </p>
        </div>

        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.sqft} ft²</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {property.type}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {property.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {property.features.slice(0, 3).map((feature: string, idx: number) => (
            <Badge
              key={idx}
              variant="secondary"
              className="text-xs px-2 py-0.5 bg-gray-100"
            >
              {feature}
            </Badge>
          ))}
          {property.features.length > 3 && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              +{property.features.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={property.agent.avatar} />
              <AvatarFallback className="text-xs">
                {property.agent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-medium">{property.agent.name}</span>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-500 ml-1">
                  {property.agent.rating}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {property.views}
            </div>
            <div className="flex items-center">
              <Heart className="h-3 w-3 mr-1" />
              {property.likes}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 hover:bg-blue-50 hover:border-blue-300"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 hover:bg-green-50 hover:border-green-300"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingPlaceholder type="page" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Property Management"
          description="Manage your property listings with visual insights and advanced filtering"
        >
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </PageHeader>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-md"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 opacity-50`}
              />
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp
                        className={`h-4 w-4 mr-1 ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center`}
                  >
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advanced Filters & View Toggle */}
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-gray-600" />
                Advanced Filters
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search properties, locations, features..."
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
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="h-11">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Properties Display */}
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <span className="text-lg font-medium">Property Listings</span>
                  <p className="text-sm text-gray-600 font-normal">
                    {filteredProperties.length} properties • {viewMode} view
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {filteredProperties.length} showing
                </Badge>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-high">Price High</SelectItem>
                    <SelectItem value="price-low">Price Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {filteredProperties.length === 0 ? (
              <PropertiesEmptyState
                onAction={() => {}}
                onSecondaryAction={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
              />
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProperties.map((property, index) => (
                  <Card
                    key={property.id}
                    className="hover:shadow-md transition-shadow border-0 shadow-sm"
                  >
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <div className="relative">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-24 h-20 object-cover rounded-lg"
                          />
                          {property.featured && (
                            <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
                          <div className="lg:col-span-2">
                            <h3 className="font-semibold text-lg">
                              {property.title}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {property.address}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Bed className="h-4 w-4 mr-1" />
                                {property.bedrooms}
                              </div>
                              <div className="flex items-center">
                                <Bath className="h-4 w-4 mr-1" />
                                {property.bathrooms}
                              </div>
                              <div className="flex items-center">
                                <Square className="h-4 w-4 mr-1" />
                                {property.sqft} ft²
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between">
                            <div>
                              <p className="text-xl font-bold">
                                {formatPrice(property.price)}
                              </p>
                              <p className="text-sm text-gray-500">
                                ${Math.round(property.price / property.sqft)}
                                /ft²
                              </p>
                            </div>
                            {getStatusBadge(property.status)}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={property.agent.avatar} />
                                <AvatarFallback className="text-xs">
                                  {property.agent.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {property.agent.name}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
