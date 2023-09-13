"use client";
import { useCallback, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Chart,
} from "chart.js";
import { NextPage } from "next";
import { FilterContainer } from "./components/filters/FilterContainer";
import { consolidateTransactions } from "./utils/dataUtils";
import { FilterOptions, RawTransaction, Transaction } from "./types";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

interface ChartProps {
  initialData: Transaction[];
  filterOptions: FilterOptions;
}

const PropertyChart: NextPage<ChartProps> = ({
  initialData,
  filterOptions,
}) => {
  const [data, setData] = useState<Transaction[]>(initialData);
  const [filters, setFilters] = useState<Partial<FilterOptions>>();

  const fetchData = useCallback(async () => {
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
    try {
      const response = await fetch("/api/transactions?" + urlParams.toString());

      if (!response.ok) {
        throw new Error("Failed to fetch property data");
      }

      const newData: RawTransaction[] = await response.json();
      setData(consolidateTransactions(newData));
    } catch (error) {
      console.error("Error fetching property data:", error);
    }
  }, [filters]);
  useEffect(() => {
    if (filters) {
      fetchData();
    }
  }, [filters, fetchData]);

  return (
    <div className="bg-gray-900 text-white flex flex-col items-center">
      <h1 className="font-bold text-center text-2xl mb-4">
        Singapore Property Chart
      </h1>
      <div className="w-full lg:w-3/6 ">
        {data !== undefined ? (
          <Line
            data={{
              labels: data.map((item) => item.saleDate),
              datasets: [
                {
                  label: "PSF",
                  data: data.map((item) => item.psf),
                  borderColor: "rgb(75, 192, 192)",
                  fill: false,
                },
              ],
            }}
            options={{
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: "rgb(148, 139, 137)",
                  },
                },
                y: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: "rgb(148, 139, 137)",
                  },
                },
              },
            }}
          />
        ) : null}
        <FilterContainer
          filterOptions={filterOptions}
          setFilters={setFilters}
        />
      </div>
    </div>
  );
};

export default PropertyChart;
