import { findAllOptions, getDbModel } from "./data/database";
import PropertyChart, { FilterOptions } from "./chart";
import { consolidateTransactions } from "./utils/dataUtils";

async function getInitialDbData() {
  const model = getDbModel();
  //@ts-ignore
  const filterOptions: FilterOptions = {};
  for (const column of Object.keys(model.getAttributes())) {
    if (column === "id") continue;
    filterOptions[column as keyof FilterOptions] = await model
      .findAll({
        attributes: [column],
        group: [column],
        raw: true,
        nest: true,
      })
      .then((propertyTransaction) =>
        //@ts-ignore
        propertyTransaction.map((transaction) => transaction[column])
      );
  }
  const initialData = await model
    .findAll({
      ...findAllOptions,
    })
    .then(consolidateTransactions);
  return { initialData, filterOptions };
}

export default async function Page() {
  const { initialData, filterOptions } = await getInitialDbData();
  return (
    <PropertyChart initialData={initialData} filterOptions={filterOptions} />
  );
}
