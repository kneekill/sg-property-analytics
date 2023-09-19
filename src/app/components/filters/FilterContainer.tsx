"use client";
import { FilterOptions } from "@/app/types";
import { SelectFilter } from "./SelectFilter";
import { useEffect, useState, useTransition } from "react";
import { RangeFilter } from "./RangeFilter";
import { isRangeAttribute } from "../../data/range_options";
import { usePathname, useRouter } from "next/navigation";

interface FilterContainerProps {
  filterOptions: FilterOptions;
}

export function FilterContainer({ filterOptions }: FilterContainerProps) {
  const [filters, setFilters] = useState<Partial<FilterOptions>>();
  const router = useRouter();
  const pathname = usePathname();

  const [, startTransition] = useTransition();
  useEffect(() => {
    const urlParams = new URLSearchParams();
    if (filters) {
      for (const [key, values] of Object.entries(filters)) {
        if (values) {
          values.forEach((value) => {
            urlParams.append(key, value.toString());
          });
        }
      }
    }
    startTransition(() => {
      router.replace(`${pathname}?${urlParams.toString()}`);
    });
  }, [filters, pathname, router]);
  const onChange = (name: string, value: string[] | number[]) => {
    setFilters((prevState) => {
      return {
        ...prevState,
        [name]: value.length === 0 ? undefined : value,
      };
    });
  };
  return (
    <>
      {filterOptions
        ? Object.entries(filterOptions).map(([column, values]) => {
            return (
              <div key={column} className="flex p-8 flex-col w-full sm:w-auto">
                <label className="mr-2 mb-2">{column}:</label>
                {isRangeAttribute(column) ? (
                  <RangeFilter
                    name={column as keyof FilterOptions}
                    onChange={onChange}
                  />
                ) : (
                  <SelectFilter
                    name={column}
                    values={values as string[]}
                    onChange={onChange}
                  />
                )}
              </div>
            );
          })
        : null}
    </>
  );
}
