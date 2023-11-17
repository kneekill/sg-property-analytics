"use server";

import { unstable_cache } from "next/cache";
import { WhereOptions, Op, InferAttributes } from "sequelize";
import { FilterOptions, FilterOptionsSchema } from "../types";
import { consolidateTransactions } from "../utils/dataUtils";
import { getDbModel, findAllOptions, PropertyTransaction } from "./database";
import { isRangeAttribute } from "./range_options";
type PropertyTransactionAttributes = InferAttributes<PropertyTransaction>;

const verifyFilters = (filters: object): Partial<FilterOptions> => {
  return FilterOptionsSchema.partial().parse(filters);
};

export const getTransactions = unstable_cache(
  async (filters: object) => {
    "use server";
    const parsedFilters = verifyFilters(filters);
    const model = getDbModel();
    const whereClause: WhereOptions<PropertyTransactionAttributes> = {};
    for (const filter of Object.keys(parsedFilters) as Array<
      keyof FilterOptions
    >) {
      whereClause[filter as keyof typeof whereClause] = isRangeAttribute(filter)
        ? {
            [Op.between]: parsedFilters[filter],
          }
        : {
            [Op.in]: parsedFilters[filter],
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
