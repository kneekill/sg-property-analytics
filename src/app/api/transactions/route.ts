import { PropertyTransaction, getDbModel } from "../../data/database";
import options from "../../data/option_steps";
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
    const model = getDbModel();
    const whereClause: WhereOptions<PropertyTransactionAttributes> = {};

    if (filters) {
      for (const filter of Object.keys(
        filters
      ) as Array<PropertyTransactionKeys>) {
        whereClause[filter as keyof typeof whereClause] =
          options?.[filter] !== undefined
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
      attributes: ["saleDate", "psf"],
      // limit: 500,
      order: [["saleDate", "ASC"]],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching property data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// type Filter =
