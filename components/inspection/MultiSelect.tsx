import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select items...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue];
    onValueChange(newValue);
  };

  const handleRemove = (optionValue: string) => {
    onValueChange(value.filter((item) => item !== optionValue));
  };

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {value.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : value.length === 1 ? (
              <span>{selectedLabels[0]}</span>
            ) : (
              <span className="text-sm">{value.length} items selected</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="max-h-60 overflow-auto">
          <div className="p-2">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => handleSelect(option.value)}
              >
                <Checkbox
                  checked={value.includes(option.value)}
                  onCheckedChange={() => handleSelect(option.value)}
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {value.length > 0 && (
            <div className="border-t border-gray-200 p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onValueChange([])}
                className="w-full"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function MultiSelectBadges({
  options,
  value,
  onValueChange,
  className,
}: Omit<MultiSelectProps, "placeholder">) {
  const selectedOptions = options.filter((option) =>
    value.includes(option.value),
  );

  const handleRemove = (optionValue: string) => {
    onValueChange(value.filter((item) => item !== optionValue));
  };

  if (selectedOptions.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {selectedOptions.map((option) => (
        <Badge
          key={option.value}
          variant="secondary"
          className="flex items-center gap-1 pr-1"
        >
          <span>{option.label}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0.5 hover:bg-transparent"
            onClick={() => handleRemove(option.value)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  );
}
