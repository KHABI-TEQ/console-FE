import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Properties",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Building,
      color: "blue",
    },
    {
      title: "Active Agents",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "green",
    },
    {
      title: "Pending Inspections",
      value: "23",
      change: "-3.1%",
      trend: "down",
      icon: Search,
      color: "orange",
    },
    {
      title: "Total Revenue",
      value: "$485,200",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "purple",
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
    },
    {
      id: 2,
      type: "agent",
      title: "Agent registered",
      description: "Sarah Johnson joined as premium agent",
      time: "1 hour ago",
      status: "completed",
    },
    {
      id: 3,
      type: "property",
      title: "Property listed",
      description: "Luxury Penthouse added to listings",
      time: "3 hours ago",
      status: "completed",
    },
    {
      id: 4,
      type: "inspection",
      title: "Inspection approved",
      description: "Suburban Family Home inspection confirmed",
      time: "5 hours ago",
      status: "completed",
    },
  ];

  const quickActions = [
    {
      title: "Manage Inspections",
      description: "Review and approve property inspections",
      icon: Search,
      href: "/admin/inspections",
      color: "blue",
    },
    {
      title: "Agent Management",
      description: "Manage agent profiles and permissions",
      icon: Users,
      href: "/admin/agents",
      color: "green",
    },
    {
      title: "Property Briefs",
      description: "Handle property briefings and documentation",
      icon: FileText,
      href: "/admin/briefs",
      color: "purple",
    },
    {
      title: "Contact Management",
      description: "Manage customer contacts and communications",
      icon: Calendar,
      href: "/admin/contacts",
      color: "orange",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Welcome back! Here's what's happening with your property
              management system.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <Activity className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View </span>Analytics
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      {stat.title}
                    </p>
                    <p className="text-lg sm:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <div className="flex items-center space-x-1">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 hidden sm:inline">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center flex-shrink-0 ml-2`}
                  >
                    <stat.icon
                      className={`h-5 w-5 sm:h-6 sm:w-6 text-${stat.color}-600`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="xl:col-span-2">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-gray-600" />
                    <span>Recent Activity</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">View All</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-3 sm:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {activity.status === "pending" ? (
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-yellow-600" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                    <Badge
                      variant={
                        activity.status === "pending" ? "secondary" : "default"
                      }
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LayoutGrid className="h-5 w-5 text-gray-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 sm:p-4 hover:bg-gray-50"
                    asChild
                  >
                    <a href={action.href}>
                      <div className="flex items-start space-x-3 w-full">
                        <div
                          className={`w-10 h-10 rounded-lg bg-${action.color}-100 flex items-center justify-center flex-shrink-0`}
                        >
                          <action.icon
                            className={`h-5 w-5 text-${action.color}-600`}
                          />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">
                            {action.title}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Status */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-gray-600" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900 text-sm sm:text-base">
                    Database
                  </span>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900 text-sm sm:text-base">
                    API Services
                  </span>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900 text-sm sm:text-base">
                    Email Service
                  </span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  Maintenance
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
