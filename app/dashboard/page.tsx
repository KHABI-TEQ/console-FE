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
  Users,
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Building,
  Clock,
  CheckCircle,
  RefreshCw,
  Zap,
  Trophy,
  Target,
  Star,
  BarChart3,
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
      color: "emerald",
      description: "Properties listed",
    },
    {
      title: "Active Agents",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "blue",
      description: "Registered agents",
    },
    {
      title: "Pending Inspections",
      value: "23",
      change: "-3.1%",
      trend: "down",
      icon: Search,
      color: "amber",
      description: "Awaiting review",
    },
    {
      title: "Revenue",
      value: "$485,200",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "violet",
      description: "This month",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "inspection",
      title: "Property inspection requested",
      location: "Downtown Lagos",
      time: "2 minutes ago",
      status: "pending",
      agent: "John Doe",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      type: "agent",
      title: "New agent registered",
      location: "Victoria Island",
      time: "1 hour ago",
      status: "approved",
      agent: "Sarah Johnson",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      type: "property",
      title: "Property listing updated",
      location: "Lekki Phase 1",
      time: "3 hours ago",
      status: "published",
      agent: "Emma Wilson",
      avatar: "/placeholder.svg",
    },
    {
      id: 4,
      type: "approval",
      title: "Inspection approved",
      location: "Ikeja GRA",
      time: "5 hours ago",
      status: "completed",
      agent: "Mike Davis",
      avatar: "/placeholder.svg",
    },
  ];

  const quickActions = [
    {
      title: "Review Inspections",
      count: 23,
      href: "/inspections",
      icon: Search,
      color: "orange",
      description: "Pending approvals",
    },
    {
      title: "Manage Agents",
      count: 156,
      href: "/agents",
      icon: Users,
      color: "blue",
      description: "Active agents",
    },
    {
      title: "Property Briefs",
      count: 89,
      href: "/briefs",
      icon: Calendar,
      color: "purple",
      description: "New submissions",
    },
    {
      title: "Analytics",
      count: 0,
      href: "/analytics",
      icon: BarChart3,
      color: "green",
      description: "View reports",
    },
  ];

  const topPerformers = [
    {
      name: "Sarah Johnson",
      role: "Premium Agent",
      avatar: "/placeholder.svg",
      sales: 24,
      rating: 4.9,
      change: "+12%",
    },
    {
      name: "Mike Wilson",
      role: "Senior Agent",
      avatar: "/placeholder.svg",
      sales: 18,
      rating: 4.7,
      change: "+8%",
    },
    {
      name: "Emma Davis",
      role: "Agent",
      avatar: "/placeholder.svg",
      sales: 15,
      rating: 4.8,
      change: "+5%",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "approved":
      case "completed":
      case "published":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with your properties today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span
                    className={`font-medium ${
                      stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-gray-600" />
                    Recent Activity
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700"
                    >
                      Live
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View all
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="p-2 rounded-lg bg-blue-100">
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.location} • by {activity.agent}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={`text-xs ${getStatusColor(activity.status)}`}
                        >
                          {activity.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-gray-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full h-auto p-4 justify-start hover:bg-gray-50"
                      asChild
                    >
                      <a href={action.href}>
                        <div className="flex items-center gap-3 w-full">
                          <div
                            className={`p-2 rounded-lg bg-${action.color}-100`}
                          >
                            <action.icon
                              className={`h-5 w-5 text-${action.color}-600`}
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-gray-900 text-sm">
                              {action.title}
                            </p>
                            <p className="text-xs text-gray-600">
                              {action.description}
                            </p>
                          </div>
                          {action.count > 0 && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700"
                            >
                              {action.count}
                            </Badge>
                          )}
                        </div>
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5 text-gray-600" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={performer.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {performer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                            <Star className="h-2.5 w-2.5 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {performer.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {performer.role}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {performer.sales} sales
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-400 fill-current" />
                          <span className="text-xs text-gray-600">
                            {performer.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
