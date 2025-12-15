import { PropertyTransaction, getDbModel } from "./data/database";
import { Op } from "sequelize";
import { FilterOptions } from "./types";
import { FilterContainer } from "./components/filters/FilterContainer";
import { unstable_cache } from "next/cache";
import { getTransactions } from "./data/actions";
import { isRangeAttribute } from "./data/range_options";

const getRangeFilterOption = async (model: ReturnType<typeof getDbModel>, column: string) => {
  const result = await model.findOne({
    attributes: [
      [model.sequelize!.fn('MIN', model.sequelize!.col(column)), 'min'],
      [model.sequelize!.fn('MAX', model.sequelize!.col(column)), 'max'],
    ],
    raw: true,
  }) as { min: number, max: number } | null;

  return result ? [result.min, result.max] : null;
};

const getDiscreteFilterOption = async (model: ReturnType<typeof getDbModel>, column: string) => {
  const results = await model.findAll({
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
  });

  return results.map(
    (transaction) => transaction[column as keyof PropertyTransaction]
  );
};

const getFilterOptions = unstable_cache(
  async () => {
    const model = getDbModel();
    const filterOptions: Record<string, any> = {};
    
    for (const column of Object.keys(model.getAttributes())) {
      if (column === "id") continue;
      
      const option = isRangeAttribute(column)
        ? await getRangeFilterOption(model, column)
        : await getDiscreteFilterOption(model, column);
      
      if (option) {
        filterOptions[column] = option;
      }
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
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-bold text-2xl mb-6">
          Singapore Property Analytics
        </h1>
        <FilterContainer
          filterOptions={filterOptions}
          initialTransactions={initialTransactions}
        />
      </div>
    </div>
  );
}
