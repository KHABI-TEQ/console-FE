"use client";

import { useState, useEffect } from "react";
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
  Mail,
  Phone,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Calendar,
  Clock,
  Star,
} from "lucide-react";
import { ListPageSkeleton } from "@/components/skeletons/PageSkeletons";
import { LoadingPlaceholder } from "@/components/shared/LoadingPlaceholder";
import { EmptyState } from "@/components/shared/EmptyState";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { Pagination } from "@/components/shared/Pagination";
import { AddBuyerModal } from "@/components/modals/AddBuyerModal";
import { EditBuyerModal } from "@/components/modals/EditBuyerModal";
import { useBuyers, BuyersProvider } from "@/contexts/BuyersContext";

function BuyersContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    buyers,
    isLoading,
    filters,
    pagination,
    fetchBuyers,
    refreshBuyers,
    setFilters,
    setPage,
  } = useBuyers();

  useEffect(() => {
    fetchBuyers();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newFilters = {
        ...(searchQuery.trim() && { search: searchQuery.trim() }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      };
      setFilters(newFilters);
      fetchBuyers({ ...newFilters, page: 1 });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshBuyers();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEditBuyer = (buyer: any) => {
    setSelectedBuyer(buyer);
    setIsEditModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  if (isLoading && buyers.length === 0) {
    return (
      <AdminLayout>
        <ListPageSkeleton title="Buyer Management" />
      </AdminLayout>
    );
  }

  const stats = [
    {
      title: "Total Buyers",
      value: pagination.total.toString(),
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
            disabled={isRefreshing}
            className="w-full sm:w-auto"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => setIsAddModalOpen(true)}
          >
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
                    {pagination.total} buyers found
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {buyers.length} showing
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading || isRefreshing ? (
              <div className="relative">
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <div className="opacity-50">
                  <LoadingPlaceholder type="table" count={10} />
                </div>
              </div>
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
                                  buyer.fullName ||
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
                                {buyer.fullName ||
                                  (
                                    (buyer.firstName || "") +
                                    " " +
                                    (buyer.lastName || "")
                                  ).trim() ||
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
                          <ActionButtons
                            entityType="buyer"
                            entityId={buyer._id || buyer.id}
                            entityName={
                              buyer.fullName ||
                              (
                                (buyer.firstName || "") +
                                " " +
                                (buyer.lastName || "")
                              ).trim() ||
                              "Buyer"
                            }
                            email={buyer.email}
                            phone={buyer.phoneNumber}
                            showContact={false}
                            showEdit={true}
                            showDelete={true}
                            showVerification={!buyer.isAccountVerified}
                            showMore={true}
                            variant="dropdown"
                            onRefresh={handleRefresh}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {buyers.length > 0 && pagination.totalPages > 1 && (
              <div
                className={`px-6 pb-6 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <Pagination
                  currentPage={pagination.currentPage}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.perPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddBuyerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          refreshBuyers();
          setIsAddModalOpen(false);
        }}
      />

      <EditBuyerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBuyer(null);
        }}
        onSuccess={() => {
          refreshBuyers();
          setIsEditModalOpen(false);
          setSelectedBuyer(null);
        }}
        buyerData={selectedBuyer}
      />
    </AdminLayout>
  );
}

export default function BuyersPage() {
  return (
    <BuyersProvider>
      <BuyersContent />
    </BuyersProvider>
  );
}
