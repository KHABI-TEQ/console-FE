"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { AddUserTypeModal } from "@/components/modals/AddUserTypeModal";
import { EditAgentModal } from "@/components/modals/EditAgentModal";
import { AgentOnboardingModal } from "@/components/modals/AgentOnboardingModal";
import { UpgradeRequestModal } from "@/components/modals/UpgradeRequestModal";
import { useAgents } from "@/contexts/AgentsContext";
import { useLandlords } from "@/contexts/LandlordsContext";
import { useRequestLoader } from "@/components/ui/request-loader";
import { useConfirmation } from "@/contexts/ConfirmationContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  UserMinus,
  Flag,
  MoreHorizontal,
  Trash2,
  UserX,
} from "lucide-react";
import { LoadingPlaceholder } from "@/components/shared/LoadingPlaceholder";
import { EmptyState, AgentsEmptyState } from "@/components/shared/EmptyState";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { LandlordActions } from "@/components/shared/LandlordActions";
import { Pagination } from "@/components/shared/Pagination";
import { apiService } from "@/lib/services/apiService";
import { formatCurrency } from "@/lib/utils";

interface AgentManagementProps {
  defaultTab?:
    | "pending-agents"
    | "approved-agents"
    | "upgrade-requests"
    | "landlords";
}

export function AgentManagement({
  defaultTab = "pending-agents",
}: AgentManagementProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as
    | "pending-agents"
    | "approved-agents"
    | "upgrade-requests"
    | "landlords"
    | null;
  const [activeTab, setActiveTab] = useState(tabFromUrl || defaultTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [approvedAgentType, setApprovedAgentType] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isUpgradeRequestModalOpen, setIsUpgradeRequestModalOpen] =
    useState(false);
  const [selectedUpgradeRequest, setSelectedUpgradeRequest] =
    useState<any>(null);

  // Pagination for different sections
  const [pendingAgentsPage, setPendingAgentsPage] = useState(1);
  const [approvedAgentsPage, setApprovedAgentsPage] = useState(1);
  const [upgradeRequestsPage, setUpgradeRequestsPage] = useState(1);
  const [landlordsPage, setLandlordsPage] = useState(1);
  const limit = 10;

  const [landlordsData, setLandlordsData] = useState<any>(null);
  const [landlordsLoading, setLandlordsLoading] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Global loading and confirmation hooks
  const { showLoader, hideLoader } = useRequestLoader();
  const { confirmAction } = useConfirmation();

  // Use context methods
  const {
    pendingAgents,
    approvedAgents,
    upgradeRequests,
    pendingLoading,
    approvedLoading,
    upgradeLoading,
    pendingPagination,
    approvedPagination,
    upgradePagination,
    fetchPendingAgents,
    fetchApprovedAgents,
    fetchUpgradeRequests,
    approveAgent,
    flagAgent,
    approveUpgradeRequest,
    rejectUpgradeRequest,
  } = useAgents();

  // Computed filtered arrays
  const filteredPendingAgents = pendingAgents.filter((agent: any) => {
    if (verificationFilter === "all") return true;
    if (verificationFilter === "verified") return agent.isVerified;
    if (verificationFilter === "unverified") return !agent.isVerified;
    return true;
  });

  const filteredApprovedAgents = approvedAgents.filter((agent: any) => {
    if (approvedAgentType === "all") return true;
    if (approvedAgentType === "active") return agent.status === "active";
    if (approvedAgentType === "inactive") return agent.status === "inactive";
    if (approvedAgentType === "flagged") return agent.isFlagged;
    return true;
  });

  // Data fetching with request tracking to prevent duplicate calls
  const [requestTracker, setRequestTracker] = useState<Set<string>>(new Set());

  const trackRequest = (key: string) => {
    if (requestTracker.has(key)) return false;
    setRequestTracker((prev) => new Set(prev).add(key));
    return true;
  };

  const untrackRequest = (key: string) => {
    setRequestTracker((prev) => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  };

  useEffect(() => {
    if (activeTab === "pending-agents" || activeTab === "approved-agents") {
      const key = `agents-${searchQuery}-${approvedAgentType}`;
      if (trackRequest(key)) {
        fetchAgentData().finally(() => untrackRequest(key));
      }
    } else if (activeTab === "upgrade-requests") {
      const key = `upgrade-requests-${upgradeRequestsPage}`;
      if (trackRequest(key)) {
        fetchUpgradeRequests(upgradeRequestsPage).finally(() =>
          untrackRequest(key),
        );
      }
    } else if (activeTab === "landlords") {
      const key = `landlords-${searchQuery}-${statusFilter}-${landlordsPage}`;
      if (trackRequest(key)) {
        fetchLandlordsData().finally(() => untrackRequest(key));
      }
    }
  }, [
    activeTab,
    statusFilter,
    searchQuery,
    pendingAgentsPage,
    approvedAgentsPage,
    upgradeRequestsPage,
    landlordsPage,
    approvedAgentType,
  ]);

  const fetchAgentData = async () => {
    try {
      const promises = [];

      if (activeTab === "pending-agents") {
        promises.push(
          fetchPendingAgents(
            pendingAgentsPage,
            searchQuery,
            verificationFilter,
          ),
        );
      } else if (activeTab === "approved-agents") {
        promises.push(fetchApprovedAgents(approvedAgentsPage, searchQuery));
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching agent data:", error);
    }
  };

  const fetchLandlordsData = async () => {
    setLandlordsLoading(true);
    try {
      const params = {
        page: landlordsPage.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      };

      const data = await apiService.getLandowners(params);
      setLandlordsData(data);
    } catch (error) {
      console.error("Error fetching landlords:", error);
    } finally {
      setLandlordsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "pending-agents" || activeTab === "approved-agents") {
      setPendingAgentsPage(1);
      setApprovedAgentsPage(1);
      fetchAgentData();
    } else if (activeTab === "upgrade-requests") {
      setUpgradeRequestsPage(1);
      fetchUpgradeRequests(1);
    } else {
      setLandlordsPage(1);
      fetchLandlordsData();
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (activeTab === "pending-agents") {
      setPendingAgentsPage(1);
      fetchPendingAgents(1, value, verificationFilter);
    } else if (activeTab === "approved-agents") {
      setApprovedAgentsPage(1);
      fetchApprovedAgents(1, value);
    } else {
      setLandlordsPage(1);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    if (activeTab === "pending-agents" || activeTab === "approved-agents") {
      setPendingAgentsPage(1);
      setApprovedAgentsPage(1);
    } else {
      setLandlordsPage(1);
    }
  };

  const handleOpenEdit = (agentId: string) => {
    setEditingAgentId(agentId);
    setIsEditModalOpen(true);
  };

  const handleViewAgent = (agentId: string) => {
    router.push(`/agents/${agentId}`);
  };

  const handleVerificationFilterChange = (value: string) => {
    setVerificationFilter(value);
    if (activeTab === "pending-agents") {
      setPendingAgentsPage(1);
      fetchPendingAgents(1, searchQuery, value);
    }
  };

  const handleViewPendingAgent = (agent: any) => {
    setSelectedAgent(agent);
    setIsOnboardingModalOpen(true);
  };

  // Confirmation handlers with loading states
  const handleApproveAgent = (agentId: string, agentName: string) => {
    confirmAction({
      title: "Approve Agent",
      description: `Are you sure you want to approve ${agentName}? This will grant them access to the platform.`,
      confirmText: "Approve",
      cancelText: "Cancel",
      variant: "success",
      onConfirm: async () => {
        showLoader();
        try {
          await approveAgent(agentId, 1);
        } finally {
          hideLoader();
        }
      },
    });
  };

  const handleRejectAgent = (agentId: string, agentName: string) => {
    confirmAction({
      title: "Reject Agent",
      description: `Are you sure you want to reject ${agentName}? This action cannot be undone.`,
      confirmText: "Reject",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        showLoader();
        try {
          await approveAgent(agentId, 0);
        } finally {
          hideLoader();
        }
      },
    });
  };

  const handleFlagAgent = (
    agentId: string,
    agentName: string,
    isFlagged: boolean,
  ) => {
    confirmAction({
      title: isFlagged ? "Unflag Agent" : "Flag Agent",
      description: isFlagged
        ? `Are you sure you want to unflag ${agentName}? This will restore their normal account status.`
        : `Are you sure you want to flag ${agentName}? This will mark their account for review.`,
      confirmText: isFlagged ? "Unflag" : "Flag",
      cancelText: "Cancel",
      variant: isFlagged ? "success" : "warning",
      onConfirm: async () => {
        showLoader();
        try {
          await flagAgent(agentId, isFlagged ? "false" : "true");
          await fetchApprovedAgents(approvedAgentsPage, searchQuery);
        } finally {
          hideLoader();
        }
      },
    });
  };

  const handleChangeStatus = (agentId: string, agentName: string) => {
    confirmAction({
      title: "Change Agent Status",
      description: `Are you sure you want to change the status for ${agentName}? This will affect their account access.`,
      confirmText: "Change Status",
      cancelText: "Cancel",
      variant: "warning",
      onConfirm: async () => {
        showLoader();
        try {
          // This would call an API to change status - using deleteAgent for now as placeholder
          await deleteAgent(agentId);
          await fetchApprovedAgents(approvedAgentsPage, searchQuery);
        } finally {
          hideLoader();
        }
      },
    });
  };

  const handleDeleteAgent = (agentId: string, agentName: string) => {
    confirmAction({
      title: "Delete Agent",
      description: `Are you sure you want to delete ${agentName}? This action cannot be undone and will permanently remove their account and all associated data.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        showLoader();
        try {
          await deleteAgent(agentId);
          await fetchApprovedAgents(approvedAgentsPage, searchQuery);
        } finally {
          hideLoader();
        }
      },
    });
  };

  // Filter functions
  const filteredLandlords = landlordsData?.users || [];

  // Handle pagination changes
  const handlePendingPageChange = (page: number) => {
    setPendingAgentsPage(page);
    fetchPendingAgents(page, searchQuery, verificationFilter);
  };

  const handleApprovedPageChange = (page: number) => {
    setApprovedAgentsPage(page);
    fetchApprovedAgents(page, searchQuery);
  };

  const handleUpgradePageChange = (page: number) => {
    setUpgradeRequestsPage(page);
    fetchUpgradeRequests(page);
  };

  // Stats for agents
  const agentStats = [
    {
      title: "Pending Agents",
      value: (pendingPagination.total || 0).toString(),
      icon: Clock,
      color: "orange" as const,
    },
    {
      title: "Approved Agents",
      value: (approvedPagination.total || 0).toString(),
      icon: UserCheck,
      color: "green" as const,
    },
    {
      title: "Upgrade Requests",
      value: (upgradePagination.total || 0).toString(),
      icon: TrendingUp,
      color: "purple" as const,
    },
    {
      title: "Total Agents",
      value: (
        (pendingPagination.total || 0) + (approvedPagination.total || 0)
      ).toString(),
      icon: Users,
      color: "blue" as const,
    },
  ];

  // Stats for landlords
  const landlordStats = [
    {
      title: "Total Landlords",
      value: landlordsData?.total?.toString() || "0",
      icon: Home,
      color: "blue" as const,
    },
    {
      title: "Active Landlords",
      value:
        landlordsData?.users
          ?.filter((l: any) => l.accountStatus === "active" && !l.isInActive)
          .length?.toString() || "0",
      icon: Shield,
      color: "green" as const,
    },
    {
      title: "Verified Landlords",
      value:
        landlordsData?.users
          ?.filter((l: any) => l.isAccountVerified)
          .length?.toString() || "0",
      icon: Building,
      color: "purple" as const,
    },
    {
      title: "Flagged Landlords",
      value:
        landlordsData?.users
          ?.filter((l: any) => l.isFlagged)
          .length?.toString() || "0",
      icon: AlertTriangle,
      color: "orange" as const,
    },
  ];

  const currentStats = activeTab === "landlords" ? landlordStats : agentStats;
  const isLoading = activeTab === "landlords" ? landlordsLoading : false;

  // Utility functions

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

  const renderPendingAgentsTable = () => {
    if (pendingLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading pending agents...</p>
          <p className="text-gray-500 text-sm">
            Please wait while we fetch the latest information
          </p>
        </div>
      );
    }

    if (pendingAgents.length === 0) {
      return (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No pending agents
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? "No pending agents match your search criteria."
              : "There are no pending agent requests at the moment."}
          </p>
        </div>
      );
    }

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">
                Agent
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Contact Info
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Submitted
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingAgents.map((agent: any, index: number) => {
              const agentName =
                agent.fullName ||
                (
                  (agent.firstName || "") +
                  " " +
                  (agent.lastName || "")
                ).trim() ||
                "Unknown User";

              return (
                <TableRow
                  key={agent.id || agent._id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <TableCell className="py-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-medium">
                          {agentName
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{agentName}</p>
                        <Badge className="bg-orange-100 text-orange-800 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending Approval
                        </Badge>
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
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="text-sm">
                      <Calendar className="h-4 w-4 text-gray-400 inline mr-2" />
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="space-y-1">
                      {agent.isVerified ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Unverified
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleApproveAgent(agent.id || agent._id, agentName)
                        }
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleRejectAgent(agent.id || agent._id, agentName)
                        }
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewPendingAgent(agent)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination for Pending Agents */}
        {pendingPagination.totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-3">
            <Pagination
              currentPage={pendingPagination.page}
              totalItems={pendingPagination.total}
              itemsPerPage={pendingPagination.limit}
              onPageChange={handlePendingPageChange}
            />
          </div>
        )}
      </>
    );
  };

  const renderApprovedAgentsTable = () => {
    if (approvedLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">
            Loading approved agents...
          </p>
          <p className="text-gray-500 text-sm">
            Please wait while we fetch the latest information
          </p>
        </div>
      );
    }

    if (approvedAgents.length === 0) {
      return (
        <div className="text-center py-8">
          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No approved agents
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? "No approved agents match your search criteria."
              : "There are no approved agents matching your filters."}
          </p>
        </div>
      );
    }

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">
                Agent
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Contact Info
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Performance
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvedAgents.map((agent: any, index: number) => {
              const agentName =
                agent.fullName ||
                (
                  (agent.firstName || "") +
                  " " +
                  (agent.lastName || "")
                ).trim() ||
                "Unknown User";

              return (
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
                          {agentName
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{agentName}</p>
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
                          Joined{" "}
                          {new Date(agent.createdAt).toLocaleDateString()}
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
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                      {agent.isFlagged && (
                        <Badge className="bg-red-100 text-red-800">
                          <Flag className="h-3 w-3 mr-1" />
                          Flagged
                        </Badge>
                      )}
                      {agent.agentData?.tier && (
                        <Badge className="bg-purple-100 text-purple-800">
                          {agent.agentData.tier}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleFlagAgent(
                              agent.id || agent._id,
                              agentName,
                              agent.isFlagged,
                            )
                          }
                          className={
                            agent.isFlagged ? "text-green-600" : "text-red-600"
                          }
                        >
                          <Flag className="mr-2 h-4 w-4" />
                          {agent.isFlagged ? "Unflag" : "Flag"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleViewAgent(agent.id || agent._id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleChangeStatus(agent.id || agent._id, agentName)
                          }
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Change Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteAgent(agent.id || agent._id, agentName)
                          }
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination for Approved Agents */}
        {approvedPagination.totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-3">
            <Pagination
              currentPage={approvedPagination.page}
              totalItems={approvedPagination.total}
              itemsPerPage={approvedPagination.limit}
              onPageChange={handleApprovedPageChange}
            />
          </div>
        )}
      </>
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
          {filteredLandlords.map((landlord: any, index: number) => (
            <TableRow
              key={landlord.id || landlord._id}
              className={`hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
            >
              <TableCell className="py-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white font-medium">
                      {(
                        (landlord.firstName || "") +
                        " " +
                        (landlord.lastName || "")
                      )
                        .trim()
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("") || "L"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {(
                        (landlord.firstName || "") +
                        " " +
                        (landlord.lastName || "")
                      ).trim() || "Unknown Landlord"}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {landlord.userType || "Landowner"}
                      </Badge>
                      {landlord.accountId && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700"
                        >
                          ID: {landlord.accountId}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium truncate">
                      {landlord.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {landlord.phoneNumber || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      Joined {new Date(landlord.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Home className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="font-medium">Properties: N/A</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-medium text-green-600">
                      Revenue: N/A
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Data not available</p>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="space-y-2">
                  {landlord.accountStatus === "active" &&
                  !landlord.isInActive ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                  {landlord.isFlagged && (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Flagged
                    </Badge>
                  )}
                  {landlord.isAccountVerified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="space-y-1 text-sm">
                  <p className="font-medium">Bank Details</p>
                  <p className="text-gray-600">Not Available</p>
                  <div className="flex items-center">
                    <XCircle className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-xs text-red-600">Unverified</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <LandlordActions
                  landlord={landlord}
                  onRefresh={handleRefresh}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === "landlords"
              ? "Landlord Management"
              : "Agent Management"}
          </h1>
          <p className="text-gray-600">
            {activeTab === "landlords"
              ? "Manage property landlords, verification status, and revenue tracking"
              : "Manage real estate agents, track performance, and oversee operations"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
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
            Add New User Type
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(
            value as
              | "pending-agents"
              | "approved-agents"
              | "upgrade-requests"
              | "landlords",
          )
        }
      >
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="pending-agents" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Pending ({pendingPagination.total || 0})
          </TabsTrigger>
          <TabsTrigger value="approved-agents" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approved ({approvedPagination.total || 0})
          </TabsTrigger>
          <TabsTrigger value="upgrade-requests" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrades ({upgradePagination.total || 0})
          </TabsTrigger>
          <TabsTrigger value="landlords" className="flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Landlords ({landlordsData?.total || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending-agents" className="space-y-6">
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
                Filter Pending Agents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search pending agents by name, email..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
                <Select
                  value={verificationFilter}
                  onValueChange={handleVerificationFilterChange}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Verification Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Verification</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pending Agents Section */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  <div>
                    <span className="text-lg font-medium">
                      Pending Agent Requests
                    </span>
                    <p className="text-sm text-gray-600 font-normal">
                      Agents awaiting approval
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="text-sm px-3 py-1 bg-orange-100 text-orange-800"
                >
                  {filteredPendingAgents.length} pending
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {renderPendingAgentsTable()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved-agents" className="space-y-6">
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
                Filter Approved Agents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search approved agents by name, email..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
                <Select
                  value={approvedAgentType}
                  onValueChange={(value) => {
                    setApprovedAgentType(value);
                    setApprovedAgentsPage(1);
                  }}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Agent Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    <SelectItem value="active">Active Agents</SelectItem>
                    <SelectItem value="inactive">Inactive Agents</SelectItem>
                    <SelectItem value="flagged">Flagged Agents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Approved Agents Section */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-green-600" />
                  <div>
                    <span className="text-lg font-medium">Approved Agents</span>
                    <p className="text-sm text-gray-600 font-normal">
                      {approvedAgentType === "all"
                        ? "All approved agents"
                        : approvedAgentType === "active"
                          ? "Active agents"
                          : approvedAgentType === "inactive"
                            ? "Inactive agents"
                            : "Flagged agents"}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="text-sm px-3 py-1 bg-green-100 text-green-800"
                >
                  {filteredApprovedAgents.length} agents
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {renderApprovedAgentsTable()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upgrade-requests" className="space-y-6">
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
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Upgrade Requests Table */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                  <div>
                    <span className="text-lg font-medium">
                      Agent Upgrade Requests
                    </span>
                    <p className="text-sm text-gray-600 font-normal">
                      Manage agent tier upgrade requests
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {upgradeRequests.length} showing
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {upgradeLoading ? (
                  <LoadingPlaceholder type="table" count={5} />
                ) : upgradeRequests.length === 0 ? (
                  <EmptyState
                    icon={TrendingUp}
                    title="No upgrade requests found"
                    description="No agent upgrade requests are currently pending review."
                  />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Current Type</TableHead>
                        <TableHead>Requested Type</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upgradeRequests.map((request: any) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="" alt={request.fullName} />
                                <AvatarFallback>
                                  {request.fullName
                                    ?.split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {request.fullName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {request.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {request.currentAgentType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">
                              {request.requestedUpgradeAgentType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              {request.upgradeRequestDate}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  request.accountStatus === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {request.accountStatus}
                              </Badge>
                              {request.isVerified && (
                                <Badge
                                  variant="outline"
                                  className="text-green-600"
                                >
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                              {request.isFlagged && (
                                <Badge variant="destructive">Flagged</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUpgradeRequest(request);
                                setIsUpgradeRequestModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              <Pagination
                currentPage={upgradeRequestsPage}
                totalItems={upgradePagination.total || 0}
                itemsPerPage={10}
                onPageChange={handleUpgradePageChange}
              />
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
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
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
              <Pagination
                currentPage={landlordsPage}
                totalItems={landlordsData?.total || 0}
                itemsPerPage={limit}
                onPageChange={setLandlordsPage}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddUserTypeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          // Refresh both agents and landlords data
          handleRefresh();
        }}
      />

      <EditAgentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAgentId(null);
        }}
        agentId={editingAgentId}
      />

      <AgentOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => {
          setIsOnboardingModalOpen(false);
          setSelectedAgent(null);
        }}
        agent={selectedAgent}
      />

      <UpgradeRequestModal
        isOpen={isUpgradeRequestModalOpen}
        onClose={() => {
          setIsUpgradeRequestModalOpen(false);
          setSelectedUpgradeRequest(null);
        }}
        request={selectedUpgradeRequest}
      />
    </div>
  );
}
