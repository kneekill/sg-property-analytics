import { PropertyTransaction, getDbModel } from "../../data/database";
import options from "../../data/range_options";
import { NextRequest, NextResponse } from "next/server";
import { InferAttributes, Op, WhereOptions } from "sequelize";

type PropertyTransactionAttributes = InferAttributes<PropertyTransaction>;
type PropertyTransactionKeys = keyof PropertyTransactionAttributes;

type TransactionRequestBody = {
  filters: { [key in PropertyTransactionKeys]: string[] };
  dateRange: string[];
};

interface ExtendedNextApiRequest extends NextRequest {
  json: () => Promise<TransactionRequestBody>;
}

export async function POST(req: ExtendedNextApiRequest): Promise<NextResponse> {
  try {
    const { filters } = await req.json();
    var startTime = performance.now();
    const model = getDbModel();
    var endTime = performance.now();
    console.log(`getDbModel: ${endTime - startTime}`);
    const whereClause: WhereOptions<PropertyTransactionAttributes> = {};

    if (filters) {
      for (const filter of Object.keys(
        filters
      ) as Array<PropertyTransactionKeys>) {
        whereClause[filter as keyof typeof whereClause] =
          //@ts-ignore
          options?.[filter] !== undefined
            ? {
                [Op.between]: filters[filter],
              }
            : {
                [Op.in]: filters[filter],
              };
      }
    }
    var startTime = performance.now();
    const result = await model.findAll({
      where: whereClause,
      attributes: ["saleDate", "psf"],
      benchmark: true,
      logging: console.log,
      raw: true,
      nest: true,
      order: [["saleDate", "ASC"]],
    });
    var endTime = performance.now();
    console.log(`model.findAll: ${endTime - startTime}`);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching property data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
