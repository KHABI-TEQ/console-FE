"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
  AlertTriangle,
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
import { ListPageSkeleton } from "@/components/skeletons/PageSkeletons";
import { LoadingPlaceholder } from "@/components/shared/LoadingPlaceholder";
import { EmptyState } from "@/components/shared/EmptyState";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { apiService } from "@/lib/services/apiService";

interface BuyerFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export default function BuyersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const filters: BuyerFilters = {
    ...(searchQuery && { search: searchQuery }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    page,
    limit,
  };

  const {
    data: buyersResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["buyers", filters],
    queryFn: () => apiService.getBuyers(filters),
  });

  const buyers = buyersResponse?.data || [];
  const totalCount = buyersResponse?.total || 0;

  if (isLoading) {
    return (
      <AdminLayout>
        <ListPageSkeleton title="Buyer Management" />
      </AdminLayout>
    );
  }

  const stats = [
    {
      title: "Total Buyers",
      value: totalCount.toString(),
      change: "+15.2%",
      trend: "up" as const,
      icon: Users,
      color: "blue" as const,
    },
    {
      title: "Active Buyers",
      value: buyers
        .filter((b: any) => b.isAccountVerified && !b.isInActive)
        .length.toString(),
      change: "+8.1%",
      trend: "up" as const,
      icon: UserCheck,
      color: "green" as const,
    },
    {
      title: "Pending Verification",
      value: buyers.filter((b: any) => !b.isAccountVerified).length.toString(),
      change: "+22.3%",
      trend: "up" as const,
      icon: Clock,
      color: "orange" as const,
    },
    {
      title: "Premium Buyers",
      value: buyers.filter((b: any) => b.isPremium).length.toString(),
      change: "+18.7%",
      trend: "up" as const,
      icon: Star,
      color: "purple" as const,
    },
  ];

  const getStatusBadge = (buyer: any) => {
    if (buyer.isAccountVerified && !buyer.isInActive) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (!buyer.isAccountVerified) {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    } else if (buyer.isInActive) {
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
    }
  };

  const handleRefresh = () => {
    refetch();
  };

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
                    Error Loading Data
                  </h3>
                  <p className="text-red-700 text-sm">
                    Failed to load buyers. Please try again.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleRefresh}
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
        <PageHeader
          title="Buyer Management"
          description="Manage registered buyers, preferences, and activity"
        >
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="w-full sm:w-auto"
          >
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search buyers by name, email, or phone..."
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
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
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
                  <span className="text-lg font-medium">Registered Buyers</span>
                  <p className="text-sm text-gray-600 font-normal">
                    {totalCount} buyers found
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {buyers.length} showing
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <LoadingPlaceholder type="table" count={10} />
            ) : buyers.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No buyers found"
                description="No buyers match your current filters. Try adjusting your search criteria."
                secondaryActionLabel="Clear Filters"
                onSecondaryAction={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              />
            ) : (
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
                        Status & Activity
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Preferences
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Registration
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyers.map((buyer: any, index: number) => (
                      <TableRow
                        key={buyer._id || buyer.id}
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                        onClick={() =>
                          router.push(`/buyers/${buyer._id || buyer.id}`)
                        }
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                                {(
                                  (buyer.firstName || "") +
                                  " " +
                                  (buyer.lastName || "")
                                )
                                  .trim()
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("") || "B"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {(
                                  (buyer.firstName || "") +
                                  " " +
                                  (buyer.lastName || "")
                                ).trim() ||
                                  buyer.fullName ||
                                  "Unknown Buyer"}
                              </p>
                              <p className="text-sm text-gray-500">
                                ID: {buyer.accountId || buyer._id}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="truncate">{buyer.email}</span>
                            </div>
                            {buyer.phoneNumber && (
                              <div className="flex items-center text-sm">
                                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                <span>{buyer.phoneNumber}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="space-y-2">
                            {getStatusBadge(buyer)}
                            {buyer.isPremium && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Star className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                            {buyer.isFlagged && (
                              <Badge className="bg-red-100 text-red-800">
                                Flagged
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="text-sm text-gray-600">
                            <p>Budget: N/A</p>
                            <p>Location: N/A</p>
                            <p>Type: N/A</p>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="text-sm">
                            <p className="font-medium">
                              {new Date(buyer.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500">
                              {buyer.userType || "Buyer"}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell
                          className="py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(`/buyers/${buyer._id || buyer.id}`)
                              }
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <ActionButtons
                              entityType="buyer"
                              entityId={buyer._id || buyer.id}
                              entityName={
                                (
                                  (buyer.firstName || "") +
                                  " " +
                                  (buyer.lastName || "")
                                ).trim() ||
                                buyer.fullName ||
                                "Buyer"
                              }
                              email={buyer.email}
                              phone={buyer.phoneNumber}
                              showContact={true}
                              showEdit={true}
                              showDelete={true}
                              showVerification={!buyer.isAccountVerified}
                              showMore={true}
                              onRefresh={handleRefresh}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
