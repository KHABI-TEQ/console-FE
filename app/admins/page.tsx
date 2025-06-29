"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  UserPlus,
  Shield,
  Crown,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddAdminModal } from "@/components/modals/AddAdminModal";
import { ListPageSkeleton } from "@/components/skeletons/PageSkeletons";
import { EditAdminModal } from "@/components/modals/EditAdminModal";
import { ChangePasswordModal } from "@/components/modals/ChangePasswordModal";
import { DisableAdminModal } from "@/components/modals/DisableAdminModal";
import { apiService } from "@/lib/services/apiService";
import { useApp } from "@/contexts/AppContext";
import { AdminProvider } from "@/contexts/AdminContext";

interface Admin {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  isAccountVerified: boolean;
  isAccountInRecovery: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminsResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  admins: Admin[];
}

export default function AdminsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const { addNotification } = useApp();

  const {
    data: adminsData,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["admins", currentPage, pageLimit],
    queryFn: async () => {
      const response = await apiService.get("/admins", {
        page: currentPage,
        limit: pageLimit,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch admins");
      }

      // Return the structure expected by the component
      return {
        admins: response.data || response.admins || [],
        total: response.total || 0,
        page: response.page || currentPage,
        limit: response.limit || pageLimit,
        success: response.success,
      };
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <ListPageSkeleton title="Admin Management" />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <p className="text-red-600">
              Error loading admins: {error.message}
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const admins = adminsData?.admins || [];
  const totalAdmins = adminsData?.total || 0;
  const totalPages = Math.ceil(totalAdmins / pageLimit);

  const handleOpenEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsEditModalOpen(true);
  };

  const handleOpenChangePassword = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsChangePasswordModalOpen(true);
  };

  const handleOpenDisableModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsDisableModalOpen(true);
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const response = await apiService.deleteAdmin(adminId);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: "Admin deleted successfully",
          });
          refetch();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to delete admin",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to delete admin",
        });
      }
    }
  };

  const filteredAdmins = admins.filter((admin: Admin) => {
    const fullName = `${admin.firstName} ${admin.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase());

    const adminStatus = admin.isAccountVerified ? "active" : "inactive";
    const matchesStatus =
      statusFilter === "all" || adminStatus === statusFilter;

    const matchesRole =
      roleFilter === "all" ||
      admin.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesRole;
  });

  const stats = [
    {
      title: "Total Admins",
      value: totalAdmins.toString(),
      change: "+8.2%",
      trend: "up" as const,
      icon: Users,
      color: "blue" as const,
    },
    {
      title: "Active Admins",
      value: admins.filter((a: Admin) => a.isAccountVerified).length.toString(),
      change: "+5.1%",
      trend: "up" as const,
      icon: Shield,
      color: "green" as const,
    },
    {
      title: "Super Admins",
      value: admins
        .filter((a: Admin) => a.role === "super_admin")
        .length.toString(),
      change: "0%",
      trend: "up" as const,
      icon: Crown,
      color: "purple" as const,
    },
    {
      title: "This Month",
      value: "3",
      change: "+12.5%",
      trend: "up" as const,
      icon: UserPlus,
      color: "orange" as const,
    },
  ];

  const getStatusBadge = (admin: Admin) => {
    if (admin.isAccountVerified) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (admin.isAccountInRecovery) {
      return <Badge className="bg-yellow-100 text-yellow-800">Recovery</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "super_admin":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <Crown className="h-3 w-3 mr-1" />
            Super Admin
          </Badge>
        );
      case "admin":
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminProvider>
      <AdminLayout>
        <div className="p-6 space-y-6">
          <PageHeader
            title="Admin Management"
            description="Manage system administrators, roles, and permissions"
          >
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </PageHeader>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Filters */}
          <Card className="border shadow-sm">
            <CardHeader className="bg-gray-50/50 border-b">
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-gray-600" />
                Filter Admins
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search admins by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Admins Table */}
          <Card className="border shadow-sm">
            <CardHeader className="bg-gray-50/50 border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-600" />
                  <div>
                    <span className="text-lg font-medium">System Admins</span>
                    <p className="text-sm text-gray-600 font-normal">
                      {filteredAdmins.length} of {totalAdmins} admins
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Page {currentPage} of {totalPages}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">
                        Admin
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Contact
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Role & Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Created
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdmins.map((admin: Admin) => (
                      <TableRow
                        key={admin._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                                {admin.firstName[0]}
                                {admin.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {admin.firstName} {admin.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {admin.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-900">
                              {admin.email}
                            </p>
                            {admin.phoneNumber && (
                              <p className="text-sm text-gray-500">
                                {admin.phoneNumber}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            {getRoleBadge(admin.role)}
                            {getStatusBadge(admin)}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <p className="text-sm">
                            {formatDate(admin.createdAt)}
                          </p>
                        </TableCell>
                        <TableCell className="py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleOpenEdit(admin)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleOpenChangePassword(admin)}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Change Password
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleOpenDisableModal(admin)}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                {admin.isAccountVerified
                                  ? "Disable"
                                  : "Enable"}{" "}
                                Account
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteAdmin(admin._id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * pageLimit + 1} to{" "}
                    {Math.min(currentPage * pageLimit, totalAdmins)} of{" "}
                    {totalAdmins} admins
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(
                          Math.max(0, currentPage - 3),
                          Math.min(totalPages, currentPage + 2),
                        )
                        .map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modals */}
          <AddAdminModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={() => refetch()}
          />

          <EditAdminModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedAdmin(null);
            }}
            adminData={
              selectedAdmin
                ? {
                    id: selectedAdmin._id || selectedAdmin.id || "",
                    email: selectedAdmin.email,
                    firstName: selectedAdmin.firstName,
                    lastName: selectedAdmin.lastName,
                    phoneNumber: selectedAdmin.phoneNumber || "",
                    address: "",
                    role: selectedAdmin.role,
                  }
                : undefined
            }
            onSuccess={() => refetch()}
          />

          <ChangePasswordModal
            isOpen={isChangePasswordModalOpen}
            onClose={() => {
              setIsChangePasswordModalOpen(false);
              setSelectedAdmin(null);
            }}
            adminId={selectedAdmin?._id || null}
            adminName={`${selectedAdmin?.firstName} ${selectedAdmin?.lastName}`}
          />

          <DisableAdminModal
            isOpen={isDisableModalOpen}
            onClose={() => {
              setIsDisableModalOpen(false);
              setSelectedAdmin(null);
            }}
            adminId={selectedAdmin?._id || null}
            adminName={`${selectedAdmin?.firstName} ${selectedAdmin?.lastName}`}
            currentStatus={
              selectedAdmin?.isAccountVerified ? "active" : "inactive"
            }
          />
        </div>
      </AdminLayout>
    </AdminProvider>
  );
}
