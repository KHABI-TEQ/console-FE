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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiService } from "@/lib/services/apiService";
import { useAgents } from "@/contexts/AgentsContext";

interface AgentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AgentDetailPage({
  params,
}: AgentDetailPageProps) {
  const { id: agentId } = await params;
  const router = useRouter();
  const { flagAgent } = useAgents();
  const [isFlagging, setIsFlagging] = useState(false);

  const {
    data: agentResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: () => apiService.getAgent(agentId),
  });

  const { data: propertiesResponse, isLoading: propertiesLoading } = useQuery({
    queryKey: ["agent-properties", agentId],
    queryFn: () => apiService.getAgentProperties(agentId),
  });

  // Mock data for demonstration
  const mockAgent = {
    _id: agentId,
    firstName: "Khabi",
    lastName: "Tek",
    email: "info@khabiteqrealty.com",
    phoneNumber: "+234 802 345 6789",
    role: "Agent",
    company: "Khabi Teq Realty",
    avatar: "/placeholder.svg",
    isAccountVerified: true,
    accountApproved: true,
    accountStatus: "active",
    isFlagged: false,
    isInActive: false,
    createdAt: "2025-06-01T13:39:07.618Z",
    updatedAt: "2025-06-01T13:39:07.618Z",
    bio: "Experienced real estate agent specializing in luxury properties in Lagos and Abuja. Over 10 years of experience in property sales and management.",
    location: "Lagos, Nigeria",
    specialties: [
      "Luxury Homes",
      "Commercial Properties",
      "Investment Properties",
    ],
    stats: {
      totalProperties: 45,
      activeBriefs: 12,
      totalSales: 125,
      totalRevenue: 2500000000,
      rating: 4.8,
      reviews: 89,
      responseTime: "2 hours",
      successRate: 92,
    },
    socialLinks: {
      website: "https://khabiteqrealty.com",
      linkedin: "https://linkedin.com/in/khabitek",
      twitter: "https://twitter.com/khabitek",
    },
  };

  const mockProperties = [
    {
      _id: "1",
      title: "Luxury Apartment - Victoria Island",
      location: "Victoria Island, Lagos",
      price: 450000000,
      type: "Residential",
      status: "active",
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      ],
      bedrooms: 4,
      bathrooms: 3,
      createdAt: "2025-01-15T10:30:00Z",
    },
    {
      _id: "2",
      title: "Commercial Complex - Lekki",
      location: "Lekki Phase 1, Lagos",
      price: 1200000000,
      type: "Commercial",
      status: "active",
      images: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      ],
      size: "5000 sqft",
      createdAt: "2025-01-10T14:20:00Z",
    },
  ];

  const mockBriefs = [
    {
      _id: "1",
      title: "Luxury Apartment Marketing Strategy",
      type: "Marketing",
      status: "active",
      priority: "high",
      isApproved: false,
      dueDate: "2025-02-15T10:30:00Z",
      progress: 75,
    },
    {
      _id: "2",
      title: "Property Inspection Guidelines",
      type: "Inspection",
      status: "pending",
      priority: "medium",
      isApproved: true,
      dueDate: "2025-01-25T14:20:00Z",
      progress: 45,
    },
  ];

  const agent = mockAgent;
  const properties = mockProperties;
  const briefs = mockBriefs;

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
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "flagged":
        return <Badge className="bg-red-100 text-red-800">Flagged</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApproveBrief = async (briefId: string) => {
    try {
      await apiService.patch(`/briefs/${briefId}/approve`);
      refetch();
    } catch (error) {
      console.error("Failed to approve brief:", error);
    }
  };

  const handleFlagAgent = async () => {
    if (isFlagging) return;

    setIsFlagging(true);
    try {
      const newStatus = agent.isFlagged ? "false" : "true";
      await flagAgent(agentId, newStatus);
      refetch(); // Refresh agent data after flagging
    } catch (error) {
      console.error("Failed to flag/unflag agent:", error);
    } finally {
      setIsFlagging(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading agent details...</p>
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
                    Error Loading Agent
                  </h3>
                  <p className="text-red-700 text-sm">
                    Failed to load agent details. Please try again.
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
                <AvatarImage src={agent.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-medium">
                  {agent.firstName[0]}
                  {agent.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {agent.firstName} {agent.lastName}
                </h1>
                <p className="text-gray-600">{agent.company}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusBadge(agent.accountStatus)}
                  {agent.isAccountVerified && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {agent.accountApproved && (
                    <Badge className="bg-green-100 text-green-800">
                      Approved
                    </Badge>
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
              Call Agent
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
                    {agent.stats.totalProperties}
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
                  <p className="text-sm text-gray-600">Active Briefs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {agent.stats.activeBriefs}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {agent.stats.totalSales}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
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
                      {agent.stats.rating}
                    </p>
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
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
                <TabsTrigger value="briefs">Briefs</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="properties">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Posted Properties</span>
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
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push(`/properties/${property._id}`)
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="briefs">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Submitted Briefs</span>
                      <Badge variant="secondary">{briefs.length} briefs</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {briefs.map((brief) => (
                        <Card
                          key={brief._id}
                          className="hover:shadow-md transition-all duration-200"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                  {brief.title}
                                </h3>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="outline">{brief.type}</Badge>
                                  {getStatusBadge(brief.status)}
                                  {brief.isApproved ? (
                                    <Badge className="bg-green-100 text-green-800">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Approved
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-yellow-100 text-yellow-800">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Pending Approval
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                {!brief.isApproved && (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleApproveBrief(brief._id)
                                    }
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    router.push(`/briefs/${brief._id}`)
                                  }
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
                                      onClick={() =>
                                        router.push(`/briefs/${brief._id}/edit`)
                                      }
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Brief
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <AlertTriangle className="mr-2 h-4 w-4" />
                                      Reject Brief
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>
                                  Due:{" "}
                                  {new Date(brief.dueDate).toLocaleDateString()}
                                </span>
                                <span>Progress: {brief.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-blue-600 h-1 rounded-full"
                                  style={{ width: `${brief.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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
                            Property listing approved
                          </p>
                          <p className="text-sm text-gray-500">
                            Luxury Apartment - Victoria Island was approved
                          </p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">New brief submitted</p>
                          <p className="text-sm text-gray-500">
                            Marketing strategy brief for luxury properties
                          </p>
                          <p className="text-xs text-gray-400">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <Building className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Property updated</p>
                          <p className="text-sm text-gray-500">
                            Updated pricing for Commercial Complex - Lekki
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
                  <span className="text-sm">{agent.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{agent.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{agent.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    Joined {new Date(agent.createdAt).toLocaleDateString()}
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
                  {agent.bio}
                </p>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {agent.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Revenue:</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(agent.stats.totalRevenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Success Rate:</span>
                  <span className="text-sm font-medium">
                    {agent.stats.successRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Time:</span>
                  <span className="text-sm font-medium">
                    {agent.stats.responseTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reviews:</span>
                  <span className="text-sm font-medium">
                    {agent.stats.reviews}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
