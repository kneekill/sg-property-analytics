"use client";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Chart,
} from "chart.js";
import { Transaction } from "./types";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

interface ChartProps {
  transactions: Transaction[];
}

const SCALE_OPTIONS = {
  grid: { display: false },
  ticks: { color: "rgb(148, 139, 137)" },
};

export default function PropertyChart({ transactions }: ChartProps) {
  return (
    <Line
      data={{
        labels: transactions.map((t) => t.saleDate),
        datasets: [
          {
            label: "PSF",
            data: transactions.map((t) => t.psf),
            borderColor: "rgb(75, 192, 192)",
            fill: false,
          },
        ],
      }}
      options={{
        scales: {
          x: SCALE_OPTIONS,
          y: SCALE_OPTIONS,
        },
      }}
    />
  );
}
