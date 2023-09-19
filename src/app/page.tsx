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
import { cache } from "react";
import { isRangeAttribute } from "./data/range_options";

const getFilterOptions = cache(async () => {
  const model = getDbModel();
  //@ts-ignore
  const filterOptions: FilterOptions = {};
  for (const column of Object.keys(model.getAttributes())) {
    if (column === "id") continue;
    filterOptions[column as keyof FilterOptions] = await model
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
        //@ts-ignore
        propertyTransaction.map((transaction) => transaction[column])
      );
  }
  return filterOptions;
});
type PropertyTransactionAttributes = InferAttributes<PropertyTransaction>;

const getFilters = (searchParams: object) => {
  const filters: Partial<FilterOptions> = {};
  for (const attribute in PropertyTransaction.getAttributes()) {
    //@ts-ignore
    let values = searchParams[attribute];
    if (values !== undefined) {
      if (!Array.isArray(values)) {
        values = [values];
      }
      //@ts-ignore
      filters[attribute] = isRangeAttribute(attribute)
        ? [Number(values[0]), Number(values[1])]
        : values;
    }
  }
  return filters;
};

async function getInitialDbData(searchParams: object) {
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
}

export default async function Page({ searchParams }: { searchParams: object }) {
  const initialData = await getInitialDbData(searchParams);
  const filterOptions = await getFilterOptions();
  return (
    <div className="bg-gray-900 text-white flex flex-col items-center">
      <h1 className="font-bold text-center text-2xl mb-4">
        Singapore Property Chart
      </h1>
      <div className="w-full lg:w-3/6 ">
        <PropertyChart data={initialData} />
        <FilterContainer filterOptions={filterOptions} />
      </div>
    </div>
  );
}
