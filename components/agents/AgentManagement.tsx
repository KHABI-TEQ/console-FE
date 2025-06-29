"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddAgentModal } from "@/components/modals/AddAgentModal";
import { EditAgentModal } from "@/components/modals/EditAgentModal";
import { useAgents } from "@/contexts/AgentsContext";
import { useLandlords } from "@/contexts/LandlordsContext";
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
  Star,
  Trophy,
  Search,
  Filter,
  Plus,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BarChart3,
  Clock,
  Home,
  Shield,
  Building,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { LoadingPlaceholder } from "@/components/shared/LoadingPlaceholder";
import { EmptyState, AgentsEmptyState } from "@/components/shared/EmptyState";
import { ActionButtons } from "@/components/shared/ActionButtons";

interface AgentManagementProps {
  defaultTab?: "agents" | "landlords";
}

export function AgentManagement({
  defaultTab = "agents",
}: AgentManagementProps) {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as "agents" | "landlords" | null;
  const [activeTab, setActiveTab] = useState(tabFromUrl || defaultTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);

  const [agentsData, setAgentsData] = useState<any>(null);
  const [landlordsData, setLandlordsData] = useState<any>(null);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [landlordsLoading, setLandlordsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "agents") {
      fetchAgentsData();
    } else {
      fetchLandlordsData();
    }
  }, [activeTab, statusFilter]);

  const fetchAgentsData = async () => {
    setAgentsLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "50",
        type: statusFilter === "all" ? "all" : statusFilter,
      });

      const response = await fetch(`/api/all-users?${params}&role=agent`);
      const data = await response.json();
      setAgentsData(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setAgentsLoading(false);
    }
  };

  const fetchLandlordsData = async () => {
    setLandlordsLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "50",
        type: statusFilter === "all" ? "all" : statusFilter,
        userType: "Landowners",
      });

      const response = await fetch(`/api/all-agents?${params}`);
      const data = await response.json();
      setLandlordsData(data);
    } catch (error) {
      console.error("Error fetching landlords:", error);
    } finally {
      setLandlordsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "agents") {
      fetchAgentsData();
    } else {
      fetchLandlordsData();
    }
  };

  const handleOpenEdit = (agentId: string) => {
    setEditingAgentId(agentId);
    setIsEditModalOpen(true);
  };

  // Mock landlords data for demonstration
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
      verificationStatus: "pending",
      bankDetails: {
        accountNumber: "****5678",
        bankName: "Bank of America",
        verified: false,
      },
    },
  ];

  // Filter functions
  const filteredAgents =
    agentsData?.users?.filter((agent: any) => {
      const fullName =
        `${agent.firstName || ""} ${agent.lastName || ""}`.trim();
      const matchesSearch =
        fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }) || [];

  const filteredLandlords =
    landlordsData?.agents?.data?.filter((landlord: any) => {
      const fullName =
        `${landlord.firstName || ""} ${landlord.lastName || ""}`.trim();
      const matchesSearch =
        fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        landlord.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }) || [];

  // Stats for agents
  const agentStats = [
    {
      title: "Total Agents",
      value: agentsData?.total?.toString() || "0",
      change: "+8.2%",
      trend: "up" as const,
      icon: Users,
      color: "blue" as const,
    },
    {
      title: "Active Agents",
      value:
        agentsData?.users
          ?.filter((a: any) => a.accountStatus === "active" && !a.isInActive)
          .length?.toString() || "0",
      change: "+5.1%",
      trend: "up" as const,
      icon: UserCheck,
      color: "green" as const,
    },
    {
      title: "Inactive/Flagged",
      value:
        agentsData?.users
          ?.filter((a: any) => a.isInActive || a.isFlagged)
          .length?.toString() || "0",
      change: "-12.5%",
      trend: "down" as const,
      icon: Clock,
      color: "orange" as const,
    },
    {
      title: "Total Commissions",
      value:
        "$" +
        (
          agentsData?.users?.reduce(
            (sum: number, agent: any) =>
              sum + (agent.agentData?.commission || 0),
            0,
          ) / 1000 || 0
        ).toFixed(0) +
        "K",
      change: "+18.7%",
      trend: "up" as const,
      icon: DollarSign,
      color: "purple" as const,
    },
  ];

  // Stats for landlords
  const landlordStats = [
    {
      title: "Total Landlords",
      value: landlordsData?.agents?.totalAgents?.toString() || "0",
      change: "+15.2%",
      trend: "up" as const,
      icon: Home,
      color: "blue" as const,
    },
    {
      title: "Active Landlords",
      value: landlordsData?.agents?.totalActiveAgents?.toString() || "0",
      change: "+8.1%",
      trend: "up" as const,
      icon: Shield,
      color: "green" as const,
    },
    {
      title: "Inactive Landlords",
      value: landlordsData?.agents?.totalInactiveAgents?.toString() || "0",
      change: "+22.3%",
      trend: "up" as const,
      icon: Building,
      color: "purple" as const,
    },
    {
      title: "Flagged Landlords",
      value: landlordsData?.agents?.totalFlaggedAgents?.toString() || "0",
      change: "+18.7%",
      trend: "down" as const,
      icon: DollarSign,
      color: "orange" as const,
    },
  ];

  const currentStats = activeTab === "agents" ? agentStats : landlordStats;
  const isLoading = activeTab === "agents" ? agentsLoading : landlordsLoading;

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case "banned":
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "premium":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <Trophy className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        );
      case "standard":
        return <Badge className="bg-blue-100 text-blue-800">Standard</Badge>;
      case "basic":
        return <Badge variant="outline">Basic</Badge>;
      default:
        return <Badge variant="secondary">{tier}</Badge>;
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

  const renderAgentsTable = () => {
    if (isLoading) return <LoadingPlaceholder type="table" count={5} />;
    if (filteredAgents.length === 0) {
      return (
        <AgentsEmptyState
          onAction={() => setIsAddModalOpen(true)}
          onSecondaryAction={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setTierFilter("all");
          }}
          secondaryActionLabel="Clear Filters"
        />
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-900">Agent</TableHead>
            <TableHead className="font-semibold text-gray-900">
              Contact Info
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Performance
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Status & Tier
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Activity
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAgents.map((agent, index) => (
            <TableRow
              key={agent.id || agent._id}
              className={`hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
            >
              <TableCell className="py-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                      {((agent.firstName || "") + " " + (agent.lastName || ""))
                        .trim()
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {(
                        (agent.firstName || "") +
                        " " +
                        (agent.lastName || "")
                      ).trim() || "Unknown User"}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(agent.agentData?.rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-1">
                        {agent.agentData?.rating || "N/A"}
                      </span>
                    </div>
                    {agent.agentData && (
                      <div className="flex items-center space-x-1 mt-1">
                        {agent.agentData.specialties?.map(
                          (specialty: string, i: number) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {specialty}
                            </Badge>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="truncate">{agent.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{agent.phoneNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>
                      Joined {new Date(agent.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="space-y-1">
                  {agent.agentData ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">
                          {agent.agentData.sales || 0} sales
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium">
                          {formatCurrency(agent.agentData.commission || 0)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">This year</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No agent data</p>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="space-y-2">
                  {agent.accountStatus === "active" && !agent.isInActive ? (
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">
                      Inactive
                    </Badge>
                  )}
                  {agent.isFlagged && (
                    <Badge className="bg-red-100 text-red-800">Flagged</Badge>
                  )}
                  {agent.agentData?.tier && (
                    <Badge className="bg-purple-100 text-purple-800">
                      {agent.agentData.tier}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <CheckCircle
                      className={`h-4 w-4 mr-2 ${agent.isAccountVerified ? "text-green-500" : "text-gray-400"}`}
                    />
                    <span>
                      {agent.isAccountVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield
                      className={`h-4 w-4 mr-2 ${agent.accountApproved ? "text-green-500" : "text-orange-500"}`}
                    />
                    <span>
                      {agent.accountApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <ActionButtons
                  entityType="agent"
                  entityId={agent.id || agent._id}
                  entityName={(
                    (agent.firstName || "") +
                    " " +
                    (agent.lastName || "")
                  ).trim()}
                  email={agent.email}
                  phone={agent.phoneNumber}
                  showContact={true}
                  showMore={true}
                  onRefresh={handleRefresh}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderLandlordsTable = () => {
    if (isLoading) return <LoadingPlaceholder type="table" count={5} />;
    if (filteredLandlords.length === 0) {
      return (
        <EmptyState
          icon={Home}
          title="No landlords found"
          description="No landlords match your current filters. Try adjusting your search criteria."
          secondaryActionLabel="Clear Filters"
          onSecondaryAction={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setVerificationFilter("all");
          }}
        />
      );
    }

    return (
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
                    <AvatarImage src={landlord.avatar} alt={landlord.name} />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white font-medium">
                      {landlord.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{landlord.name}</p>
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
                  <p className="font-medium">{landlord.bankDetails.bankName}</p>
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
                <ActionButtons
                  entityType="landlord"
                  entityId={landlord.id}
                  entityName={landlord.name}
                  email={landlord.email}
                  phone={landlord.phone}
                  showContact={true}
                  showApproval={landlord.verificationStatus === "pending"}
                  showMore={true}
                  onRefresh={handleRefresh}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  if (
    isLoading &&
    (activeTab === "agents" ? agents.length === 0 : mockLandlords.length === 0)
  ) {
    return <LoadingPlaceholder type="page" />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === "agents"
              ? "Agent Management"
              : "Landlord Management"}
          </h1>
          <p className="text-gray-600">
            {activeTab === "agents"
              ? "Manage real estate agents, track performance, and oversee operations"
              : "Manage property landlords, verification status, and revenue tracking"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add {activeTab === "agents" ? "Agent" : "Landlord"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "agents" | "landlords")}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="agents" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Agents ({agentsData?.total || 0})
          </TabsTrigger>
          <TabsTrigger value="landlords" className="flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Landlords ({landlordsData?.agents?.totalAgents || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {agentStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <span
                          className={`ml-2 text-sm ${
                            stat.trend === "up"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-gray-600" />
                Filter Agents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search agents by name, email, location..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Agents Table */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-600" />
                  <div>
                    <span className="text-lg font-medium">Active Agents</span>
                    <p className="text-sm text-gray-600 font-normal">
                      {filteredAgents.length} agents found
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {filteredAgents.length} showing
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">{renderAgentsTable()}</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="landlords" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {landlordStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <span
                          className={`ml-2 text-sm ${
                            stat.trend === "up"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              <div className="overflow-x-auto">{renderLandlordsTable()}</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddAgentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditAgentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAgentId(null);
        }}
        agentId={editingAgentId}
      />
    </div>
  );
}
