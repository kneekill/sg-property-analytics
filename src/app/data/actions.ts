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

const buildWhereClause = (filters: Partial<FilterOptions>): WhereOptions<PropertyTransactionAttributes> => {
  const whereClause: WhereOptions<PropertyTransactionAttributes> = {};
  
  for (const filter of Object.keys(filters) as Array<keyof FilterOptions>) {
    const value = filters[filter];
    if (!value) continue;
    
    whereClause[filter as keyof typeof whereClause] = isRangeAttribute(filter)
      ? { [Op.between]: value }
      : { [Op.in]: value };
  }
  
  return whereClause;
};

export const getTransactions = unstable_cache(
  async (filters: object) => {
    "use server";
    const parsedFilters = verifyFilters(filters);
    const model = getDbModel();
    const whereClause = buildWhereClause(parsedFilters);

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
