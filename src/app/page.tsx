import { getDbModel } from "./data/database";
import PropertyChart, { FilterOptions } from "./chart";
import { consolidateTransactions } from "./utils/dataUtils";

async function getInitialDbData() {
  const model = getDbModel();
  const filterOptions: FilterOptions = {};
  for (const column of Object.keys(model.getAttributes())) {
    if (column === "id") continue;
    filterOptions[column as keyof FilterOptions] = await model
      .findAll({
        attributes: [column],
        group: [column],
      })
      .then((propertyTransaction) =>
        //@ts-ignore
        propertyTransaction.map((transaction) => transaction[column])
      );
  }
  const initialData = await model
    .findAll({
      attributes: ["saleDate", "psf"],
      order: [["saleDate", "ASC"]],
    })
    .then(consolidateTransactions);
  return { initialData, filterOptions };
}

export default async function Page() {
  console.log("yo2");
  const { initialData, filterOptions } = await getInitialDbData();
  return (
    <PropertyChart initialData={initialData} filterOptions={filterOptions} />
  );
}
