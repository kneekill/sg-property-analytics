import { FilterOptions } from "@/app/chart";
import {
  PropertyTransaction,
  findAllOptions,
  getDbModel,
} from "../../data/database";
import { isRangeAttribute } from "../../data/range_options";
import { NextRequest, NextResponse } from "next/server";
import { InferAttributes, Op, WhereOptions } from "sequelize";

type PropertyTransactionAttributes = InferAttributes<PropertyTransaction>;
export const dynamic = "force-dynamic";

const getFilters = (searchParams: URLSearchParams) => {
  const filters: Partial<FilterOptions> = {};
  for (const attribute in PropertyTransaction.getAttributes()) {
    const values = searchParams.getAll(attribute);
    if (values.length > 0) {
      //@ts-ignore
      filters[attribute] = isRangeAttribute(attribute)
        ? [Number(values[0]), Number(values[1])]
        : values;
    }
  }
  return filters;
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const model = getDbModel();
    const whereClause: WhereOptions<PropertyTransactionAttributes> = {};
    if (searchParams) {
      const filters = getFilters(searchParams);
      for (const filter of Object.keys(filters) as Array<keyof FilterOptions>) {
        whereClause[filter as keyof typeof whereClause] = isRangeAttribute(
          filter
        )
          ? {
              [Op.between]: filters[filter],
            }
          : {
              [Op.in]: filters[filter],
            };
      }
    }
    const result = await model.findAll({
      where: whereClause,
      ...findAllOptions,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "max-age=3600",
        "Vercel-CDN-Cache-Control": "max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching property data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
