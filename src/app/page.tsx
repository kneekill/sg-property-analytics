import { PropertyTransaction, getDbModel } from "./data/database";
import { Op } from "sequelize";
import { FilterOptions } from "./types";
import { FilterContainer } from "./components/filters/FilterContainer";
import { unstable_cache } from "next/cache";
import { getTransactions } from "./data/actions";

const getFilterOptions = unstable_cache(
  async () => {
    const model = getDbModel();
    const filterOptions: Record<string, any> = {};
    for (const column of Object.keys(model.getAttributes())) {
      if (column === "id") continue;
      filterOptions[column] = await model
        .findAll({
          attributes: [column],
          group: [column],
          order: [[column, "ASC"]],
          where: {
            [column]: {
              [Op.not]: null,
            },
          },
          raw: true,
          nest: true,
        })
        .then((propertyTransaction) =>
          propertyTransaction.map(
            (transaction) => transaction[column as keyof PropertyTransaction]
          )
        );
    }
    return filterOptions as FilterOptions;
  },
  undefined,
  { revalidate: 3600 }
);

export default async function Page() {
  const initialTransactions = await getTransactions({});
  const filterOptions = await getFilterOptions();
  return (
    <div className="bg-gray-900 text-white flex flex-col items-center">
      <h1 className="font-bold text-center text-2xl mb-4">
        Singapore Property Chart
      </h1>
      <div className="w-full lg:w-3/6 ">
        <FilterContainer
          filterOptions={filterOptions}
          initialTransactions={initialTransactions}
        />
      </div>
    </div>
  );
}
