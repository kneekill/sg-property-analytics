"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { parseNumericInput } from "@/app/utils/parseInput";

interface Preset {
  label: string;
  value: number | null;
}

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  minPresets: Preset[];
  maxPresets: Preset[];
}

const defaultFormat = (value: number) => value.toLocaleString();

export function RangeSlider({
  label,
  min,
  max,
  value,
  onChange,
  formatValue = defaultFormat,
  minPresets,
  maxPresets,
}: RangeSliderProps) {
  const [minInput, setMinInput] = useState(value[0] === min ? "" : formatValue(value[0]));
  const [maxInput, setMaxInput] = useState(value[1] === max ? "" : formatValue(value[1]));
  const [showMinDropdown, setShowMinDropdown] = useState(false);
  const [showMaxDropdown, setShowMaxDropdown] = useState(false);

  const minRef = useRef<HTMLDivElement>(null);
  const maxRef = useRef<HTMLDivElement>(null);

  // Sync input values when prop changes
  useEffect(() => {
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
    const newMin = preset.value ?? min;
    setMinInput(preset.value !== null ? formatValue(preset.value) : "");
    setShowMinDropdown(false);
    onChange([newMin, value[1]]);
  };

  const handleMaxPresetSelect = (e: React.MouseEvent, preset: Preset) => {
    e.preventDefault(); // Prevent blur from firing
    const newMax = preset.value ?? max;
    setMaxInput(preset.value !== null ? formatValue(preset.value) : "");
    setShowMaxDropdown(false);
    onChange([value[0], newMax]);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinInput(e.target.value);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxInput(e.target.value);
  };

  const handleMinInputBlur = () => {
    if (minInput.trim() === "") {
      onChange([min, value[1]]);
      return;
    }
    const parsed = parseNumericInput(minInput, false);
    const clamped = Math.max(min, parsed);
    setMinInput(formatValue(clamped));
    onChange([clamped, value[1]]);
  };

  const handleMaxInputBlur = () => {
    if (maxInput.trim() === "") {
      onChange([value[0], max]);
      return;
    }
    const parsed = parseNumericInput(maxInput, false);
    const clamped = Math.min(max, parsed);
    setMaxInput(formatValue(clamped));
    onChange([value[0], clamped]);
  };

  const handleMinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleMinInputBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleMaxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleMaxInputBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">{label}</h4>
      <div className="flex items-center gap-2">
        {/* Min Input with Dropdown */}
        <div className="relative flex-1" ref={minRef}>
          <div className="relative">
            <Input
              value={minInput}
              onChange={handleMinInputChange}
              onBlur={handleMinInputBlur}
              onKeyDown={handleMinKeyDown}
              onFocus={() => setShowMinDropdown(true)}
              placeholder="No Min"
              className="pr-8 bg-secondary border-border text-sm"
            />
            <button
              type="button"
              onClick={() => setShowMinDropdown(!showMinDropdown)}
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
                    (preset.value === null && value[0] === min) || value[0] === preset.value
                      ? "bg-accent text-accent-foreground"
                      : ""
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-muted-foreground shrink-0">—</span>

        {/* Max Input with Dropdown */}
        <div className="relative flex-1" ref={maxRef}>
          <div className="relative">
            <Input
              value={maxInput}
              onChange={handleMaxInputChange}
              onBlur={handleMaxInputBlur}
              onKeyDown={handleMaxKeyDown}
              onFocus={() => setShowMaxDropdown(true)}
              placeholder="No Max"
              className="pr-8 bg-secondary border-border text-sm"
            />
            <button
              type="button"
              onClick={() => setShowMaxDropdown(!showMaxDropdown)}
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
                    (preset.value === null && value[1] === max) || value[1] === preset.value
                      ? "bg-accent text-accent-foreground"
                      : ""
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
