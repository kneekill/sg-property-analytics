"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { parseNumericInput } from "@/app/utils/parseInput";

interface Preset {
  label: string;
  value: number | null;
}

interface RangePopoverProps {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  formatLabel?: (min: number, max: number, absMin: number, absMax: number) => string;
  minPresets: Preset[];
  maxPresets: Preset[];
}

const defaultFormat = (value: number) => value.toLocaleString();

export function RangePopover({
  label,
  min,
  max,
  value,
  onChange,
  formatValue = defaultFormat,
  formatLabel,
  minPresets,
  maxPresets,
}: RangePopoverProps) {
  const [open, setOpen] = useState(false);
  const [localMin, setLocalMin] = useState<number | null>(value[0] === min ? null : value[0]);
  const [localMax, setLocalMax] = useState<number | null>(value[1] === max ? null : value[1]);
  const [minInput, setMinInput] = useState(value[0] === min ? "" : formatValue(value[0]));
  const [maxInput, setMaxInput] = useState(value[1] === max ? "" : formatValue(value[1]));
  const [showMinDropdown, setShowMinDropdown] = useState(false);
  const [showMaxDropdown, setShowMaxDropdown] = useState(false);

  const minRef = useRef<HTMLDivElement>(null);
  const maxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalMin(value[0] === min ? null : value[0]);
    setLocalMax(value[1] === max ? null : value[1]);
    setMinInput(value[0] === min ? "" : formatValue(value[0]));
    setMaxInput(value[1] === max ? "" : formatValue(value[1]));
  }, [value, formatValue, min, max]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (minRef.current && !minRef.current.contains(event.target as Node)) {
        setShowMinDropdown(false);
      }
      if (maxRef.current && !maxRef.current.contains(event.target as Node)) {
        setShowMaxDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMinPresetSelect = (e: React.MouseEvent, preset: Preset) => {
    e.preventDefault(); // Prevent blur from firing
    setLocalMin(preset.value);
    setMinInput(preset.value !== null ? formatValue(preset.value) : "");
    setShowMinDropdown(false);
  };

  const handleMaxPresetSelect = (e: React.MouseEvent, preset: Preset) => {
    e.preventDefault(); // Prevent blur from firing
    setLocalMax(preset.value);
    setMaxInput(preset.value !== null ? formatValue(preset.value) : "");
    setShowMaxDropdown(false);
  };

  const handleApply = () => {
    const finalMin = localMin ?? min;
    const finalMax = localMax ?? max;
    onChange([finalMin, finalMax]);
    setOpen(false);
  };


  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinInput(e.target.value);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxInput(e.target.value);
  };

  const handleMinInputBlur = () => {
    if (minInput.trim() === "") {
      setLocalMin(null);
      return;
    }
    if (localMin !== null && minInput === formatValue(localMin)) {
      return;
    }
    const parsed = parseNumericInput(minInput, true);
    setLocalMin(parsed);
    setMinInput(formatValue(parsed));
  };

  const handleMaxInputBlur = () => {
    if (maxInput.trim() === "") {
      setLocalMax(null);
      return;
    }
    if (localMax !== null && maxInput === formatValue(localMax)) {
      return;
    }
    const parsed = parseNumericInput(maxInput, true);
    setLocalMax(parsed);
    setMaxInput(formatValue(parsed));
  };

  const isActive = value[0] !== min || value[1] !== max;

  const displayLabel = useMemo(() => {
    if (formatLabel) {
      return formatLabel(value[0], value[1], min, max);
    }
    if (isActive) {
      return `${formatValue(value[0])} - ${formatValue(value[1])}`;
    }
    return label;
  }, [value, min, max, formatLabel, formatValue, isActive, label]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          className={`gap-1 ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "bg-secondary/50 border-border hover:bg-secondary"
          }`}
        >
          {displayLabel}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-4" align="start">
        <div className="flex items-start gap-2 mb-4">
          {/* Min Input with Dropdown */}
          <div className="relative flex-1" ref={minRef}>
            <label className="text-xs text-muted-foreground mb-1 block">Min</label>
            <div className="relative">
              <Input
                value={minInput}
                onChange={handleMinInputChange}
                onBlur={handleMinInputBlur}
                placeholder="No Min"
                className="pr-8 bg-secondary border-border text-sm"
              />
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowMinDropdown(!showMinDropdown);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            {showMinDropdown && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto bg-popover border border-border rounded-md shadow-lg">
                {minPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={(e) => handleMinPresetSelect(e, preset)}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                      localMin === preset.value && "bg-accent text-accent-foreground"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-muted-foreground shrink-0 mt-7">—</span>

          {/* Max Input with Dropdown */}
          <div className="relative flex-1" ref={maxRef}>
            <label className="text-xs text-muted-foreground mb-1 block">Max</label>
            <div className="relative">
              <Input
                value={maxInput}
                onChange={handleMaxInputChange}
                onBlur={handleMaxInputBlur}
                onFocus={() => setShowMaxDropdown(true)}
                placeholder="No Max"
                className="pr-8 bg-secondary border-border text-sm"
              />
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowMaxDropdown(!showMaxDropdown);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            {showMaxDropdown && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto bg-popover border border-border rounded-md shadow-lg">
                {maxPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={(e) => handleMaxPresetSelect(e, preset)}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                      localMax === preset.value && "bg-accent text-accent-foreground"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button onClick={handleApply} className="w-full">
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  );
}
