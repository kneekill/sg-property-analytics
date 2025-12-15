import { RawTransaction, Transaction } from "../types";

const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[half]
    : (sorted[half - 1] + sorted[half]) / 2;
};

const formatSaleDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return `${date.getMonth()}-${date.getFullYear()}`;
};

export const consolidateTransactions = (
  propertyTransactions: RawTransaction[]
): Transaction[] => {
  const dataMap = new Map<number, number[]>();
  
  // Group PSF values by sale date
  propertyTransactions.forEach(({ saleDate, psf }) => {
    const collection = dataMap.get(saleDate);
    if (collection) {
      collection.push(psf);
    } else {
      dataMap.set(saleDate, [psf]);
    }
  });
  
  // Calculate median for each date
  return Array.from(dataMap.entries()).map(([saleDate, psfValues]) => ({
    saleDate: formatSaleDate(saleDate),
    psf: median(psfValues),
  }));
};
