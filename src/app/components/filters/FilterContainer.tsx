"use client";

import { FilterOptions, Transaction } from "@/app/types";
import { useEffect, useState, useCallback } from "react";
import PropertyChart from "@/app/chart";
import { getTransactions } from "@/app/data/actions";
import { FilterBar } from "./FilterBar";

interface FilterContainerProps {
  filterOptions: FilterOptions;
  initialTransactions: Transaction[];
}

export function FilterContainer({
  filterOptions,
  initialTransactions,
}: FilterContainerProps) {
  const [filters, setFilters] = useState<Partial<FilterOptions>>({});
  const [dateRange, setDateRange] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const [transactions, setTransactions] = useState(initialTransactions);

  useEffect(() => {
    const fetchAndSetTransactions = async () => {
      const completeFilters = { ...filters };
      const fetchedTransactions = await getTransactions(completeFilters);
      setTransactions(fetchedTransactions);
    };

    fetchAndSetTransactions();
  }, [filters, filterOptions.saleDate]);

  const handleFilterChange = useCallback(
    (name: keyof FilterOptions, value: string[] | number[]) => {
      setFilters((prevState) => ({
        ...prevState,
        [name]: value.length === 0 ? undefined : value,
      }));
    },
    []
  );

  const handleDateRangeChange = useCallback(
    (range: [number | null, number | null]) => {
      const [low, high] = range;
      
      if (low === null || high === null) {
        setFilters(({ saleDate, ...rest }) => saleDate ? rest : { saleDate, ...rest });
        return;
      }

      const [minSaleDate, maxSaleDate] = filterOptions.saleDate.map((date) => date * 1000);
      const clampedLow = Math.max(minSaleDate, low);
      const clampedHigh = Math.min(maxSaleDate, high);
      
      if (clampedLow > clampedHigh) return;

      const saleDateSeconds: [number, number] = [
        Math.round(clampedLow / 1000),
        Math.round(clampedHigh / 1000),
      ];

      setFilters((prev) => ({ ...prev, saleDate: saleDateSeconds }));
    },
    [filterOptions.saleDate]
  );

  const handleClearAll = useCallback(() => {
    setFilters({});
    setDateRange([null, null]);
  }, []);

  return (
    <div className="space-y-6">
      <FilterBar
        filterOptions={filterOptions}
        filters={filters}
        dateRange={dateRange}
        onFilterChange={handleFilterChange}
        onDateRangeChange={handleDateRangeChange}
        onClearAll={handleClearAll}
      />
      <PropertyChart transactions={transactions} />
    </div>
  );
}
