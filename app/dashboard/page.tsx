"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/skeletons/PageSkeletons";
import { apiService } from "@/lib/services/apiService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutGrid,
  Users,
  FileText,
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  DollarSign,
  Eye,
  ArrowUpRight,
  Building,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  BarChart3,
  PieChart,
  MapPin,
  Star,
  Home,
  UserCheck,
  AlertCircle,
  Target,
  Zap,
  Trophy,
} from "lucide-react";

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: dashboardData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["dashboard-stats", timeRange],
    queryFn: () => apiService.getDashboardStats(),
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <DashboardSkeleton />
      </AdminLayout>
    );
  }

  const stats = [
    {
      title: "Total Properties",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Building,
      color: "blue",
      progress: 75,
      target: "3,000",
    },
    {
      title: "Active Agents",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "green",
      progress: 85,
      target: "180",
    },
    {
      title: "Pending Inspections",
      value: "23",
      change: "-3.1%",
      trend: "down",
      icon: Search,
      color: "orange",
      progress: 40,
      target: "50",
    },
    {
      title: "Monthly Revenue",
      value: "$485,200",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "purple",
      progress: 92,
      target: "$500K",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "inspection",
      title: "New inspection request",
      description: "Modern Downtown Apartment by John Doe",
      time: "2 minutes ago",
      status: "pending",
      priority: "high",
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg",
      },
    },
    {
      id: 2,
      type: "agent",
      title: "Agent registered",
      description: "Sarah Johnson joined as premium agent",
      time: "1 hour ago",
      status: "completed",
      priority: "medium",
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg",
      },
    },
    {
      id: 3,
      type: "property",
      title: "Property listed",
      description: "Luxury Penthouse added to listings",
      time: "3 hours ago",
      status: "completed",
      priority: "low",
      user: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg",
      },
    },
    {
      id: 4,
      type: "inspection",
      title: "Inspection approved",
      description: "Suburban Family Home inspection confirmed",
      time: "5 hours ago",
      status: "completed",
      priority: "medium",
      user: {
        name: "Mike Davis",
        avatar: "/placeholder.svg",
      },
    },
  ];

  const quickActions = [
    {
      title: "Manage Inspections",
      description: "Review and approve property inspections",
      icon: Search,
      href: "/inspections",
      color: "blue",
      count: 23,
      badge: "Urgent",
    },
    {
      title: "Agent Management",
      description: "Manage agent profiles and permissions",
      icon: Users,
      href: "/agents",
      color: "green",
      count: 156,
      badge: "Active",
    },
    {
      title: "Property Briefs",
      description: "Handle property briefings and documentation",
      icon: FileText,
      href: "/briefs",
      color: "purple",
      count: 89,
      badge: "Pending",
    },
    {
      title: "Contact Management",
      description: "Manage customer contacts and communications",
      icon: Calendar,
      href: "/contacts",
      color: "orange",
      count: 342,
      badge: "New",
    },
  ];

  const topPerformers = [
    {
      name: "Sarah Johnson",
      role: "Premium Agent",
      avatar: "/placeholder.svg",
      sales: 24,
      commission: "$125,000",
      rating: 4.9,
      badge: "Top Performer",
    },
    {
      name: "Mike Wilson",
      role: "Senior Agent",
      avatar: "/placeholder.svg",
      sales: 18,
      commission: "$95,000",
      rating: 4.7,
      badge: "Rising Star",
    },
    {
      name: "Emma Davis",
      role: "Agent",
      avatar: "/placeholder.svg",
      sales: 15,
      commission: "$78,000",
      rating: 4.8,
      badge: "Consistent",
    },
  ];

  const marketInsights = [
    {
      title: "Average Sale Price",
      value: "$685,000",
      change: "+5.2%",
      trend: "up",
      description: "Up from last month",
    },
    {
      title: "Days on Market",
      value: "18 days",
      change: "-12%",
      trend: "up",
      description: "Faster than average",
    },
    {
      title: "Conversion Rate",
      value: "68%",
      change: "+3.1%",
      trend: "up",
      description: "Leads to sales",
    },
    {
      title: "Client Satisfaction",
      value: "4.8/5",
      change: "+0.2",
      trend: "up",
      description: "Average rating",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "inspection":
        return <Search className="h-4 w-4" />;
      case "agent":
        return <Users className="h-4 w-4" />;
      case "property":
        return <Building className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Dashboard Analytics
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Real-time insights into your property management ecosystem
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Last updated: {new Date().toLocaleTimeString()}
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                All systems operational
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 opacity-50`}
              />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-14 h-14 rounded-xl bg-${stat.color}-100 flex items-center justify-center shadow-inner`}
                  >
                    <stat.icon className={`h-7 w-7 text-${stat.color}-600`} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress to target</span>
                    <span className="font-medium">{stat.target}</span>
                  </div>
                  <Progress
                    value={stat.progress}
                    className={`h-2 bg-${stat.color}-100`}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
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
                    <span className="text-xs text-gray-500">
                      vs last period
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Activity - Enhanced */}
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-gray-600" />
                    <span>Recent Activity</span>
                    <Badge variant="secondary" className="ml-2">
                      Live
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.status === "pending"
                              ? "bg-yellow-100"
                              : "bg-green-100"
                          }`}
                        >
                          {activity.status === "pending" ? (
                            <Clock className="h-5 w-5 text-yellow-600" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {activity.description}
                            </p>
                            <div className="flex items-center space-x-3 mt-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={activity.user.avatar} />
                                <AvatarFallback className="text-xs">
                                  {activity.user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-500">
                                {activity.user.name}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {activity.time}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge
                              variant={
                                activity.status === "pending"
                                  ? "secondary"
                                  : "default"
                              }
                              className="text-xs"
                            >
                              {activity.status}
                            </Badge>
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                activity.priority,
                              )}`}
                            >
                              {activity.priority}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions - Enhanced */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-gray-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Card
                      key={index}
                      className="border hover:shadow-md transition-all duration-200 cursor-pointer group"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-12 h-12 rounded-lg bg-${action.color}-100 flex items-center justify-center flex-shrink-0 group-hover:bg-${action.color}-200 transition-colors`}
                          >
                            <action.icon
                              className={`h-6 w-6 text-${action.color}-600`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-gray-900 text-sm">
                                {action.title}
                              </h3>
                              <Badge
                                variant="secondary"
                                className={`text-xs bg-${action.color}-100 text-${action.color}-800`}
                              >
                                {action.badge}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              {action.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-gray-900">
                                {action.count}
                              </span>
                              <Button size="sm" variant="ghost" className="p-1">
                                <ArrowUpRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Row - Performance & Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Top Performers */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-gray-600" />
                <span>Top Performers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-lg border hover:shadow-sm transition-shadow"
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={performer.avatar} />
                        <AvatarFallback>
                          {performer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Star className="h-3 w-3 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900">
                          {performer.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                        >
                          {performer.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {performer.role}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-600">
                            {performer.sales} sales
                          </span>
                          <span className="font-medium text-green-600">
                            {performer.commission}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">
                            {performer.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-gray-600" />
                <span>Market Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {marketInsights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-gradient-to-br from-gray-50 to-white"
                  >
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {insight.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {insight.value}
                    </p>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        {insight.change}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
