"use client";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Chart,
} from "chart.js";
import { NextPage } from "next";
import { Transaction } from "./types";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

interface ChartProps {
  transactions: Transaction[];
}

const SCALE_OPTS =  {
  grid: {
    display: false,
  },
  ticks: {
    color: "rgb(148, 139, 137)",
  },
}

const PropertyChart: NextPage<ChartProps> = ({ transactions }) => {
  return (
    <Line
      data={{
        labels: transactions.map((item) => item.saleDate),
        datasets: [
          {
            label: "PSF",
            data: transactions.map((item) => item.psf),
            borderColor: "rgb(75, 192, 192)",
            fill: false,
          },
        ],
      }}
      options={{
        scales: {
          x: SCALE_OPTS,
          y: SCALE_OPTS,
        },
      }}
    />
  );
};

export default PropertyChart;
