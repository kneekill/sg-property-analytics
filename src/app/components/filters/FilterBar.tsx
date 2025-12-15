"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchFilter } from "./SearchFilter";
import { DateRangeFilter } from "./DateRangeFilter";
import { RangePopover } from "./RangePopover";
import { TypePopover } from "./TypePopover";
import { FiltersSheet } from "./FiltersSheet";
import { FilterOptions } from "@/app/types";
import {
  PRICE_PRESETS,
  PRICE_PRESETS_MAX,
  SQFT_PRESETS,
  SQFT_PRESETS_MAX,
} from "./FilterConstants";
import { formatPrice, formatSqft } from "@/app/utils/formatters";
import { getCurrentRange, getRangeBounds } from "@/app/utils/rangeUtils";

interface FilterBarProps {
  filterOptions: FilterOptions;
  filters: Partial<FilterOptions>;
  dateRange: [number | null, number | null];
  onFilterChange: (key: keyof FilterOptions, value: string[] | number[]) => void;
  onDateRangeChange: (range: [number | null, number | null]) => void;
  onClearAll: () => void;
}

export function FilterBar({
  filterOptions,
  filters,
  dateRange,
  onFilterChange,
  onDateRangeChange,
  onClearAll,
}: FilterBarProps) {
  const priceRange = getRangeBounds(filterOptions.price, 0, 50000000);
  const sqftRange = getRangeBounds(filterOptions.sqft, 0, 10000);

  const currentPriceRange = getCurrentRange(filters.price as number[] | undefined, priceRange);
  const currentSqftRange = getCurrentRange(filters.sqft as number[] | undefined, sqftRange);

  // Count active filters for "More Filters" badge
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (!value) return false;
    // Don't count filters that are shown in the bar
    if (["price", "sqft", "propertyType", "projectName", "streetName"].includes(key)) {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return true;
  }).length;

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && (Array.isArray(value) ? value.length > 0 : true)
  );

  return (
    <div className="space-y-3">
      {/* First row: Search and Date */}
      <div className="flex flex-wrap items-center gap-2">
        <SearchFilter
          projectNames={filterOptions.projectName || []}
          streetNames={filterOptions.streetName || []}
          selectedProjects={(filters.projectName as string[]) || []}
          selectedStreets={(filters.streetName as string[]) || []}
          onProjectChange={(projects) => onFilterChange("projectName", projects)}
          onStreetChange={(streets) => onFilterChange("streetName", streets)}
        />
        <DateRangeFilter
          selectedRange={dateRange}
          onChange={onDateRangeChange}
        />
      </div>

      {/* Second row: Quick filters and More Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <RangePopover
            label="Price"
            min={priceRange[0]}
            max={priceRange[priceRange.length - 1]}
            value={currentPriceRange}
            onChange={(value) => onFilterChange("price", value)}
            formatValue={formatPrice}
            formatLabel={(min, max, absMin, absMax) => {
              if (min === absMin && max === absMax) return "Price";
              return `${formatPrice(min)} - ${formatPrice(max)}`;
            }}
            minPresets={PRICE_PRESETS}
            maxPresets={PRICE_PRESETS_MAX}
          />

          <RangePopover
            label="Sqft"
            min={sqftRange[0]}
            max={sqftRange[sqftRange.length - 1]}
            value={currentSqftRange}
            onChange={(value) => onFilterChange("sqft", value)}
            formatValue={formatSqft}
            formatLabel={(min, max, absMin, absMax) => {
              if (min === absMin && max === absMax) return "Sqft";
              return `${formatSqft(min)} - ${formatSqft(max)}`;
            }}
            minPresets={SQFT_PRESETS}
            maxPresets={SQFT_PRESETS_MAX}
          />

          <TypePopover
            label="Type"
            options={filterOptions.propertyType || []}
            selected={(filters.propertyType as string[]) || []}
            onChange={(selected) => onFilterChange("propertyType", selected)}
          />

          <FiltersSheet
            filterOptions={filterOptions}
            filters={filters}
            onFilterChange={onFilterChange}
          >
            <Button
              variant="outline"
              className="gap-2 bg-secondary/50 border-border hover:bg-secondary"
            >
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
              {activeFilterCount > 0 && (
                <Badge
                  variant="default"
                  className="ml-1 h-5 px-1.5"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </FiltersSheet>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="ml-auto text-muted-foreground hover:text-foreground whitespace-nowrap"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
