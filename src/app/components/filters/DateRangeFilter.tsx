"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangeFilterProps {
  selectedRange: [number | null, number | null];
  onChange: (range: [number | null, number | null]) => void;
}

const presets = [
  { label: "Last 3 months", months: 3 },
  { label: "Last 6 months", months: 6 },
  { label: "Last 12 months", months: 12 },
  { label: "Last 2 years", months: 24 },
  { label: "Last 5 years", months: 60 },
  { label: "All time", months: null },
];

export function DateRangeFilter({
  selectedRange,
  onChange,
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);

  const handlePresetClick = (months: number | null) => {
    if (months === null) {
      onChange([null, null]);
    } else {
      const now = new Date();
      const startDate = new Date();
      startDate.setMonth(now.getMonth() - months);
      onChange([startDate.getTime(), now.getTime()]);
    }
    setOpen(false);
  };

  const formatDate = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  };

  const getDisplayLabel = (): string => {
    const [start, end] = selectedRange;
    if (start === null || end === null) return "Date Range";
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const isActive = selectedRange[0] !== null || selectedRange[1] !== null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          className={`gap-2 ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "bg-secondary/50 border-border hover:bg-secondary"
          }`}
        >
          <Calendar className="h-4 w-4" />
          {getDisplayLabel()}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2" align="start">
        <div className="space-y-1">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => handlePresetClick(preset.months)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
