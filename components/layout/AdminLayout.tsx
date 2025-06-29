"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Users,
  FileText,
  CreditCard,
  UserCheck,
  Settings,
  Search,
  Menu,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Home,
  Building,
  ClipboardList,
  MessageSquare,
  BarChart3,
  Shield,
  Calendar,
  Archive,
  Briefcase,
  HelpCircle,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  disabled: boolean;
  badge?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard Overview",
    icon: LayoutGrid,
    disabled: false,
  },
  {
    href: "/admin/properties",
    label: "Property Management",
    icon: Building,
    disabled: false,
    badge: "245",
    children: [
      {
        href: "/admin/properties/listings",
        label: "All Listings",
        icon: Archive,
        disabled: false,
      },
      {
        href: "/admin/properties/featured",
        label: "Featured Properties",
        icon: BarChart3,
        disabled: false,
      },
      {
        href: "/admin/properties/pending",
        label: "Pending Approval",
        icon: Clock,
        disabled: false,
        badge: "12",
      },
    ],
  },
  {
    href: "/admin/agents",
    label: "Agent Management",
    icon: Users,
    disabled: false,
    badge: "56",
    children: [
      {
        href: "/admin/agents/active",
        label: "Active Agents",
        icon: UserCheck,
        disabled: false,
      },
      {
        href: "/admin/agents/pending",
        label: "Pending Approval",
        icon: Clock,
        disabled: false,
        badge: "8",
      },
      {
        href: "/admin/agents/performance",
        label: "Performance",
        icon: BarChart3,
        disabled: false,
      },
    ],
  },
  {
    href: "/admin/inspections",
    label: "Inspection Management",
    icon: Search,
    disabled: false,
    badge: "23",
    children: [
      {
        href: "/admin/inspections/pending",
        label: "Pending Inspections",
        icon: Clock,
        disabled: false,
        badge: "15",
      },
      {
        href: "/admin/inspections/scheduled",
        label: "Scheduled",
        icon: Calendar,
        disabled: false,
      },
      {
        href: "/admin/inspections/completed",
        label: "Completed",
        icon: UserCheck,
        disabled: false,
      },
    ],
  },
  {
    href: "/admin/briefs",
    label: "Briefs Management",
    icon: FileText,
    disabled: false,
    children: [
      {
        href: "/admin/briefs/active",
        label: "Active Briefs",
        icon: ClipboardList,
        disabled: false,
      },
      {
        href: "/admin/briefs/templates",
        label: "Templates",
        icon: Archive,
        disabled: false,
      },
    ],
  },
  {
    href: "/admin/contacts",
    label: "Contact Management",
    icon: MessageSquare,
    disabled: false,
    badge: "142",
  },
  {
    href: "/admin/preferences",
    label: "Preference Management",
    icon: Settings,
    disabled: false,
  },
  {
    href: "/admin/analytics",
    label: "Analytics & Reports",
    icon: BarChart3,
    disabled: false,
    children: [
      {
        href: "/admin/analytics/overview",
        label: "Overview",
        icon: BarChart3,
        disabled: false,
      },
      {
        href: "/admin/analytics/revenue",
        label: "Revenue",
        icon: CreditCard,
        disabled: false,
      },
      {
        href: "/admin/analytics/performance",
        label: "Performance",
        icon: TrendingUp,
        disabled: false,
      },
    ],
  },
  {
    href: "/admin/settings",
    label: "System Settings",
    icon: Settings,
    disabled: false,
    children: [
      {
        href: "/admin/settings/general",
        label: "General",
        icon: Settings,
        disabled: false,
      },
      {
        href: "/admin/settings/users",
        label: "User Management",
        icon: Users,
        disabled: false,
      },
      {
        href: "/admin/settings/security",
        label: "Security",
        icon: Shield,
        disabled: false,
      },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

function NavMenuItem({ item, level = 0 }: { item: NavItem; level?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  return (
    <div>
      <Link
        href={item.disabled ? "#" : item.href}
        onClick={(e) => {
          if (item.disabled) {
            e.preventDefault();
            return;
          }
          if (hasChildren) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          "flex items-center justify-between group px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
          level > 0 && "ml-4 pl-8",
          isActive
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm"
            : item.disabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm",
        )}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Icon
            className={cn(
              "h-5 w-5 flex-shrink-0 transition-colors",
              isActive
                ? "text-blue-600"
                : item.disabled
                  ? "text-gray-400"
                  : "text-gray-500 group-hover:text-gray-700",
            )}
          />
          <span className="truncate">{item.label}</span>
        </div>

        <div className="flex items-center space-x-2">
          {item.badge && !item.disabled && (
            <Badge
              variant={isActive ? "default" : "secondary"}
              className="text-xs h-5 px-2"
            >
              {item.badge}
            </Badge>
          )}
          {item.disabled && (
            <Badge variant="outline" className="text-xs h-5 px-2">
              Soon
            </Badge>
          )}
          {hasChildren && (
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "rotate-90",
              )}
            />
          )}
        </div>
      </Link>

      {hasChildren && isOpen && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavMenuItem key={child.href} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent({
  onClose,
  isCollapsed,
  onToggleCollapse,
}: {
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PropertyAdmin
                </h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            )}
          </div>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="hidden lg:flex"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavMenuItem key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-medium">
                AU
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 truncate">
                admin@example.com
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-medium">
                AU
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 transition-all duration-300",
          sidebarCollapsed ? "lg:w-20" : "lg:w-80",
        )}
      >
        <div className="flex grow flex-col bg-white shadow-sm border-r border-gray-200">
          <SidebarContent
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0 mobile-menu-height">
          <SidebarContent onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-80",
        )}
      >
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
          <div className="px-4 sm:px-6 lg:px-8 safe-area-inset">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="flex items-center lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="p-2"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open sidebar</span>
                </Button>
              </div>

              {/* Center - Search */}
              <div className="flex-1 flex items-center justify-center lg:justify-start max-w-2xl lg:max-w-md">
                <div className="w-full">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      className="block w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                      placeholder="Search properties, agents, inspections..."
                      type="search"
                    />
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Theme toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hidden sm:flex"
                >
                  <Sun className="h-5 w-5" />
                </Button>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative p-2">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          3
                        </span>
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-96 overflow-y-auto">
                      <DropdownMenuItem>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">
                            New inspection request
                          </p>
                          <p className="text-xs text-gray-500">
                            Modern Downtown Apartment
                          </p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">
                            Agent approval pending
                          </p>
                          <p className="text-xs text-gray-500">
                            Sarah Johnson waiting for approval
                          </p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">
                            Property listing updated
                          </p>
                          <p className="text-xs text-gray-500">
                            Luxury Penthouse price changed
                          </p>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center">
                      <span className="text-sm text-blue-600">
                        View all notifications
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile dropdown - Desktop only */}
                <div className="hidden sm:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2 p-2"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/api/placeholder/32/32" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-medium">
                            AU
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Support
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 safe-area-inset">{children}</main>
      </div>
    </div>
  );
}
