"use client";

import { useState, useEffect } from "react";
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

function LandlordDetailContent({ params }: LandlordDetailPageProps) {
  const router = useRouter();
  const [landlordId, setLandlordId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => setLandlordId(id));
  }, [params]);

  const {
    data: landlordResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["landlord", landlordId],
    queryFn: () => apiService.getLandowner(landlordId!),
    enabled: !!landlordId,
  });

  const { data: propertiesResponse, isLoading: propertiesLoading } = useQuery({
    queryKey: ["landlord-properties", landlordId],
    queryFn: () => apiService.getProperties({ landlordId: landlordId }),
    enabled: !!landlordId,
  });

  // Extract data from API response or use fallback
  const landlordData = landlordResponse?.data;
  const landlord = landlordData?.user
    ? {
        ...landlordData.user,
        stats: landlordData.stats || {
          totalProperties: landlordData.properties?.length || 0,
          totalTransactions: landlordData.transactions?.length || 0,
          totalEarned: landlordData.stats?.totalEarned || 0,
          completedInspections:
            landlordData.inspections?.filter(
              (i: any) => i.status === "completed",
            )?.length || 0,
          pendingNegotiations:
            landlordData.inspections?.filter(
              (i: any) => i.stage === "negotiation",
            )?.length || 0,
        },
      }
    : {
        _id: landlordId,
        firstName: "Landlord",
        lastName: "Name",
        email: "landlord@example.com",
        phoneNumber: "+234 000 000 0000",
        fullName: "Landlord Name",
        userType: "Landowners",
        accountApproved: false,
        accountStatus: "pending",
        isFlagged: false,
        profile_picture: "/placeholder.svg",
        stats: {
          totalProperties: 0,
          totalTransactions: 0,
          totalEarned: 0,
          completedInspections: 0,
          pendingNegotiations: 0,
        },
      };

  const properties = landlordData?.properties || [];
  const transactions = landlordData?.transactions || [];
  const inspections = landlordData?.inspections || [];

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
                <PropertiesTab userId={landlordId} userType="landlord" />
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
