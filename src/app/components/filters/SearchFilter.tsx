"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "./Checkbox";
import { toggleArrayItem } from "@/app/utils/arrayUtils";

interface SearchFilterProps {
  projectNames: string[];
  streetNames: string[];
  selectedProjects: string[];
  selectedStreets: string[];
  onProjectChange: (projects: string[]) => void;
  onStreetChange: (streets: string[]) => void;
}

const searchResults = (
  items: string[],
  selected: string[],
  search: string
): string[] => {
  const normalizedSearch = search.trim().toLowerCase();
  const selectedSet = new Set(selected);
  const results: string[] = [];

  for (const item of items) {
    if (selectedSet.has(item)) continue;
    if (normalizedSearch && !item.toLowerCase().includes(normalizedSearch)) {
      continue;
    }
    results.push(item);
    if (results.length >= 50) break;
  }

  return results;
};

export function SearchFilter({
  projectNames,
  streetNames,
  selectedProjects,
  selectedStreets,
  onProjectChange,
  onStreetChange,
}: SearchFilterProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(
    () => searchResults(projectNames, selectedProjects, search),
    [projectNames, selectedProjects, search]
  );

  const filteredStreets = useMemo(
    () => searchResults(streetNames, selectedStreets, search),
    [streetNames, selectedStreets, search]
  );

  const totalSelected = selectedProjects.length + selectedStreets.length;
  const selectedOptions = [
    ...selectedProjects.map((project) => ({
      label: project,
      type: "project" as const,
    })),
    ...selectedStreets.map((street) => ({
      label: street,
      type: "street" as const,
    })),
  ];

  return (
    <div className="relative w-[220px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
      <input
        type="text"
        placeholder={
          totalSelected > 0
            ? `${totalSelected} selected`
            : "Search Project or Street..."
        }
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          // Check if the blur is due to clicking inside the popover
          if (!e.relatedTarget?.closest('[role="dialog"]')) {
            setTimeout(() => setOpen(false), 200);
          }
        }}
        className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-secondary/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-secondary"
      />
      {open && (
        <div className="absolute top-full left-0 mt-2 w-[320px] z-50">
          <div
            className="rounded-md border bg-popover text-popover-foreground shadow-md outline-none"
            onMouseDown={(e) => {
              // Prevent input from losing focus when clicking inside dropdown
              e.preventDefault();
            }}
          >
            <Command shouldFilter={false}>
              <CommandList className="max-h-[300px]">
                <CommandEmpty>No results found.</CommandEmpty>
                {selectedOptions.length > 0 && (
                  <CommandGroup heading="Selected">
                    {selectedOptions.map(({ label, type }) => (
                      <CommandItem
                        key={`${type}-${label}`}
                        value={label}
                        onSelect={() => {
                          const [selected, onChange] = type === "project"
                            ? [selectedProjects, onProjectChange]
                            : [selectedStreets, onStreetChange];
                          onChange(toggleArrayItem(selected, label));
                        }}
                        className="cursor-pointer"
                      >
                        <Checkbox checked={true} />
                        <span className="capitalize">{type}:</span> {label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {filteredProjects.length > 0 && (
                  <CommandGroup heading="Projects">
                    {filteredProjects.map((project) => (
                      <CommandItem
                        key={project}
                        value={project}
                        onSelect={() => onProjectChange(toggleArrayItem(selectedProjects, project))}
                        className="cursor-pointer"
                      >
                        <Checkbox checked={selectedProjects.includes(project)} />
                        {project}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {filteredStreets.length > 0 && (
                  <CommandGroup heading="Streets">
                    {filteredStreets.map((street) => (
                      <CommandItem
                        key={street}
                        value={street}
                        onSelect={() => onStreetChange(toggleArrayItem(selectedStreets, street))}
                        className="cursor-pointer"
                      >
                        <Checkbox checked={selectedStreets.includes(street)} />
                        {street}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </div>
        </div>
      )}
    </div>
  );
}

