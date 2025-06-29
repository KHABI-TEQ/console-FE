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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
  Users,
  Heart,
  Home,
  MapPin,
  DollarSign,
  Search,
  Filter,
  Plus,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Settings,
  Star,
  Bed,
  Bath,
  Car,
  Wifi,
  Zap,
  TreePine,
} from "lucide-react";

export default function BuyerPreferencesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const stats = [
    {
      title: "Active Preferences",
      value: "1,247",
      change: "+18.2%",
      trend: "up" as const,
      icon: Heart,
      color: "blue" as const,
    },
    {
      title: "Matched Properties",
      value: "8,432",
      change: "+25.1%",
      trend: "up" as const,
      icon: Home,
      color: "green" as const,
    },
    {
      title: "Auto Notifications",
      value: "567",
      change: "+12.5%",
      trend: "up" as const,
      icon: Settings,
      color: "orange" as const,
    },
    {
      title: "Success Rate",
      value: "92%",
      change: "+5.3%",
      trend: "up" as const,
      icon: Star,
      color: "purple" as const,
    },
  ];

  const buyerPreferences = [
    {
      id: 1,
      buyer: {
        name: "John Smith",
        email: "john.smith@example.com",
        avatar: "/placeholder.svg",
      },
      status: "Active",
      budget: { min: 800000, max: 1200000 },
      location: ["Downtown", "Midtown", "Financial District"],
      propertyType: ["Apartment", "Condo"],
      bedrooms: { min: 2, max: 3 },
      bathrooms: { min: 2, max: null },
      amenities: ["Gym", "Pool", "Doorman", "Parking"],
      preferences: {
        petFriendly: true,
        furnished: false,
        newConstruction: true,
        waterfront: false,
      },
      notifications: true,
      lastUpdated: "2024-01-15",
      matchedProperties: 24,
    },
    {
      id: 2,
      buyer: {
        name: "Lisa Chen",
        email: "lisa.chen@example.com",
        avatar: "/placeholder.svg",
      },
      status: "Active",
      budget: { min: 1500000, max: 2500000 },
      location: ["Upper East Side", "Tribeca", "SoHo"],
      propertyType: ["Penthouse", "Luxury Apartment"],
      bedrooms: { min: 3, max: 4 },
      bathrooms: { min: 3, max: null },
      amenities: ["Concierge", "Rooftop", "Wine Cellar", "Private Elevator"],
      preferences: {
        petFriendly: false,
        furnished: true,
        newConstruction: true,
        waterfront: true,
      },
      notifications: true,
      lastUpdated: "2024-01-12",
      matchedProperties: 8,
    },
    {
      id: 3,
      buyer: {
        name: "David Rodriguez",
        email: "david.rodriguez@example.com",
        avatar: "/placeholder.svg",
      },
      status: "Paused",
      budget: { min: 400000, max: 600000 },
      location: ["Brooklyn", "Queens", "Long Island City"],
      propertyType: ["Studio", "1-Bedroom"],
      bedrooms: { min: 0, max: 1 },
      bathrooms: { min: 1, max: 1 },
      amenities: ["Laundry", "Internet", "Near Transit"],
      preferences: {
        petFriendly: true,
        furnished: false,
        newConstruction: false,
        waterfront: false,
      },
      notifications: false,
      lastUpdated: "2024-01-08",
      matchedProperties: 45,
    },
  ];

  const filteredPreferences = buyerPreferences.filter((pref) => {
    const matchesSearch =
      pref.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pref.buyer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pref.location.some((loc) =>
        loc.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesStatus =
      statusFilter === "all" ||
      pref.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "paused":
        return <Badge className="bg-orange-100 text-orange-800">Paused</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Buyer Preferences"
          description="Manage buyer and tenant property preferences, matching criteria, and notification settings"
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
            Add Preferences
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
              Filter Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by buyer name, email, or location..."
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
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Table */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <span className="text-lg font-medium">Buyer Preferences</span>
                  <p className="text-sm text-gray-600 font-normal">
                    {filteredPreferences.length} preference profiles found
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {filteredPreferences.length} showing
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">
                      Buyer
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Budget & Property
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Location Preferences
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Features & Amenities
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Status & Matches
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPreferences.map((pref, index) => (
                    <TableRow
                      key={pref.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={pref.buyer.avatar}
                              alt={pref.buyer.name}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                              {pref.buyer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {pref.buyer.name}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {pref.buyer.email}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Updated: {pref.lastUpdated}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <div className="text-sm">
                            <p className="font-medium">
                              {formatCurrency(pref.budget.min)} -{" "}
                              {formatCurrency(pref.budget.max)}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {pref.propertyType.map((type, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {type}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-600">
                            <span className="flex items-center">
                              <Bed className="h-3 w-3 mr-1" />
                              {pref.bedrooms.min}-{pref.bedrooms.max || "+"} bed
                            </span>
                            <span className="flex items-center">
                              <Bath className="h-3 w-3 mr-1" />
                              {pref.bathrooms.min}+ bath
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          {pref.location.slice(0, 2).map((loc, idx) => (
                            <div
                              key={idx}
                              className="flex items-center text-sm"
                            >
                              <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                              <span>{loc}</span>
                            </div>
                          ))}
                          {pref.location.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{pref.location.length - 2} more locations
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {pref.amenities.slice(0, 3).map((amenity, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {amenity}
                              </Badge>
                            ))}
                            {pref.amenities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{pref.amenities.length - 3}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-3 text-xs">
                            {pref.preferences.petFriendly && (
                              <span className="text-green-600">
                                Pet Friendly
                              </span>
                            )}
                            {pref.preferences.furnished && (
                              <span className="text-blue-600">Furnished</span>
                            )}
                            {pref.preferences.newConstruction && (
                              <span className="text-purple-600">New</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          {getStatusBadge(pref.status)}
                          <div className="text-sm">
                            <p className="font-medium text-blue-600">
                              {pref.matchedProperties} matches
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div
                              className={`w-2 h-2 rounded-full ${pref.notifications ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span className="text-xs text-gray-600">
                              {pref.notifications
                                ? "Notifications On"
                                : "Notifications Off"}
                            </span>
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
                            className="hover:bg-purple-50 hover:border-purple-300"
                          >
                            <Home className="h-4 w-4" />
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
