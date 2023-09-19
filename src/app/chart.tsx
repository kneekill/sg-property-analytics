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
  data: Transaction[];
}

const PropertyChart: NextPage<ChartProps> = ({ data }) => {
  return (
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
  );
};

export default PropertyChart;
