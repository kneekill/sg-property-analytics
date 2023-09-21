import {
  PropertyTransaction,
  findAllOptions,
  getDbModel,
} from "./data/database";
import PropertyChart from "./chart";
import { consolidateTransactions } from "./utils/dataUtils";
import { InferAttributes, Op, WhereOptions } from "sequelize";
import { FilterOptions } from "./types";
import { FilterContainer } from "./components/filters/FilterContainer";
import { isRangeAttribute } from "./data/range_options";
import { unstable_cache } from "next/cache";

type PropertyTransactionAttributes = InferAttributes<PropertyTransaction>;
type SearchParams = Record<string, string | string[]>;

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

const getFilters = (searchParams: SearchParams) => {
  const filters: Record<string, any> = {};
  const searchKeys = Object.keys(searchParams);
  for (const attribute in PropertyTransaction.getAttributes()) {
    if (searchKeys.includes(attribute)) {
      let values = searchParams[attribute];
      if (!Array.isArray(values)) {
        values = [values];
      }
      filters[attribute] = isRangeAttribute(attribute)
        ? [Number(values[0]), Number(values[1])]
        : values;
    }
  }
  return filters as Partial<FilterOptions>;
};

const getTransactions = unstable_cache(
  async (searchParams: SearchParams) => {
    const model = getDbModel();
    const whereClause: WhereOptions<PropertyTransactionAttributes> = {};
    const filters = getFilters(searchParams);
    for (const filter of Object.keys(filters) as Array<keyof FilterOptions>) {
      whereClause[filter as keyof typeof whereClause] = isRangeAttribute(filter)
        ? {
            [Op.between]: filters[filter],
          }
        : {
            [Op.in]: filters[filter],
          };
    }

    const result = await model
      .findAll({
        where: whereClause,
        ...findAllOptions,
      })
      .then(consolidateTransactions);
    return result;
  },
  undefined,
  { revalidate: 3600 }
);

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const transactions = await getTransactions(searchParams);
  const filterOptions = await getFilterOptions();
  return (
    <div className="bg-gray-900 text-white flex flex-col items-center">
      <h1 className="font-bold text-center text-2xl mb-4">
        Singapore Property Chart
      </h1>
      <div className="w-full lg:w-3/6 ">
        <PropertyChart transactions={transactions} />
        <FilterContainer filterOptions={filterOptions} />
      </div>
    </div>
  );
}
