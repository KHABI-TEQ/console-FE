"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building,
  Eye,
  Heart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Activity,
  PieChart,
  LineChart,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  MapPin,
  Phone,
  Mail,
  FileText,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsSkeleton } from "@/components/skeletons/PageSkeletons";
import { apiService } from "@/lib/services/apiService";

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [selectedMetric, setSelectedMetric] = useState("all");

  const {
    data: analyticsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["analytics", selectedPeriod],
    queryFn: () => apiService.getDashboardStats(),
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <AnalyticsSkeleton />
      </AdminLayout>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: "₦2.4M",
      change: "+18.2%",
      trend: "up" as const,
      icon: DollarSign,
      color: "green" as const,
    },
    {
      title: "Properties Sold",
      value: "847",
      change: "+12.5%",
      trend: "up" as const,
      icon: Building,
      color: "blue" as const,
    },
    {
      title: "Active Users",
      value: "12,429",
      change: "+8.1%",
      trend: "up" as const,
      icon: Users,
      color: "purple" as const,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-2.4%",
      trend: "down" as const,
      icon: Target,
      color: "orange" as const,
    },
  ];

  const propertyPerformance = [
    {
      id: 1,
      title: "Luxury Downtown Penthouse",
      location: "Manhattan, NY",
      price: "₦2,850,000",
      views: 2847,
      likes: 234,
      inquiries: 67,
      showings: 12,
      offers: 3,
      daysOnMarket: 45,
      performance: "excellent",
    },
    {
      id: 2,
      title: "Modern Family Home",
      location: "Brooklyn, NY",
      price: "₦1,250,000",
      views: 1923,
      likes: 156,
      inquiries: 43,
      showings: 8,
      offers: 2,
      daysOnMarket: 32,
      performance: "good",
    },
    {
      id: 3,
      title: "Cozy Studio Apartment",
      location: "Queens, NY",
      price: "₦450,000",
      views: 876,
      likes: 78,
      inquiries: 21,
      showings: 5,
      offers: 1,
      daysOnMarket: 67,
      performance: "average",
    },
  ];

  const agentPerformance = [
    {
      id: 1,
      name: "Sarah Mitchell",
      avatar: "/placeholder.svg",
      totalSales: "₦8.2M",
      propertiesSold: 34,
      activeListings: 12,
      avgDaysOnMarket: 28,
      clientSatisfaction: 4.9,
      commission: "₦246,000",
      performance: "excellent",
    },
    {
      id: 2,
      name: "Mike Wilson",
      avatar: "/placeholder.svg",
      totalSales: "₦6.8M",
      propertiesSold: 28,
      activeListings: 9,
      avgDaysOnMarket: 35,
      clientSatisfaction: 4.7,
      commission: "₦204,000",
      performance: "excellent",
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "/placeholder.svg",
      totalSales: "₦4.2M",
      propertiesSold: 18,
      activeListings: 7,
      avgDaysOnMarket: 42,
      clientSatisfaction: 4.5,
      commission: "₦126,000",
      performance: "good",
    },
  ];

  const marketTrends = [
    {
      period: "Q1 2024",
      avgPrice: "₦875,000",
      priceChange: "+5.2%",
      volume: 234,
      volumeChange: "+12.1%",
      daysOnMarket: 32,
      marketChange: "-8.5%",
    },
    {
      period: "Q4 2023",
      avgPrice: "₦831,000",
      priceChange: "+3.8%",
      volume: 209,
      volumeChange: "+6.7%",
      daysOnMarket: 35,
      marketChange: "+2.3%",
    },
    {
      period: "Q3 2023",
      avgPrice: "₦800,000",
      priceChange: "+2.1%",
      volume: 196,
      volumeChange: "-4.2%",
      daysOnMarket: 34,
      marketChange: "-1.2%",
    },
  ];

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case "excellent":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Star className="h-3 w-3 mr-1" />
            Excellent
          </Badge>
        );
      case "good":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Good
          </Badge>
        );
      case "average":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            Average
          </Badge>
        );
      default:
        return <Badge variant="secondary">{performance}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Analytics & Reports"
          description="Comprehensive analytics dashboard with performance metrics and insights"
        >
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </PageHeader>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-md"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 opacity-50`}
              />
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center`}
                  >
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="market">Market Trends</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Revenue Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        Revenue chart visualization
                      </p>
                      <p className="text-sm text-gray-500">
                        Chart component would be implemented here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Traffic Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        source: "Direct Traffic",
                        percentage: 35,
                        color: "blue",
                      },
                      {
                        source: "Search Engines",
                        percentage: 28,
                        color: "green",
                      },
                      {
                        source: "Social Media",
                        percentage: 22,
                        color: "purple",
                      },
                      { source: "Referrals", percentage: 15, color: "orange" },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {item.source}
                          </span>
                          <span className="text-sm text-gray-600">
                            {item.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-${item.color}-600 h-2 rounded-full transition-all`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Property Listed",
                        description:
                          "Luxury Downtown Penthouse listed for $2.85M",
                        time: "2 hours ago",
                        type: "listing",
                      },
                      {
                        action: "Sale Completed",
                        description: "Modern Family Home sold for $1.25M",
                        time: "5 hours ago",
                        type: "sale",
                      },
                      {
                        action: "New Agent",
                        description: "John Smith joined the platform",
                        time: "1 day ago",
                        type: "agent",
                      },
                      {
                        action: "Inspection Scheduled",
                        description:
                          "Property inspection for Cozy Studio Apartment",
                        time: "2 days ago",
                        type: "inspection",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === "listing"
                              ? "bg-blue-100"
                              : activity.type === "sale"
                                ? "bg-green-100"
                                : activity.type === "agent"
                                  ? "bg-purple-100"
                                  : "bg-orange-100"
                          }`}
                        >
                          {activity.type === "listing" ? (
                            <Building className="h-4 w-4 text-blue-600" />
                          ) : activity.type === "sale" ? (
                            <DollarSign className="h-4 w-4 text-green-600" />
                          ) : activity.type === "agent" ? (
                            <Users className="h-4 w-4 text-purple-600" />
                          ) : (
                            <Search className="h-4 w-4 text-orange-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.description}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Property Performance Analysis
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={selectedMetric}
                      onValueChange={setSelectedMetric}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Metrics</SelectItem>
                        <SelectItem value="views">Views</SelectItem>
                        <SelectItem value="inquiries">Inquiries</SelectItem>
                        <SelectItem value="offers">Offers</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Inquiries</TableHead>
                        <TableHead>Showings</TableHead>
                        <TableHead>Offers</TableHead>
                        <TableHead>Days on Market</TableHead>
                        <TableHead>Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {propertyPerformance.map((property) => (
                        <TableRow
                          key={property.id}
                          className="hover:bg-gray-50"
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{property.title}</p>
                              <p className="text-sm text-gray-600 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {property.location}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {property.price}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1 text-gray-400" />
                              {property.views.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1 text-gray-400" />
                              {property.inquiries}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              {property.showings}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-1 text-gray-400" />
                              {property.offers}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {property.daysOnMarket} days
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getPerformanceBadge(property.performance)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Agent Performance Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Total Sales</TableHead>
                        <TableHead>Properties Sold</TableHead>
                        <TableHead>Active Listings</TableHead>
                        <TableHead>Avg Days on Market</TableHead>
                        <TableHead>Client Rating</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agentPerformance.map((agent) => (
                        <TableRow key={agent.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                                {agent.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <span className="font-medium">{agent.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {agent.totalSales}
                          </TableCell>
                          <TableCell>{agent.propertiesSold}</TableCell>
                          <TableCell>{agent.activeListings}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {agent.avgDaysOnMarket} days
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              {agent.clientSatisfaction}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {agent.commission}
                          </TableCell>
                          <TableCell>
                            {getPerformanceBadge(agent.performance)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2" />
                    Market Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketTrends.map((trend, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold">{trend.period}</h4>
                          <Badge variant="outline">{trend.volume} sales</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Avg Price</p>
                            <p className="font-semibold">{trend.avgPrice}</p>
                            <p
                              className={`text-xs ${trend.priceChange.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                            >
                              {trend.priceChange}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Volume</p>
                            <p className="font-semibold">{trend.volume}</p>
                            <p
                              className={`text-xs ${trend.volumeChange.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                            >
                              {trend.volumeChange}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Days on Market</p>
                            <p className="font-semibold">
                              {trend.daysOnMarket}
                            </p>
                            <p
                              className={`text-xs ${trend.marketChange.startsWith("+") ? "text-red-600" : "text-green-600"}`}
                            >
                              {trend.marketChange}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Key Performance Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        metric: "Average Sale Price",
                        value: "$875,000",
                        target: "$850,000",
                        performance: 103,
                        trend: "up",
                      },
                      {
                        metric: "Time to Sale",
                        value: "32 days",
                        target: "35 days",
                        performance: 109,
                        trend: "up",
                      },
                      {
                        metric: "Conversion Rate",
                        value: "3.2%",
                        target: "3.5%",
                        performance: 91,
                        trend: "down",
                      },
                      {
                        metric: "Customer Satisfaction",
                        value: "4.7/5",
                        target: "4.5/5",
                        performance: 104,
                        trend: "up",
                      },
                    ].map((kpi, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {kpi.metric}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{kpi.value}</span>
                            {kpi.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                kpi.performance >= 100
                                  ? "bg-green-600"
                                  : kpi.performance >= 85
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{
                                width: `${Math.min(kpi.performance, 100)}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 w-12">
                            {kpi.performance}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Target: {kpi.target}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Monthly Sales Report",
                  description:
                    "Comprehensive monthly sales performance and trends",
                  type: "PDF",
                  lastGenerated: "2024-02-01",
                  category: "Sales",
                },
                {
                  title: "Agent Performance Report",
                  description:
                    "Individual agent metrics and comparison analysis",
                  type: "Excel",
                  lastGenerated: "2024-01-28",
                  category: "HR",
                },
                {
                  title: "Market Analysis Report",
                  description: "Local market trends and competitive analysis",
                  type: "PDF",
                  lastGenerated: "2024-01-25",
                  category: "Market",
                },
                {
                  title: "Financial Summary",
                  description: "Revenue, expenses, and profit analysis",
                  type: "PDF",
                  lastGenerated: "2024-01-31",
                  category: "Finance",
                },
                {
                  title: "Customer Satisfaction Report",
                  description: "Client feedback and satisfaction metrics",
                  type: "PDF",
                  lastGenerated: "2024-01-20",
                  category: "Customer",
                },
                {
                  title: "Property Inventory Report",
                  description: "Current listings and inventory analysis",
                  type: "Excel",
                  lastGenerated: "2024-02-02",
                  category: "Inventory",
                },
              ].map((report, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {report.title}
                        </CardTitle>
                        <Badge variant="outline" className="mt-2">
                          {report.category}
                        </Badge>
                      </div>
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {report.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Last generated: {report.lastGenerated}</span>
                      <Badge variant="secondary">{report.type}</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
