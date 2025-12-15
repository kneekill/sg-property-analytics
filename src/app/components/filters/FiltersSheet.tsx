"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { SaleTypeToggle } from "./SaleTypeToggle";
import { RangeSlider } from "./RangeSlider";
import { FilterOptions } from "@/app/types";
import {
  PRICE_PRESETS,
  PRICE_PRESETS_MAX,
  SQFT_PRESETS,
  SQFT_PRESETS_MAX,
  PSF_PRESETS,
  PSF_PRESETS_MAX,
} from "./FilterConstants";
import { formatPrice, formatSqft, formatPsf } from "@/app/utils/formatters";
import { getCurrentRange, getRangeBounds } from "@/app/utils/rangeUtils";
import { toggleArrayItem } from "@/app/utils/arrayUtils";

interface FiltersSheetProps {
  filterOptions: FilterOptions;
  filters: Partial<FilterOptions>;
  onFilterChange: (key: keyof FilterOptions, value: string[] | number[]) => void;
  children: React.ReactNode;
}

export function FiltersSheet({
  filterOptions,
  filters,
  onFilterChange,
  children,
}: FiltersSheetProps) {
  const priceRange = getRangeBounds(filterOptions.price, 0, 50000000);
  const sqftRange = getRangeBounds(filterOptions.sqft, 0, 10000);
  const psfRange = getRangeBounds(filterOptions.psf, 0, 5000);

  const currentPriceRange = getCurrentRange(filters.price as number[] | undefined, priceRange);
  const currentSqftRange = getCurrentRange(filters.sqft as number[] | undefined, sqftRange);
  const currentPsfRange = getCurrentRange(filters.psf as number[] | undefined, psfRange);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[320px] sm:w-[400px] bg-background border-l border-border overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Sale Type */}
          <div>
            <h4 className="font-medium text-sm mb-3">Sale Type</h4>
            <SaleTypeToggle
              options={filterOptions.saleType || []}
              selected={(filters.saleType as string[]) || []}
              onChange={(selected) => onFilterChange("saleType", selected)}
            />
          </div>

          <Separator />

          {/* Price Range */}
          <RangeSlider
            label="Price Range"
            min={priceRange[0]}
            max={priceRange[priceRange.length - 1]}
            value={currentPriceRange}
            onChange={(value) => onFilterChange("price", value)}
            formatValue={formatPrice}
            minPresets={PRICE_PRESETS}
            maxPresets={PRICE_PRESETS_MAX}
          />

          <Separator />

          {/* Sqft Range */}
          <RangeSlider
            label="Sqft Range"
            min={sqftRange[0]}
            max={sqftRange[sqftRange.length - 1]}
            value={currentSqftRange}
            onChange={(value) => onFilterChange("sqft", value)}
            formatValue={formatSqft}
            minPresets={SQFT_PRESETS}
            maxPresets={SQFT_PRESETS_MAX}
          />

          <Separator />

          {/* PSF Range */}
          <RangeSlider
            label="Price Per Sqft"
            min={psfRange[0]}
            max={psfRange[psfRange.length - 1]}
            value={currentPsfRange}
            onChange={(value) => onFilterChange("psf", value)}
            formatValue={formatPsf}
            minPresets={PSF_PRESETS}
            maxPresets={PSF_PRESETS_MAX}
          />

          <Separator />

          {/* Property Type */}
          <div>
            <h4 className="font-medium text-sm mb-3">Property Type</h4>
            <div className="flex flex-wrap gap-2">
              {(filterOptions.propertyType || []).map((type) => (
                <Button
                  key={type}
                  variant={
                    (filters.propertyType as string[])?.includes(type)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    const current = (filters.propertyType as string[]) || [];
                    onFilterChange("propertyType", toggleArrayItem(current, type));
                  }}
                  className={
                    (filters.propertyType as string[])?.includes(type)
                      ? ""
                      : "bg-secondary/50 border-border hover:bg-secondary"
                  }
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Area Type */}
          <div>
            <h4 className="font-medium text-sm mb-3">Area Type</h4>
            <SaleTypeToggle
              options={filterOptions.areaType || []}
              selected={(filters.areaType as string[]) || []}
              onChange={(selected) => onFilterChange("areaType", selected)}
            />
          </div>

          <Separator />

          {/* Lease Type */}
          <div>
            <h4 className="font-medium text-sm mb-3">Lease Type</h4>
            <SaleTypeToggle
              options={filterOptions.leaseType || []}
              selected={(filters.leaseType as string[]) || []}
              onChange={(selected) => onFilterChange("leaseType", selected)}
            />
          </div>

          <Separator />

          {/* District */}
          <div>
            <h4 className="font-medium text-sm mb-3">District</h4>
            <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto">
              {(filterOptions.district || []).map((district) => (
                <Button
                  key={district}
                  variant={
                    (filters.district as number[])?.includes(district)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    const current = (filters.district as number[]) || [];
                    onFilterChange("district", toggleArrayItem(current, district));
                  }}
                  className={
                    (filters.district as number[])?.includes(district)
                      ? ""
                      : "bg-secondary/50 border-border hover:bg-secondary"
                  }
                >
                  D{district}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Market Segment */}
          <div>
            <h4 className="font-medium text-sm mb-3">Market Segment</h4>
            <SaleTypeToggle
              options={filterOptions.marketSegment || []}
              selected={(filters.marketSegment as string[]) || []}
              onChange={(selected) => onFilterChange("marketSegment", selected)}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
