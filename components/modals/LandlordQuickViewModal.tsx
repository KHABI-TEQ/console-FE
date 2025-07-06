"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Building,
  Calendar,
  CheckCircle,
  DollarSign,
  Flag,
  Home,
  Mail,
  MapPin,
  Phone,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

interface LandlordQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  landlord: any;
}

export function LandlordQuickViewModal({
  isOpen,
  onClose,
  landlord,
}: LandlordQuickViewModalProps) {
  if (!landlord) return null;

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
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={landlord.profile_picture || "/placeholder.svg"}
              />
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-sm font-medium">
                {landlord.firstName?.[0] || "L"}
                {landlord.lastName?.[0] || "L"}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-xl">
                {landlord.fullName ||
                  `${landlord.firstName || ""} ${landlord.lastName || ""}`.trim() ||
                  "Unknown Landlord"}
              </span>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge(landlord.accountStatus)}
                {landlord.isFlagged && (
                  <Badge className="bg-red-100 text-red-800">
                    <Flag className="h-3 w-3 mr-1" />
                    Flagged
                  </Badge>
                )}
                {landlord.isAccountVerified && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Quick overview of landlord information and statistics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Contact Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{landlord.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{landlord.phoneNumber || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  Joined{" "}
                  {new Date(
                    landlord.createdAt || new Date(),
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Key Statistics */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Key Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Properties</p>
                  <p className="text-lg font-bold text-gray-900">
                    {landlord.stats?.totalProperties || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-lg font-bold text-gray-900">
                    {landlord.stats?.totalTransactions || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Completed Inspections</p>
                  <p className="text-lg font-bold text-gray-900">
                    {landlord.stats?.completedInspections || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending Negotiations</p>
                  <p className="text-lg font-bold text-gray-900">
                    {landlord.stats?.pendingNegotiations || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Account Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">User Type</p>
                <p className="font-medium">
                  {landlord.userType || "Landowner"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Account Approved</p>
                <p className="font-medium">
                  {landlord.accountApproved ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Account Status</p>
                <p className="font-medium capitalize">
                  {landlord.accountStatus}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Earned</p>
                <p className="font-medium">
                  {formatCurrency(landlord.stats?.totalEarned || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
