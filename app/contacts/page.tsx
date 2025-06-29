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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Mail,
  Phone,
  MapPin,
  Calendar,
  Search,
  Filter,
  Plus,
  Download,
  RefreshCw,
  Eye,
  Edit,
  MessageSquare,
  Star,
  Clock,
  TrendingUp,
  Building,
  Activity,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Grid3X3,
  List,
  ChevronRight,
  Globe,
  Linkedin,
  Twitter,
} from "lucide-react";
import { LoadingPlaceholder } from "@/components/shared/LoadingPlaceholder";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { useQuery } from "@tanstack/react-query";
import { ListPageSkeleton } from "@/components/skeletons/PageSkeletons";
import { apiService } from "@/lib/services/apiService";

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: contactsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["contacts", { searchQuery, typeFilter, statusFilter, page }],
    queryFn: () =>
      apiService.getContacts({
        search: searchQuery,
        type: typeFilter,
        status: statusFilter,
        page,
        limit,
      }),
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <ListPageSkeleton title="Contact Management" />
      </AdminLayout>
    );
  }

  const stats = [
    {
      title: "Total Contacts",
      value: "1,247",
      change: "+18.2%",
      trend: "up" as const,
      icon: Users,
      color: "blue" as const,
    },
    {
      title: "Active Leads",
      value: "342",
      change: "+25.1%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "green" as const,
    },
    {
      title: "New This Month",
      value: "89",
      change: "+12.5%",
      trend: "up" as const,
      icon: Calendar,
      color: "orange" as const,
    },
    {
      title: "Conversion Rate",
      value: "87%",
      change: "+5.3%",
      trend: "up" as const,
      icon: Target,
      color: "purple" as const,
    },
  ];

  const contacts = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      avatar: "/placeholder.svg",
      type: "Buyer",
      status: "Active",
      source: "Website",
      lastContact: "2 hours ago",
      rating: 4.8,
      notes: "Interested in downtown properties. Budget: $800K-1M",
      assignedAgent: "Sarah Johnson",
      properties: 3,
      interactions: 12,
      tags: ["High Priority", "Cash Buyer", "Investment"],
      socialMedia: {
        linkedin: "https://linkedin.com/in/johnsmith",
        twitter: "@johnsmith",
      },
      recentActivity: [
        "Viewed property listing",
        "Scheduled inspection",
        "Requested callback",
      ],
      company: "Smith Enterprises",
      jobTitle: "CEO",
      dealValue: 850000,
      lastInteraction: "Email sent",
      nextFollowUp: "2024-01-25",
    },
    {
      id: 2,
      name: "Lisa Chen",
      email: "lisa.chen@example.com",
      phone: "+1 (555) 234-5678",
      location: "San Francisco, CA",
      avatar: "/placeholder.svg",
      type: "Seller",
      status: "Lead",
      source: "Referral",
      lastContact: "1 day ago",
      rating: 4.9,
      notes: "Looking to sell luxury home in Nob Hill area",
      assignedAgent: "Mike Wilson",
      properties: 1,
      interactions: 8,
      tags: ["Luxury", "Motivated Seller"],
      socialMedia: {
        linkedin: "https://linkedin.com/in/lisachen",
      },
      recentActivity: ["Property evaluation", "Market analysis requested"],
      company: "Tech Solutions Inc",
      jobTitle: "CTO",
      dealValue: 2100000,
      lastInteraction: "Phone call",
      nextFollowUp: "2024-01-24",
    },
    {
      id: 3,
      name: "David Rodriguez",
      email: "david.rodriguez@example.com",
      phone: "+1 (555) 345-6789",
      location: "Miami, FL",
      avatar: "/placeholder.svg",
      type: "Investor",
      status: "Prospect",
      source: "Cold Outreach",
      lastContact: "3 days ago",
      rating: 4.6,
      notes: "Commercial property investor, portfolio expansion",
      assignedAgent: "Emma Davis",
      properties: 5,
      interactions: 15,
      tags: ["Commercial", "Portfolio Investor", "Cash"],
      socialMedia: {
        linkedin: "https://linkedin.com/in/davidrodriguez",
        twitter: "@drodriguez",
      },
      recentActivity: [
        "Downloaded market report",
        "Attended webinar",
        "Requested property list",
      ],
      company: "Rodriguez Investments",
      jobTitle: "Principal",
      dealValue: 5200000,
      lastInteraction: "Meeting scheduled",
      nextFollowUp: "2024-01-26",
    },
  ];

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "all" ||
      contact.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "all" ||
      contact.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "hot-leads" && contact.status === "Active") ||
      (activeTab === "new" && contact.lastContact.includes("hour")) ||
      (activeTab === "follow-up" && contact.nextFollowUp);
    return matchesSearch && matchesType && matchesStatus && matchesTab;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Activity className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "lead":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Zap className="h-3 w-3 mr-1" />
            Lead
          </Badge>
        );
      case "prospect":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <Target className="h-3 w-3 mr-1" />
            Prospect
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <Clock className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "buyer":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Buyer
          </Badge>
        );
      case "seller":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Seller
          </Badge>
        );
      case "investor":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Investor
          </Badge>
        );
      case "agent":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Agent
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const ContactCard = ({ contact }: { contact: any }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium text-lg">
                  {contact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {contact.name}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                {contact.jobTitle} at {contact.company}
              </p>
              <div className="flex items-center space-x-2 mb-2">
                {getTypeBadge(contact.type)}
                {getStatusBadge(contact.status)}
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(contact.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  {contact.rating}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(contact.dealValue)}
            </p>
            <p className="text-sm text-gray-500">Deal Value</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              <span className="truncate">{contact.email}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <span>{contact.phone}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{contact.location}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Building className="h-4 w-4 mr-2" />
              <span>{contact.properties} properties</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>{contact.interactions} interactions</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-green-600">{contact.lastContact}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2 line-clamp-2">
            {contact.notes}
          </p>
          <div className="flex flex-wrap gap-1">
            {contact.tags.slice(0, 3).map((tag: string, idx: number) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-gray-100"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Assigned to:</span>
            <span className="text-sm font-medium">{contact.assignedAgent}</span>
          </div>
          <div className="flex items-center space-x-2">
            {contact.socialMedia.linkedin && (
              <Button size="sm" variant="outline" className="p-2">
                <Linkedin className="h-4 w-4" />
              </Button>
            )}
            {contact.socialMedia.twitter && (
              <Button size="sm" variant="outline" className="p-2">
                <Twitter className="h-4 w-4" />
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquare className="h-4 w-4 mr-1" />
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingPlaceholder type="page" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Contact Relationship Management
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Nurture relationships and convert leads into successful deals
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <ActionButtons
              entityType="contact"
              entityId={contact.id.toString()}
              entityName={contact.name}
              email={contact.email}
              phone={contact.phone}
              showContact={true}
              variant="dropdown"
              onRefresh={handleRefresh}
            />
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 opacity-60`}
              />
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-600">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-14 h-14 rounded-xl bg-${stat.color}-100 flex items-center justify-center shadow-inner`}
                  >
                    <stat.icon className={`h-7 w-7 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Filters & Tabs */}
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-gray-600" />
                Smart Filters & Views
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-6">
                <TabsTrigger value="all">All Contacts</TabsTrigger>
                <TabsTrigger value="hot-leads">Hot Leads</TabsTrigger>
                <TabsTrigger value="new">New Today</TabsTrigger>
                <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
              </TabsList>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search contacts, companies, notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Contact Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="investor">Investor</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <TabsContent value={activeTab} className="mt-0">
                {filteredContacts.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No contacts found"
                    description="No contacts match your current filters. Try adjusting your search criteria or add new contacts."
                    actionLabel="Add Contact"
                    onAction={() => {}}
                    secondaryActionLabel="Clear Filters"
                    onSecondaryAction={() => {
                      setSearchQuery("");
                      setTypeFilter("all");
                      setStatusFilter("all");
                    }}
                  />
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600">
                        {filteredContacts.length} contacts • {viewMode} view
                      </p>
                      <Select defaultValue="recent">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">
                            Recent Activity
                          </SelectItem>
                          <SelectItem value="name">Name A-Z</SelectItem>
                          <SelectItem value="value">Deal Value</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredContacts.map((contact) => (
                          <ContactCard key={contact.id} contact={contact} />
                        ))}
                      </div>
                    ) : (
                      <Card className="border-0 shadow-sm">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50">
                                <TableHead className="font-semibold text-gray-900">
                                  Contact
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                  Contact Info
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                  Type & Status
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                  Deal Value
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                  Activity
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                  Next Action
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredContacts.map((contact, index) => (
                                <TableRow
                                  key={contact.id}
                                  className={`hover:bg-gray-50 transition-colors ${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-50/50"
                                  }`}
                                >
                                  <TableCell className="py-4">
                                    <div className="flex items-start space-x-3">
                                      <Avatar className="h-12 w-12">
                                        <AvatarImage
                                          src={contact.avatar}
                                          alt={contact.name}
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                                          {contact.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium text-gray-900">
                                          {contact.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {contact.jobTitle}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {contact.company}
                                        </p>
                                        <div className="flex items-center mt-1">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`h-3 w-3 ${
                                                i < Math.floor(contact.rating)
                                                  ? "text-yellow-400 fill-current"
                                                  : "text-gray-300"
                                              }`}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <div className="space-y-1">
                                      <div className="flex items-center text-sm">
                                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="truncate">
                                          {contact.email}
                                        </span>
                                      </div>
                                      <div className="flex items-center text-sm">
                                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                        <span>{contact.phone}</span>
                                      </div>
                                      <div className="flex items-center text-sm">
                                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                        <span>{contact.location}</span>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <div className="space-y-2">
                                      {getTypeBadge(contact.type)}
                                      {getStatusBadge(contact.status)}
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <div>
                                      <p className="text-lg font-bold text-gray-900">
                                        {formatCurrency(contact.dealValue)}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        Potential value
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <div className="space-y-1">
                                      <div className="flex items-center text-sm">
                                        <MessageSquare className="h-4 w-4 text-blue-400 mr-2" />
                                        <span>
                                          {contact.interactions} interactions
                                        </span>
                                      </div>
                                      <div className="flex items-center text-sm">
                                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-green-600">
                                          {contact.lastContact}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        {contact.lastInteraction}
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">
                                        Follow-up due
                                      </p>
                                      <p className="text-sm text-orange-600">
                                        {contact.nextFollowUp}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {contact.assignedAgent}
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <ActionButtons
                                      entityType="contact"
                                      entityId={contact.id.toString()}
                                      entityName={contact.name}
                                      email={contact.email}
                                      phone={contact.phone}
                                      showContact={true}
                                      showMore={true}
                                      onRefresh={handleRefresh}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        <Pagination
                          currentPage={page}
                          totalItems={1247}
                          itemsPerPage={limit}
                          onPageChange={setPage}
                        />
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
