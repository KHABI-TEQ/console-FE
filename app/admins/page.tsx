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
  Users,
  UserPlus,
  Shield,
  Crown,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { AddAdminModal } from "@/components/modals/AddAdminModal";
import { ListPageSkeleton } from "@/components/skeletons/PageSkeletons";
import { EditAdminModal } from "@/components/modals/EditAdminModal";

function AdminPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);

  const { admins, isLoading, fetchAdmins, deleteAdmin, changeAdminStatus } =
    useAdmin();

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (isLoading) {
    return <ListPageSkeleton title="Admin Management" />;
  }

  const handleOpenEdit = (adminId: string) => {
    setEditingAdminId(adminId);
    setIsEditModalOpen(true);
  };

  const handleStatusChange = async (adminId: string, status: string) => {
    await changeAdminStatus(adminId, status);
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      await deleteAdmin(adminId);
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || admin.status.toLowerCase() === statusFilter;
    const matchesRole =
      roleFilter === "all" || admin.role.toLowerCase() === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const stats = [
    {
      title: "Total Admins",
      value: admins.length.toString(),
      change: "+8.2%",
      trend: "up" as const,
      icon: Users,
      color: "blue" as const,
    },
    {
      title: "Active Admins",
      value: admins.filter((a) => a.status === "active").length.toString(),
      change: "+5.1%",
      trend: "up" as const,
      icon: Shield,
      color: "green" as const,
    },
    {
      title: "Super Admins",
      value: admins.filter((a) => a.role === "super_admin").length.toString(),
      change: "0%",
      trend: "up" as const,
      icon: Crown,
      color: "purple" as const,
    },
    {
      title: "Recently Added",
      value: "3",
      change: "+12.5%",
      trend: "up" as const,
      icon: UserPlus,
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
      case "moderator":
        return (
          <Badge className="bg-orange-100 text-orange-800">Moderator</Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Admin Management"
          description="Manage system administrators, roles, and permissions"
        >
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
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
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Admins Table */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-600" />
                <div>
                  <span className="text-lg font-medium">System Admins</span>
                  <p className="text-sm text-gray-600 font-normal">
                    {filteredAdmins.length} admins found
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {filteredAdmins.length} showing
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="ml-4">Loading admins...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">
                        Admin
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Role & Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Permissions
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Last Login
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
                    {filteredAdmins.map((admin, index) => (
                      <TableRow
                        key={admin.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src="/placeholder.svg"
                                alt={admin.name}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                                {admin.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {admin.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {admin.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            {getRoleBadge(admin.role)}
                            {getStatusBadge(admin.status)}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-wrap gap-1">
                            {admin.permissions
                              ?.slice(0, 2)
                              .map((permission, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {permission}
                                </Badge>
                              ))}
                            {admin.permissions?.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{admin.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <p className="text-sm">
                            {admin.lastLogin || "Never"}
                          </p>
                        </TableCell>
                        <TableCell className="py-4">
                          <p className="text-sm">{admin.createdAt}</p>
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
                                onClick={() => handleOpenEdit(admin.id)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(
                                    admin.id,
                                    admin.status === "active"
                                      ? "inactive"
                                      : "active",
                                  )
                                }
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                {admin.status === "active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteAdmin(admin.id)}
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
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <AddAdminModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        <EditAdminModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingAdminId(null);
          }}
          adminId={editingAdminId}
        />
      </div>
    </AdminLayout>
  );
}

export default function AdminsPage() {
  return (
    <AdminProvider>
      <AdminPageContent />
    </AdminProvider>
  );
}
