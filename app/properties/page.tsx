"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

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
      image: "/placeholder.svg",
      agent: "Sarah Johnson",
      listed: "2024-01-15",
      views: 245,
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
      image: "/placeholder.svg",
      agent: "Mike Wilson",
      listed: "2024-01-10",
      views: 189,
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
      image: "/placeholder.svg",
      agent: "Emma Davis",
      listed: "2024-01-20",
      views: 67,
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
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case "sold":
        return <Badge className="bg-blue-100 text-blue-800">Sold</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Property Management"
          description="Manage your property listings, track performance, and oversee all real estate operations"
        >
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
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
              Filter Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search properties by title, address..."
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
            </div>
          </CardContent>
        </Card>

        {/* Properties Table */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <span className="text-lg font-medium">Property Listings</span>
                  <p className="text-sm text-gray-600 font-normal">
                    {filteredProperties.length} properties found
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {filteredProperties.length} showing
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">
                      Property
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Details
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Price
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Agent
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Performance
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property, index) => (
                    <TableRow
                      key={property.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-16 h-12 object-cover rounded-lg border shadow-sm"
                            />
                            {property.featured && (
                              <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {property.title}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {property.address}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{property.bedrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{property.bathrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Square className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{property.sqft} ft²</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {property.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="font-semibold text-lg">
                          {formatPrice(property.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${Math.round(property.price / property.sqft)}/ft²
                        </p>
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="font-medium">{property.agent}</p>
                        <p className="text-sm text-gray-500">
                          Listed {property.listed}
                        </p>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(property.status)}
                        {property.featured && (
                          <Badge
                            variant="outline"
                            className="ml-1 text-yellow-700 border-yellow-300"
                          >
                            Featured
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="text-sm font-medium">
                          {property.views} views
                        </p>
                        <p className="text-xs text-gray-500">Last 30 days</p>
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
      </div>
    </AdminLayout>
  );
}
