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
  UserCheck,
  UserPlus,
  DollarSign,
  Heart,
  Eye,
  Search,
  Filter,
  Plus,
  Download,
  RefreshCw,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Clock,
  Star,
  Home,
  CreditCard,
} from "lucide-react";

export default function BuyersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");

  const stats = [
    {
      title: "Total Buyers",
      value: "1,842",
      change: "+15.3%",
      trend: "up" as const,
      icon: Users,
      color: "blue" as const,
    },
    {
      title: "Active Buyers",
      value: "1,156",
      change: "+12.1%",
      trend: "up" as const,
      icon: UserCheck,
      color: "green" as const,
    },
    {
      title: "New Leads",
      value: "89",
      change: "+23.5%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "orange" as const,
    },
    {
      title: "Total Budget Pool",
      value: "$142M",
      change: "+8.7%",
      trend: "up" as const,
      icon: DollarSign,
      color: "purple" as const,
    },
  ];

  const buyers = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      avatar: "/placeholder.svg",
      status: "Active",
      budget: { min: 800000, max: 1200000 },
      preferences: ["Modern", "2-3 Bedrooms", "Downtown"],
      agent: "Sarah Johnson",
      joined: "2024-01-15",
      lastActivity: "2 hours ago",
      savedProperties: 12,
      viewedProperties: 45,
      rating: 4.8,
      preApproved: true,
    },
    {
      id: 2,
      name: "Lisa Chen",
      email: "lisa.chen@example.com",
      phone: "+1 (555) 234-5678",
      location: "San Francisco, CA",
      avatar: "/placeholder.svg",
      status: "Looking",
      budget: { min: 1500000, max: 2000000 },
      preferences: ["Luxury", "Ocean View", "3+ Bedrooms"],
      agent: "Mike Wilson",
      joined: "2023-12-10",
      lastActivity: "1 day ago",
      savedProperties: 8,
      viewedProperties: 23,
      rating: 4.9,
      preApproved: true,
    },
    {
      id: 3,
      name: "David Rodriguez",
      email: "david.rodriguez@example.com",
      phone: "+1 (555) 345-6789",
      location: "Miami, FL",
      avatar: "/placeholder.svg",
      status: "Lead",
      budget: { min: 400000, max: 600000 },
      preferences: ["First-time Buyer", "Condo", "Near Transit"],
      agent: "Emma Davis",
      joined: "2024-01-20",
      lastActivity: "3 days ago",
      savedProperties: 3,
      viewedProperties: 12,
      rating: 4.6,
      preApproved: false,
    },
  ];

  const filteredBuyers = buyers.filter((buyer) => {
    const matchesSearch =
      buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || buyer.status.toLowerCase() === statusFilter;
    const matchesBudget =
      budgetFilter === "all" ||
      (budgetFilter === "under-500k" && buyer.budget.max <= 500000) ||
      (budgetFilter === "500k-1m" &&
        buyer.budget.min >= 500000 &&
        buyer.budget.max <= 1000000) ||
      (budgetFilter === "1m-2m" &&
        buyer.budget.min >= 1000000 &&
        buyer.budget.max <= 2000000) ||
      (budgetFilter === "over-2m" && buyer.budget.min >= 2000000);
    return matchesSearch && matchesStatus && matchesBudget;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "looking":
        return <Badge className="bg-blue-100 text-blue-800">Looking</Badge>;
      case "lead":
        return <Badge className="bg-orange-100 text-orange-800">Lead</Badge>;
      case "qualified":
        return (
          <Badge className="bg-purple-100 text-purple-800">Qualified</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Buyer Management"
          description="Manage buyer relationships, track preferences, and optimize the buying experience"
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
            <UserPlus className="h-4 w-4 mr-2" />
            Add Buyer
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
              Filter Buyers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search buyers by name, email, location..."
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
                  <SelectItem value="looking">Looking</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                </SelectContent>
              </Select>
              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Budget Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Budgets</SelectItem>
                  <SelectItem value="under-500k">Under $500K</SelectItem>
                  <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                  <SelectItem value="1m-2m">$1M - $2M</SelectItem>
                  <SelectItem value="over-2m">Over $2M</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Buyers Table */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <span className="text-lg font-medium">Active Buyers</span>
                  <p className="text-sm text-gray-600 font-normal">
                    {filteredBuyers.length} buyers found
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {filteredBuyers.length} showing
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
                      Contact Info
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Budget & Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Preferences
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Activity
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Agent & Rating
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBuyers.map((buyer, index) => (
                    <TableRow
                      key={buyer.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={buyer.avatar} alt={buyer.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                              {buyer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {buyer.name}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {buyer.preApproved && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-green-700 border-green-300"
                                >
                                  <CreditCard className="h-3 w-3 mr-1" />
                                  Pre-approved
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="truncate">{buyer.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{buyer.phone}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{buyer.location}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <div className="text-sm">
                            <p className="font-medium">
                              {formatCurrency(buyer.budget.min)} -{" "}
                              {formatCurrency(buyer.budget.max)}
                            </p>
                          </div>
                          {getStatusBadge(buyer.status)}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          {buyer.preferences.slice(0, 2).map((pref, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs mr-1"
                            >
                              {pref}
                            </Badge>
                          ))}
                          {buyer.preferences.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{buyer.preferences.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Heart className="h-4 w-4 text-red-400 mr-2" />
                            <span>{buyer.savedProperties} saved</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Eye className="h-4 w-4 text-blue-400 mr-2" />
                            <span>{buyer.viewedProperties} viewed</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-green-600">
                              {buyer.lastActivity}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">{buyer.agent}</p>
                          <div className="flex items-center space-x-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(buyer.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {buyer.rating}
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
