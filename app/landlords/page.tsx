"use client";

import { useState, useEffect } from "react";
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
  Home,
  UserPlus,
  DollarSign,
  Shield,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Star,
  Building,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useLandlords } from "@/contexts/LandlordsContext";
import { LandlordsProvider } from "@/contexts/LandlordsContext";
import { useConfirmation } from "@/components/modals/ConfirmationModal";

function LandlordsPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  const {
    landlords,
    isLoading,
    fetchLandlords,
    verifyLandlord,
    deleteLandlord,
  } = useLandlords();
  const { showConfirmation, ConfirmationComponent } = useConfirmation();

  useEffect(() => {
    fetchLandlords();
  }, []);

  const handleVerifyLandlord = (landlordId: string, status: string) => {
    showConfirmation(
      {
        title: `${status === "verified" ? "Verify" : "Reject"} Landlord`,
        description: `Are you sure you want to ${status === "verified" ? "verify" : "reject"} this landlord? This action will ${status === "verified" ? "allow them to list properties" : "prevent them from listing properties"}.`,
        confirmText: status === "verified" ? "Verify" : "Reject",
        variant: status === "verified" ? "success" : "warning",
      },
      () => verifyLandlord(landlordId, status),
    );
  };

  const handleDeleteLandlord = (landlordId: string) => {
    showConfirmation(
      {
        title: "Delete Landlord",
        description:
          "Are you sure you want to delete this landlord? This action cannot be undone and will remove all associated data.",
        confirmText: "Delete",
        variant: "danger",
      },
      () => deleteLandlord(landlordId),
    );
  };

  // Mock data for demonstration
  const mockLandlords = [
    {
      id: "1",
      name: "Michael Thompson",
      email: "michael.thompson@example.com",
      phone: "+1 (555) 123-4567",
      location: "Manhattan, NY",
      avatar: "/placeholder.svg",
      status: "Active",
      tier: "Premium",
      rating: 4.8,
      properties: 12,
      totalRevenue: 485000,
      joined: "2023-02-15",
      lastActive: "1 hour ago",
      specialties: ["Luxury Apartments", "Commercial Spaces"],
      verificationStatus: "verified",
      bankDetails: {
        accountNumber: "****1234",
        bankName: "Chase Bank",
        verified: true,
      },
    },
    {
      id: "2",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      phone: "+1 (555) 234-5678",
      location: "Brooklyn, NY",
      avatar: "/placeholder.svg",
      status: "Active",
      tier: "Standard",
      rating: 4.6,
      properties: 8,
      totalRevenue: 320000,
      joined: "2023-05-20",
      lastActive: "2 days ago",
      specialties: ["Residential", "Student Housing"],
      verificationStatus: "pending",
      bankDetails: {
        accountNumber: "****5678",
        bankName: "Bank of America",
        verified: false,
      },
    },
  ];

  const filteredLandlords = mockLandlords.filter((landlord) => {
    const matchesSearch =
      landlord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      landlord.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || landlord.status.toLowerCase() === statusFilter;
    const matchesVerification =
      verificationFilter === "all" ||
      landlord.verificationStatus === verificationFilter;
    return matchesSearch && matchesStatus && matchesVerification;
  });

  const stats = [
    {
      title: "Total Landlords",
      value: mockLandlords.length.toString(),
      change: "+15.2%",
      trend: "up" as const,
      icon: Home,
      color: "blue" as const,
    },
    {
      title: "Verified Landlords",
      value: mockLandlords
        .filter((l) => l.verificationStatus === "verified")
        .length.toString(),
      change: "+8.1%",
      trend: "up" as const,
      icon: Shield,
      color: "green" as const,
    },
    {
      title: "Total Properties",
      value: mockLandlords.reduce((sum, l) => sum + l.properties, 0).toString(),
      change: "+22.3%",
      trend: "up" as const,
      icon: Building,
      color: "purple" as const,
    },
    {
      title: "Total Revenue",
      value:
        "$" +
        (
          mockLandlords.reduce((sum, l) => sum + l.totalRevenue, 0) / 1000000
        ).toFixed(1) +
        "M",
      change: "+18.7%",
      trend: "up" as const,
      icon: DollarSign,
      color: "orange" as const,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Landlord Management"
          description="Manage property landlords, verification status, and revenue tracking"
        >
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Landlord
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
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-gray-600" />
              Filter Landlords
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search landlords by name, email..."
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
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={verificationFilter}
                onValueChange={setVerificationFilter}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Verification</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Landlords Table */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <span className="text-lg font-medium">
                    Property Landlords
                  </span>
                  <p className="text-sm text-gray-600 font-normal">
                    {filteredLandlords.length} landlords found
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {filteredLandlords.length} showing
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">
                      Landlord
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Contact Info
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Properties & Revenue
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Status & Verification
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Bank Details
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
                  {filteredLandlords.map((landlord, index) => (
                    <TableRow
                      key={landlord.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={landlord.avatar}
                              alt={landlord.name}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white font-medium">
                              {landlord.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {landlord.name}
                            </p>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(landlord.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-600 ml-1">
                                {landlord.rating}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="mt-1 text-xs bg-green-50 text-green-700"
                            >
                              {landlord.tier}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">{landlord.email}</p>
                          <p className="text-gray-600">{landlord.phone}</p>
                          <p className="text-gray-600 flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            {landlord.location}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Home className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="font-medium">
                              {landlord.properties} properties
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                            <span className="font-medium text-green-600">
                              {formatCurrency(landlord.totalRevenue)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">This year</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          {getStatusBadge(landlord.status)}
                          {getVerificationBadge(landlord.verificationStatus)}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">
                            {landlord.bankDetails.bankName}
                          </p>
                          <p className="text-gray-600">
                            {landlord.bankDetails.accountNumber}
                          </p>
                          <div className="flex items-center">
                            {landlord.bankDetails.verified ? (
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span
                              className={`text-xs ${
                                landlord.bankDetails.verified
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {landlord.bankDetails.verified
                                ? "Verified"
                                : "Unverified"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600">
                            Joined {landlord.joined}
                          </p>
                          <p className="text-green-600 text-xs">
                            Active {landlord.lastActive}
                          </p>
                          <div className="flex items-center text-xs">
                            <TrendingUp className="h-3 w-3 text-blue-500 mr-1" />
                            <span>Growing</span>
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
                          {landlord.verificationStatus === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-green-50 hover:border-green-300"
                              onClick={() =>
                                handleVerifyLandlord(landlord.id, "verified")
                              }
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <ConfirmationComponent />
      </div>
    </AdminLayout>
  );
}

export default function LandlordsPage() {
  return (
    <LandlordsProvider>
      <LandlordsPageContent />
    </LandlordsProvider>
  );
}
