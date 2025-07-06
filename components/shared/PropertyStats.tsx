"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Building, CheckCircle, Clock, Banknote } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";

interface PropertyStatsData {
  totalProperties?: number;
  totalAgentProperties?: number;
  totalLandownerProperties?: number;
  totalActiveProperties?: number;
  totalInactiveProperties?: number;
  sumOfActivePropertyPrices?: number;
  sumOfInactivePropertyPrices?: number;
  sumOfAllPropertyPrices?: number;
}

interface PropertyStatsProps {
  data: PropertyStatsData;
  isLoading?: boolean;
}

export function PropertyStats({ data, isLoading }: PropertyStatsProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(1)}K`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const stats = [
    {
      title: "Total Properties",
      value: data.totalProperties?.toString() || "0",
      icon: Building,
      color: "blue" as const,
    },
    {
      title: "Active Properties",
      value: data.totalActiveProperties?.toString() || "0",
      icon: CheckCircle,
      color: "green" as const,
    },
    {
      title: "Inactive Properties",
      value: data.totalInactiveProperties?.toString() || "0",
      icon: Clock,
      color: "orange" as const,
    },
    {
      title: "Total Portfolio Value",
      value: formatCurrency(data.sumOfAllPropertyPrices || 0),
      icon: Banknote,
      color: "purple" as const,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
