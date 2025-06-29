import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileX,
  Users,
  Home,
  Plus,
  Search,
  Database,
  Inbox,
  type LucideIcon,
} from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = FileX,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <Card className={`border-dashed border-2 ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        <p className="text-gray-600 mb-6 max-w-sm">{description}</p>

        <div className="flex flex-col sm:flex-row gap-3">
          {onAction && actionLabel && (
            <Button onClick={onAction} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              {actionLabel}
            </Button>
          )}

          {onSecondaryAction && secondaryActionLabel && (
            <Button
              variant="outline"
              onClick={onSecondaryAction}
              className="w-full sm:w-auto"
            >
              <Search className="h-4 w-4 mr-2" />
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Predefined empty states for common scenarios
export const AgentsEmptyState = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    icon={Users}
    title="No agents found"
    description="You haven't added any agents yet. Start by adding your first agent to manage properties."
    actionLabel="Add Agent"
    {...props}
  />
);

export const PropertiesEmptyState = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    icon={Home}
    title="No properties found"
    description="No properties match your current filters. Try adjusting your search criteria or add new properties."
    actionLabel="Add Property"
    secondaryActionLabel="Clear Filters"
    {...props}
  />
);

export const SearchEmptyState = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    icon={Search}
    title="No results found"
    description="We couldn't find anything matching your search. Try different keywords or filters."
    secondaryActionLabel="Clear Search"
    {...props}
  />
);

export const DataEmptyState = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    icon={Database}
    title="No data available"
    description="There's no data to display at the moment. Check back later or refresh the page."
    secondaryActionLabel="Refresh"
    {...props}
  />
);

export const InboxEmptyState = (props: Partial<EmptyStateProps>) => (
  <EmptyState
    icon={Inbox}
    title="All caught up!"
    description="You're all up to date. No new items to review at this time."
    {...props}
  />
);
