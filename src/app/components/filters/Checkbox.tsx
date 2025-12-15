"use client";

import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  className?: string;
}

export function Checkbox({ checked, className = "" }: CheckboxProps) {
  return (
    <div
      className={`mr-2 h-4 w-4 rounded border flex items-center justify-center ${
        checked
          ? "bg-primary border-primary"
          : "border-muted-foreground"
      } ${className}`}
    >
      {checked && <Check className="h-3 w-3 text-primary-foreground" />}
    </div>
  );
}

