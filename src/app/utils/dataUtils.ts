import { RawTransaction, Transaction } from "../types";

function median(values: number[]): number {
  values = [...values].sort((a, b) => a - b);

  const half = Math.floor(values.length / 2);

  return values.length % 2
    ? values[half]
    : (values[half - 1] + values[half]) / 2;
}

export const consolidateTransactions = (
  propertyTransactions: RawTransaction[]
) => {
  const consolidatedData: Transaction[] = [];
  const map = new Map();
  propertyTransactions.forEach((transaction) => {
    const key = transaction.saleDate;
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [transaction.psf]);
    } else {
      collection.push(transaction.psf);
    }
  });
  for (const [key, values] of map.entries()) {
    const date = new Date(key * 1000);
    consolidatedData.push({
      saleDate: `${date.getMonth()}-${date.getFullYear()}`,
      psf: median(values),
    });
  }
  return consolidatedData;
};
