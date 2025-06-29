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
import { useConfirmation } from "@/contexts/ConfirmationContext";
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  User,
  Building,
  MapPin,
  Calendar,
  Target,
  FileText,
  Paperclip,
  MessageSquare,
  Share2,
  Download,
  AlertTriangle,
  DollarSign,
  Activity,
  Eye,
  RefreshCw,
} from "lucide-react";
import { apiService } from "@/lib/services/apiService";

interface BriefDetailPageProps {
  params: { id: string };
}

export default function BriefDetailPage({ params }: BriefDetailPageProps) {
  const router = useRouter();
  const { confirmAction } = useConfirmation();
  const [isApproving, setIsApproving] = useState(false);

  const {
    data: briefResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["brief", params.id],
    queryFn: () => apiService.getBrief(params.id),
  });

  // Mock data for demonstration
  const mockBrief = {
    _id: params.id,
    title: "Luxury Apartment Marketing Strategy",
    description:
      "Comprehensive marketing plan for high-end residential properties in Victoria Island. This brief outlines the strategic approach to positioning and promoting luxury apartments to target high-net-worth individuals.",
    type: "Marketing",
    status: "active",
    priority: "high",
    property: {
      _id: "prop1",
      type: "Residential",
      location: "Victoria Island, Lagos",
      price: 450000000,
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      ],
      details: {
        bedrooms: 4,
        bathrooms: 3,
        size: "2,500 sqft",
        features: ["Ocean View", "Swimming Pool", "Gym", "Concierge"],
      },
    },
    assignedTo: {
      _id: "user1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      role: "Marketing Manager",
      email: "sarah.johnson@company.com",
      phone: "+234 801 234 5678",
    },
    agent: {
      _id: "agent1",
      name: "Khabi Tek",
      company: "Khabi Teq Realty",
      email: "info@khabiteqrealty.com",
      phone: "+234 802 345 6789",
    },
    createdAt: "2025-01-15T10:30:00Z",
    dueDate: "2025-02-15T10:30:00Z",
    progress: 75,
    tags: ["Premium", "Marketing", "Social Media", "Digital Campaign"],
    isApproved: false,
    approvedBy: null,
    requirements:
      "1. Market research and competitor analysis\n2. Digital marketing strategy\n3. Social media campaign plan\n4. Budget allocation and timeline\n5. Performance metrics and KPIs",
    attachments: [
      {
        id: "1",
        name: "Market_Research_Report.pdf",
        size: "2.4 MB",
        type: "pdf",
        uploadedAt: "2025-01-16T14:20:00Z",
      },
      {
        id: "2",
        name: "Competitor_Analysis.xlsx",
        size: "1.8 MB",
        type: "excel",
        uploadedAt: "2025-01-17T09:15:00Z",
      },
      {
        id: "3",
        name: "Brand_Guidelines.zip",
        size: "15.6 MB",
        type: "archive",
        uploadedAt: "2025-01-18T16:45:00Z",
      },
    ],
    comments: [
      {
        id: "1",
        user: {
          name: "Sarah Johnson",
          avatar: "/placeholder.svg",
        },
        content:
          "Initial market research completed. Found strong demand in the luxury segment.",
        timestamp: "2025-01-20T10:30:00Z",
      },
      {
        id: "2",
        user: {
          name: "Admin User",
          avatar: "/placeholder.svg",
        },
        content:
          "Great work on the research. Please proceed with the strategy document.",
        timestamp: "2025-01-20T14:15:00Z",
      },
    ],
    timeline: [
      {
        id: "1",
        title: "Brief Created",
        description: "Initial brief created and assigned",
        timestamp: "2025-01-15T10:30:00Z",
        status: "completed",
      },
      {
        id: "2",
        title: "Market Research",
        description: "Research phase completed",
        timestamp: "2025-01-20T10:30:00Z",
        status: "completed",
      },
      {
        id: "3",
        title: "Strategy Development",
        description: "Currently developing marketing strategy",
        timestamp: "2025-01-25T10:30:00Z",
        status: "in_progress",
      },
      {
        id: "4",
        title: "Campaign Launch",
        description: "Launch marketing campaign",
        timestamp: "2025-02-10T10:30:00Z",
        status: "pending",
      },
    ],
  };

  const brief = mockBrief;

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
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case "on_hold":
        return <Badge className="bg-gray-100 text-gray-800">On Hold</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const handleDeleteBrief = () => {
    confirmAction({
      title: "Delete Brief",
      description: `Are you sure you want to delete "${brief.title}"? This action cannot be undone and will remove all associated data including attachments and comments.`,
      confirmText: "Delete Brief",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        try {
          await apiService.deleteBrief(params.id);
          router.push("/briefs");
        } catch (error) {
          console.error("Failed to delete brief:", error);
        }
      },
    });
  };

  const handleApproveBrief = async () => {
    setIsApproving(true);
    try {
      await apiService.patch(`/briefs/${params.id}/approve`);
      refetch();
    } catch (error) {
      console.error("Failed to approve brief:", error);
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading brief details...</p>
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
                    Error Loading Brief
                  </h3>
                  <p className="text-red-700 text-sm">
                    Failed to load brief details. Please try again.
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {brief.title}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge(brief.status)}
                {getPriorityBadge(brief.priority)}
                <Badge variant="outline">{brief.type}</Badge>
                {brief.isApproved && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approved
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            {!brief.isApproved && (
              <Button
                onClick={handleApproveBrief}
                disabled={isApproving}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                {isApproving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Approving...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Brief
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/briefs/${params.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModal({ isOpen: true, isLoading: false })}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="property">Property</TabsTrigger>
                <TabsTrigger value="attachments">Files</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Brief Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {brief.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Requirements</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                          {brief.requirements}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {brief.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Progress</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Completion Progress</span>
                          <span className="font-medium">{brief.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${brief.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="property">
                <Card>
                  <CardHeader>
                    <CardTitle>Associated Property</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <img
                          src={brief.property.images[0]}
                          alt="Property"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {brief.property.images.slice(1, 4).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Property ${idx + 2}`}
                              className="w-full h-16 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {brief.property.type} Property
                          </h3>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {brief.property.location}
                          </p>
                        </div>

                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(brief.property.price)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Bedrooms:</span>
                            <span className="font-medium">
                              {brief.property.details.bedrooms}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Bathrooms:</span>
                            <span className="font-medium">
                              {brief.property.details.bathrooms}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Size:</span>
                            <span className="font-medium">
                              {brief.property.details.size}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Features</h4>
                          <div className="flex flex-wrap gap-1">
                            {brief.property.details.features.map(
                              (feature, idx) => (
                                <Badge key={idx} variant="outline">
                                  {feature}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          onClick={() =>
                            router.push(`/properties/${brief.property._id}`)
                          }
                          className="w-full"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Property Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attachments">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Attachments</span>
                      <Badge variant="secondary">
                        {brief.attachments.length} files
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {brief.attachments.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Paperclip className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-gray-500">
                                {file.size} •{" "}
                                {new Date(file.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {brief.timeline.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-start space-x-3"
                        >
                          <div className="flex-shrink-0 mt-1">
                            {item.status === "completed" ? (
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </div>
                            ) : item.status === "in_progress" ? (
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <Activity className="h-4 w-4 text-blue-600" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <Clock className="h-4 w-4 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          {index < brief.timeline.length - 1 && (
                            <div className="absolute left-3 mt-8 w-px h-8 bg-gray-200"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={brief.assignedTo.avatar} />
                    <AvatarFallback>
                      {brief.assignedTo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{brief.assignedTo.name}</p>
                    <p className="text-sm text-gray-600">
                      {brief.assignedTo.role}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span>
                      {new Date(brief.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span>{new Date(brief.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Posted By
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{brief.agent.name}</p>
                    <p className="text-sm text-gray-600">
                      {brief.agent.company}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Email:</span>
                      <span>{brief.agent.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Phone:</span>
                      <span>{brief.agent.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium">{brief.progress}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Attachments:</span>
                  <span className="font-medium">
                    {brief.attachments.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Comments:</span>
                  <span className="font-medium">{brief.comments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  {getStatusBadge(brief.status)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, isLoading: false })}
          onConfirm={handleDeleteBrief}
          title="Delete Brief"
          description={`Are you sure you want to delete "${brief.title}"? This action cannot be undone and will remove all associated data including attachments and comments.`}
          confirmText="Delete Brief"
          variant="danger"
          isLoading={deleteModal.isLoading}
        />
      </div>
    </AdminLayout>
  );
}
