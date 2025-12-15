"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SaleTypeToggleProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function SaleTypeToggle({
  options,
  selected,
  onChange,
}: SaleTypeToggleProps) {
  return (
    <ToggleGroup
      type="multiple"
      value={selected}
      onValueChange={onChange}
      className="flex flex-wrap gap-2"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option}
          value={option}
          className="px-4 py-2 rounded-md border border-border data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary hover:bg-secondary"
        >
          {option}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

