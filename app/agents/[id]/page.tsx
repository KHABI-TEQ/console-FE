"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Building,
  FileText,
  Eye,
  Edit,
  Star,
  Award,
  Target,
  BarChart3,
  CreditCard,
  Home,
  Users,
  Clock,
  CheckCircle,
  ArrowLeft,
  Download,
} from "lucide-react";
import Link from "next/link";

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id;

  // Mock agent data - in real app, fetch from API using agentId
  const agent = {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "Downtown District",
    avatar: "/placeholder.svg",
    status: "Active",
    tier: "Premium",
    rating: 4.9,
    joinedDate: "2023-01-15",
    lastActive: "2 hours ago",
    specialties: ["Luxury Homes", "Commercial", "Investment Properties"],
    bio: "Experienced real estate professional with over 8 years in luxury residential and commercial properties. Specialized in high-end transactions and investment advisory.",
    certifications: [
      "Licensed Real Estate Agent",
      "Certified Luxury Home Marketing Specialist",
    ],
    languages: ["English", "Spanish", "French"],
  };

  const stats = [
    {
      title: "Total Sales",
      value: "24",
      change: "+18.2%",
      trend: "up" as const,
      icon: Home,
      color: "blue" as const,
    },
    {
      title: "Total Commission",
      value: "$185K",
      change: "+25.1%",
      trend: "up" as const,
      icon: DollarSign,
      color: "green" as const,
    },
    {
      title: "Active Listings",
      value: "12",
      change: "+12.5%",
      trend: "up" as const,
      icon: Building,
      color: "orange" as const,
    },
    {
      title: "Client Rating",
      value: "4.9",
      change: "+0.2",
      trend: "up" as const,
      icon: Star,
      color: "purple" as const,
    },
  ];

  const transactions = [
    {
      id: "T001",
      property: "Modern Downtown Apartment",
      address: "123 Main St, Downtown",
      type: "Sale",
      amount: 850000,
      commission: 25500,
      status: "Completed",
      date: "2024-01-15",
      buyer: "John Smith",
      seller: "Alice Brown",
    },
    {
      id: "T002",
      property: "Luxury Family Home",
      address: "456 Oak Ave, Suburbs",
      type: "Sale",
      amount: 1250000,
      commission: 37500,
      status: "In Progress",
      date: "2024-01-10",
      buyer: "Lisa Chen",
      seller: "David Wilson",
    },
    {
      id: "T003",
      property: "Commercial Office Space",
      address: "789 Business Blvd",
      type: "Lease",
      amount: 5000,
      commission: 2000,
      status: "Completed",
      date: "2024-01-05",
      buyer: "TechCorp Inc.",
      seller: "Downtown Properties LLC",
    },
  ];

  const inspections = [
    {
      id: "I001",
      property: "Modern Downtown Apartment",
      status: "Completed",
      date: "2024-01-18",
      buyer: "John Smith",
      result: "Approved",
      notes: "All systems in excellent condition",
    },
    {
      id: "I002",
      property: "Luxury Family Home",
      status: "Scheduled",
      date: "2024-01-25",
      buyer: "Lisa Chen",
      result: "Pending",
      notes: "Awaiting inspection completion",
    },
    {
      id: "I003",
      property: "Suburban Condo",
      status: "In Progress",
      date: "2024-01-20",
      buyer: "Michael Rodriguez",
      result: "Under Review",
      notes: "Minor repairs needed",
    },
  ];

  const negotiations = [
    {
      id: "N001",
      property: "Luxury Family Home",
      originalPrice: 1250000,
      currentOffer: 1200000,
      status: "Active",
      rounds: 3,
      buyer: "Lisa Chen",
      lastUpdate: "2024-01-22",
    },
    {
      id: "N002",
      property: "Investment Property",
      originalPrice: 750000,
      currentOffer: 725000,
      status: "Accepted",
      rounds: 2,
      buyer: "Investment Group LLC",
      lastUpdate: "2024-01-20",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "scheduled":
        return (
          <Badge className="bg-orange-100 text-orange-800">Scheduled</Badge>
        );
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title={agent.name}
          description="Agent profile, performance metrics, and transaction history"
        >
          <Link href="/agents">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>
          </Link>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Edit className="h-4 w-4 mr-2" />
            Edit Agent
          </Button>
        </PageHeader>

        {/* Agent Profile Card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold">
                    {agent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {agent.name}
                    </h2>
                    <Badge className="bg-purple-100 text-purple-800">
                      <Award className="h-3 w-3 mr-1" />
                      {agent.tier}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">
                      {agent.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(agent.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {agent.rating} rating
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{agent.bio}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-gray-400 mr-3" />
                        <span>{agent.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 text-gray-400 mr-3" />
                        <span>{agent.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                        <span>{agent.location}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                        <span>Joined {agent.joinedDate}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-green-600">
                          Active {agent.lastActive}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 text-gray-400 mr-3" />
                        <span>{agent.languages.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Specialties
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {agent.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Certifications
                  </h4>
                  <div className="space-y-1">
                    {agent.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Detailed Information Tabs */}
        <Card className="border border-gray-200 shadow-sm">
          <Tabs defaultValue="transactions" className="w-full">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="inspections">Inspections</TabsTrigger>
                <TabsTrigger value="negotiations">Negotiations</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="p-0">
              <TabsContent value="transactions" className="mt-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Transaction History
                    </h3>
                    <Badge variant="secondary">
                      {transactions.length} transactions
                    </Badge>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Commission</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Parties</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {transaction.property}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {transaction.address}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {transaction.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell className="font-medium text-green-600">
                              {formatCurrency(transaction.commission)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(transaction.status)}
                            </TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>Buyer: {transaction.buyer}</p>
                                <p>Seller: {transaction.seller}</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="inspections" className="mt-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Inspection Records
                    </h3>
                    <Badge variant="secondary">
                      {inspections.length} inspections
                    </Badge>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Buyer</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inspections.map((inspection) => (
                          <TableRow key={inspection.id}>
                            <TableCell className="font-medium">
                              {inspection.property}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(inspection.status)}
                            </TableCell>
                            <TableCell>{inspection.date}</TableCell>
                            <TableCell>{inspection.buyer}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {inspection.result}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {inspection.notes}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="negotiations" className="mt-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Active Negotiations
                    </h3>
                    <Badge variant="secondary">
                      {negotiations.length} negotiations
                    </Badge>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Original Price</TableHead>
                          <TableHead>Current Offer</TableHead>
                          <TableHead>Rounds</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Buyer</TableHead>
                          <TableHead>Last Update</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {negotiations.map((negotiation) => (
                          <TableRow key={negotiation.id}>
                            <TableCell className="font-medium">
                              {negotiation.property}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(negotiation.originalPrice)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(negotiation.currentOffer)}
                            </TableCell>
                            <TableCell>{negotiation.rounds}</TableCell>
                            <TableCell>
                              {getStatusBadge(negotiation.status)}
                            </TableCell>
                            <TableCell>{negotiation.buyer}</TableCell>
                            <TableCell>{negotiation.lastUpdate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="mt-0">
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Financial Breakdown
                    </h3>
                    <Badge variant="secondary">YTD 2024</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-blue-900">
                            $185,000
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-blue-600" />
                      </div>
                    </Card>

                    <Card className="p-4 bg-green-50 border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600">
                            Commission Rate
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            3.2%
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                    </Card>

                    <Card className="p-4 bg-purple-50 border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600">
                            Avg Deal Size
                          </p>
                          <p className="text-2xl font-bold text-purple-900">
                            $925K
                          </p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-purple-600" />
                      </div>
                    </Card>

                    <Card className="p-4 bg-orange-50 border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-orange-600">
                            Closing Rate
                          </p>
                          <p className="text-2xl font-bold text-orange-900">
                            87%
                          </p>
                        </div>
                        <Target className="h-8 w-8 text-orange-600" />
                      </div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-4">
                        Monthly Commission Trend
                      </h4>
                      <div className="space-y-3">
                        {[
                          { month: "January", amount: 45000, deals: 6 },
                          { month: "February", amount: 38000, deals: 5 },
                          { month: "March", amount: 52000, deals: 7 },
                          { month: "April", amount: 50000, deals: 6 },
                        ].map((month, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm font-medium">
                              {month.month}
                            </span>
                            <div className="text-right">
                              <p className="font-semibold">
                                {formatCurrency(month.amount)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {month.deals} deals
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-4">
                        Commission by Property Type
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            type: "Luxury Homes",
                            amount: 95000,
                            percentage: 51,
                          },
                          { type: "Commercial", amount: 45000, percentage: 24 },
                          {
                            type: "Residential",
                            amount: 30000,
                            percentage: 16,
                          },
                          { type: "Investment", amount: 15000, percentage: 9 },
                        ].map((type, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {type.type}
                              </span>
                              <span className="font-semibold">
                                {formatCurrency(type.amount)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${type.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </AdminLayout>
  );
}
