import { Transaction } from "../chart";

export interface RawTransaction {
  saleDate: number;
  psf: number;
}

export const consolidateTransactions = (
  propertyTransactions: RawTransaction[]
) => {
  let currentDate: number | undefined;
  let currentSum = 0;
  let numberOfInstances = 0;
  const consolidatedData: Transaction[] = [];

  propertyTransactions.forEach((value, index) => {
    if (currentDate === undefined) {
      currentDate = value.saleDate;
    }
    if (
      value.saleDate !== currentDate ||
      index === propertyTransactions.length - 1
    ) {
      const date = new Date(currentDate * 1000);
      consolidatedData.push({
        saleDate: `${date.getMonth()}-${date.getFullYear()}`,
        psf: currentSum / numberOfInstances,
      });
      currentDate = value.saleDate;
      currentSum = 0;
      numberOfInstances = 0;
    }
    currentSum += value.psf;
    numberOfInstances++;
  });
  return consolidatedData;
};
