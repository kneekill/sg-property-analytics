"use client";
import { FilterOptions, Transaction } from "@/app/types";
import { SelectFilter } from "./SelectFilter";
import { useEffect, useState } from "react";
import { RangeFilter } from "./RangeFilter";
import { isRangeAttribute } from "../../data/range_options";
import PropertyChart from "@/app/chart";
import { getTransactions } from "@/app/data/actions";

interface FilterContainerProps {
  filterOptions: FilterOptions;
  initialTransactions: Transaction[];
}

export function FilterContainer({
  filterOptions,
  initialTransactions,
}: FilterContainerProps) {
  const [filters, setFilters] = useState<Partial<FilterOptions>>();
  const [transactions, setTransactions] = useState(initialTransactions);

  useEffect(() => {
    const fetchAndSetTransactions = async () => {
      if (filters) {
        const fetchedTransactions = await getTransactions(filters);
        setTransactions(fetchedTransactions);
      }
    };

    fetchAndSetTransactions();
  }, [filters]);
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
      <PropertyChart transactions={transactions} />

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
