"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  ClipboardList,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Building,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Shield,
  Users,
  UserCheck,
} from "lucide-react";
import { apiService } from "@/lib/services/apiService";

interface BriefFilters {
  search?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export default function BriefsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const filters: BriefFilters = {
    ...(searchQuery && { search: searchQuery }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(typeFilter !== "all" && { type: typeFilter }),
    page,
    limit,
  };

  const {
    data: briefsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["briefs", filters],
    queryFn: () => apiService.getBriefs(filters),
  });

  const briefs = briefsResponse?.data || [];
  const totalCount = briefsResponse?.total || 0;

  const stats = [
    {
      title: "Total Briefs",
      value: totalCount.toString(),
      change: "+12.5%",
      trend: "up" as const,
      icon: FileText,
      color: "blue" as const,
    },
    {
      title: "Active Briefs",
      value: briefs.filter((b: any) => b.status === "active").length.toString(),
      change: "+8.2%",
      trend: "up" as const,
      icon: ClipboardList,
      color: "green" as const,
    },
    {
      title: "Pending Review",
      value: briefs
        .filter((b: any) => b.status === "pending")
        .length.toString(),
      change: "-8.2%",
      trend: "down" as const,
      icon: Clock,
      color: "orange" as const,
    },
    {
      title: "Completed",
      value: briefs
        .filter((b: any) => b.status === "completed")
        .length.toString(),
      change: "+25.1%",
      trend: "up" as const,
      icon: Star,
      color: "purple" as const,
    },
  ];

  const briefs = [
    {
      id: 1,
      title: "Downtown Apartment Marketing Brief",
      description:
        "Comprehensive marketing strategy for luxury apartment complex",
      type: "Marketing",
      status: "Active",
      priority: "High",
      property: "Modern Downtown Apartment",
      assignedTo: "Sarah Johnson",
      createdDate: "2024-01-15",
      dueDate: "2024-02-15",
      progress: 75,
      attachments: 8,
      comments: 12,
    },
    {
      id: 2,
      title: "Luxury Home Inspection Report",
      description: "Detailed inspection requirements and documentation",
      type: "Inspection",
      status: "In Progress",
      priority: "Medium",
      property: "Luxury Family Home",
      assignedTo: "Mike Wilson",
      createdDate: "2024-01-10",
      dueDate: "2024-01-25",
      progress: 45,
      attachments: 5,
      comments: 8,
    },
    {
      id: 3,
      title: "Studio Loft Sales Strategy",
      description: "Sales approach and pricing strategy for studio units",
      type: "Sales",
      status: "Completed",
      priority: "Low",
      property: "Cozy Studio Loft",
      assignedTo: "Emma Davis",
      createdDate: "2024-01-05",
      dueDate: "2024-01-20",
      progress: 100,
      attachments: 3,
      comments: 15,
    },
  ];

  const filteredBriefs = briefs.filter((brief) => {
    const matchesSearch =
      brief.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brief.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brief.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      brief.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType =
      typeFilter === "all" ||
      brief.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "in progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      case "on hold":
        return <Badge className="bg-yellow-100 text-yellow-800">On Hold</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Brief Management"
          description="Create, manage, and track property briefs, documentation, and project workflows"
        >
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Brief
          </Button>
        </PageHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Filters */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-gray-600" />
              Filter Briefs
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search briefs by title, description, property..."
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
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Briefs Sections */}
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Admin Briefs</span>
            </TabsTrigger>
            <TabsTrigger value="agent" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Agent Briefs</span>
            </TabsTrigger>
            <TabsTrigger
              value="landlord"
              className="flex items-center space-x-2"
            >
              <UserCheck className="h-4 w-4" />
              <span>Landlord Briefs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="mt-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                    <div>
                      <span className="text-lg font-medium">Admin Briefs</span>
                      <p className="text-sm text-gray-600 font-normal">
                        Internal administrative briefs and documentation
                      </p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Admin Brief
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">
                          Brief
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Department
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Type & Status
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Assigned To
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Progress
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Timeline
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          id: 1,
                          title: "Q1 Performance Review Guidelines",
                          description:
                            "Comprehensive guidelines for quarterly performance reviews",
                          type: "Policy",
                          status: "Active",
                          priority: "High",
                          department: "HR",
                          assignedTo: "Admin Team",
                          createdDate: "2024-01-15",
                          dueDate: "2024-02-15",
                          progress: 85,
                          attachments: 5,
                          comments: 8,
                        },
                        {
                          id: 2,
                          title: "System Security Audit",
                          description:
                            "Annual security audit and compliance documentation",
                          type: "Audit",
                          status: "In Progress",
                          priority: "High",
                          department: "IT",
                          assignedTo: "Security Team",
                          createdDate: "2024-01-10",
                          dueDate: "2024-03-01",
                          progress: 45,
                          attachments: 12,
                          comments: 15,
                        },
                      ].map((brief, index) => (
                        <TableRow
                          key={brief.id}
                          className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                        >
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900">
                                {brief.title}
                              </p>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {brief.description}
                              </p>
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {brief.attachments} files
                                </span>
                                <span>{brief.comments} comments</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant="outline"
                              className="text-blue-700 border-blue-200"
                            >
                              {brief.department}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-2">
                              <Badge variant="outline" className="text-xs">
                                {brief.type}
                              </Badge>
                              <div>{getStatusBadge(brief.status)}</div>
                              <div>{getPriorityBadge(brief.priority)}</div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {brief.assignedTo}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {brief.progress}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${brief.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                <span>Created: {brief.createdDate}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                <span>Due: {brief.dueDate}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-green-50 hover:border-green-300"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-red-50 hover:border-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agent" className="mt-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-600" />
                    <div>
                      <span className="text-lg font-medium">Agent Briefs</span>
                      <p className="text-sm text-gray-600 font-normal">
                        Briefs and instructions for real estate agents
                      </p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Agent Brief
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">
                          Brief
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Property
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Type & Status
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Agent
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Progress
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Timeline
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBriefs.map((brief, index) => (
                        <TableRow
                          key={brief.id}
                          className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                        >
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900">
                                {brief.title}
                              </p>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {brief.description}
                              </p>
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {brief.attachments} files
                                </span>
                                <span>{brief.comments} comments</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {brief.property}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-2">
                              <Badge variant="outline" className="text-xs">
                                {brief.type}
                              </Badge>
                              <div>{getStatusBadge(brief.status)}</div>
                              <div>{getPriorityBadge(brief.priority)}</div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {brief.assignedTo}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {brief.progress}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full transition-all"
                                  style={{ width: `${brief.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                <span>Created: {brief.createdDate}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                <span>Due: {brief.dueDate}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-green-50 hover:border-green-300"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-red-50 hover:border-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="landlord" className="mt-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-2 text-orange-600" />
                    <div>
                      <span className="text-lg font-medium">
                        Landlord Briefs
                      </span>
                      <p className="text-sm text-gray-600 font-normal">
                        Communication and documentation for landlords
                      </p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Landlord Brief
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">
                          Brief
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Property
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Type & Status
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Landlord
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Progress
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Timeline
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          id: 1,
                          title: "Property Maintenance Guidelines",
                          description:
                            "Annual maintenance requirements and scheduling",
                          type: "Maintenance",
                          status: "Active",
                          priority: "Medium",
                          property: "Downtown Luxury Complex",
                          assignedTo: "Premium Properties LLC",
                          createdDate: "2024-01-12",
                          dueDate: "2024-02-28",
                          progress: 65,
                          attachments: 7,
                          comments: 12,
                        },
                        {
                          id: 2,
                          title: "Lease Renewal Process",
                          description:
                            "Updated lease renewal procedures and documentation",
                          type: "Legal",
                          status: "Pending",
                          priority: "High",
                          property: "Garden View Apartments",
                          assignedTo: "Metro Holdings Inc",
                          createdDate: "2024-01-18",
                          dueDate: "2024-02-20",
                          progress: 30,
                          attachments: 4,
                          comments: 8,
                        },
                      ].map((brief, index) => (
                        <TableRow
                          key={brief.id}
                          className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                        >
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900">
                                {brief.title}
                              </p>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {brief.description}
                              </p>
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {brief.attachments} files
                                </span>
                                <span>{brief.comments} comments</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {brief.property}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-2">
                              <Badge variant="outline" className="text-xs">
                                {brief.type}
                              </Badge>
                              <div>{getStatusBadge(brief.status)}</div>
                              <div>{getPriorityBadge(brief.priority)}</div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <UserCheck className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {brief.assignedTo}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {brief.progress}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-orange-600 h-2 rounded-full transition-all"
                                  style={{ width: `${brief.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                <span>Created: {brief.createdDate}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                <span>Due: {brief.dueDate}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-green-50 hover:border-green-300"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-red-50 hover:border-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
