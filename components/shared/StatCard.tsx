import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "green" | "orange" | "purple" | "red";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
              {title}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">
              {value}
            </p>
            
          </div>
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-${color}-100 flex items-center justify-center flex-shrink-0 ml-2`}
          >
            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
