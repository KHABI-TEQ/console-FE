"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  RefreshCw,
  MoreHorizontal,
  FileText,
  Briefcase,
  CreditCard,
  Shield,
  Home,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiService } from "@/lib/services/apiService";
import { PropertiesTab } from "@/components/shared/PropertiesTab";

interface LandlordDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LandlordDetailPage({
  params,
}: LandlordDetailPageProps) {
  const { id: landlordId } = await params;
  const router = useRouter();

  const {
    data: landlordResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["landlord", landlordId],
    queryFn: () => apiService.getLandowner(landlordId),
  });

  const { data: propertiesResponse, isLoading: propertiesLoading } = useQuery({
    queryKey: ["landlord-properties", landlordId],
    queryFn: () => apiService.getProperties({ landlordId: landlordId }),
  });

  // Mock data for demonstration - replace with actual API data when available
  const mockLandlord = {
    _id: landlordId,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phoneNumber: "+234 803 456 7890",
    role: "Landlord",
    avatar: "/placeholder.svg",
    isAccountVerified: true,
    accountApproved: true,
    accountStatus: "active",
    isFlagged: false,
    isInActive: false,
    createdAt: "2024-06-01T13:39:07.618Z",
    updatedAt: "2024-06-01T13:39:07.618Z",
    bio: "Experienced property owner with a diverse portfolio of residential and commercial properties across Lagos and Abuja. Committed to providing quality housing solutions.",
    location: "Lagos, Nigeria",
    userType: "Individual",
    accountId: "LL001234",
    stats: {
      totalProperties: 12,
      activeListings: 8,
      totalTenants: 45,
      totalRevenue: 850000000,
      rating: 4.6,
      reviews: 32,
      occupancyRate: 92,
      avgRent: 2500000,
    },
    bankDetails: {
      accountName: "John Smith",
      accountNumber: "0123456789",
      bankName: "First Bank of Nigeria",
      isVerified: true,
    },
  };

  const mockProperties = [
    {
      _id: "1",
      title: "Modern 3-Bedroom Apartment",
      location: "Victoria Island, Lagos",
      price: 75000000,
      type: "Residential",
      status: "occupied",
      tenant: "Sarah Johnson",
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      ],
      bedrooms: 3,
      bathrooms: 2,
      monthlyRent: 2500000,
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      _id: "2",
      title: "Executive Office Complex",
      location: "Ikoyi, Lagos",
      price: 450000000,
      type: "Commercial",
      status: "vacant",
      images: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      ],
      size: "3000 sqft",
      monthlyRent: 8500000,
      createdAt: "2024-01-10T14:20:00Z",
    },
  ];

  const landlord = mockLandlord;
  const properties = mockProperties;

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
      case "occupied":
        return <Badge className="bg-blue-100 text-blue-800">Occupied</Badge>;
      case "vacant":
        return <Badge className="bg-yellow-100 text-yellow-800">Vacant</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "flagged":
        return <Badge className="bg-red-100 text-red-800">Flagged</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading landlord details...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
                    Error Loading Landlord
                  </h3>
                  <p className="text-red-700 text-sm">
                    Failed to load landlord details. Please try again.
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
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={landlord.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-lg font-medium">
                  {landlord.firstName[0]}
                  {landlord.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {landlord.firstName} {landlord.lastName}
                </h1>
                <p className="text-gray-600">{landlord.userType} Landlord</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusBadge(landlord.accountStatus)}
                  {landlord.isAccountVerified && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {landlord.accountApproved && (
                    <Badge className="bg-green-100 text-green-800">
                      Approved
                    </Badge>
                  )}
                  {landlord.accountId && (
                    <Badge variant="outline">ID: {landlord.accountId}</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Call Landlord
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {landlord.stats.totalProperties}
                  </p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {landlord.stats.activeListings}
                  </p>
                </div>
                <Home className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tenants</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {landlord.stats.totalTenants}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-2xl font-bold text-gray-900">
                      {landlord.stats.rating}
                    </p>
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="properties" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="tenants">Tenants</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="properties">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Property Portfolio</span>
                      <Badge variant="secondary">
                        {properties.length} properties
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {properties.map((property) => (
                        <Card
                          key={property._id}
                          className="hover:shadow-md transition-all duration-200"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-4">
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                      {property.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center mt-1">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {property.location}
                                    </p>
                                  </div>
                                  <div className="text-right ml-4">
                                    <p className="text-lg font-bold text-gray-900">
                                      {formatCurrency(property.price)}
                                    </p>
                                    {getStatusBadge(property.status)}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span>{property.type}</span>
                                    {property.bedrooms && (
                                      <span>{property.bedrooms} bed</span>
                                    )}
                                    {property.bathrooms && (
                                      <span>{property.bathrooms} bath</span>
                                    )}
                                    {property.size && (
                                      <span>{property.size}</span>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {property.monthlyRent && (
                                      <span className="text-sm text-green-600 font-medium">
                                        {formatCurrency(property.monthlyRent)}
                                        /month
                                      </span>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        router.push(
                                          `/properties/${property._id}`,
                                        )
                                      }
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                  </div>
                                </div>
                                {property.tenant && (
                                  <div className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium">
                                      Tenant:{" "}
                                    </span>
                                    {property.tenant}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tenants">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Tenants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">
                        Tenant management feature coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Property listing updated
                          </p>
                          <p className="text-sm text-gray-500">
                            Modern 3-Bedroom Apartment rent updated
                          </p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <Home className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">New tenant application</p>
                          <p className="text-sm text-gray-500">
                            Application received for Executive Office Complex
                          </p>
                          <p className="text-xs text-gray-400">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Rent payment received</p>
                          <p className="text-sm text-gray-500">
                            Monthly rent for Victoria Island property
                          </p>
                          <p className="text-xs text-gray-400">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{landlord.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{landlord.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{landlord.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    Joined {new Date(landlord.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Bank Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Bank Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Account Name</p>
                  <p className="font-medium">
                    {landlord.bankDetails.accountName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-medium">
                    {landlord.bankDetails.accountNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bank</p>
                  <p className="font-medium">{landlord.bankDetails.bankName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {landlord.bankDetails.isVerified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Revenue:</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(landlord.stats.totalRevenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Occupancy Rate:</span>
                  <span className="text-sm font-medium">
                    {landlord.stats.occupancyRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Rent:</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(landlord.stats.avgRent)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reviews:</span>
                  <span className="text-sm font-medium">
                    {landlord.stats.reviews}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {landlord.bio}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
