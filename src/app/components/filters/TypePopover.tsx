"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "./Checkbox";
import { toggleArrayItem } from "@/app/utils/arrayUtils";

interface TypePopoverProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function TypePopover({
  label,
  options,
  selected,
  onChange,
}: TypePopoverProps) {
  const [open, setOpen] = useState(false);

  const toggleOption = (option: string) => {
    onChange(toggleArrayItem(selected, option));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={selected.length > 0 ? "default" : "outline"}
          className={`gap-1 ${
            selected.length > 0
              ? "bg-primary text-primary-foreground"
              : "bg-secondary/50 border-border hover:bg-secondary"
          }`}
        >
          {label}
          {selected.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 px-1.5 bg-primary-foreground/20 text-primary-foreground"
            >
              {selected.length}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandList className="max-h-[200px]">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => toggleOption(option)}
                  className="cursor-pointer"
                >
                  <Checkbox checked={selected.includes(option)} />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

