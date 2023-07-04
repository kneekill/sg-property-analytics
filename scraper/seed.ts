import { createReadStream } from "fs";
import { parse } from "csv";
import { parse as dateParse } from "date-fns";
import { PropertyTransaction, getDbModel } from "@/app/data/database";
import { Optional, InferCreationAttributes } from "sequelize";
import { NullishPropertiesOf } from "sequelize/types/utils";

function parseIntWithComma(str: string) {
  return parseInt(str.replace(/,/g, ""));
}
const SQLITE_BULK_INSERT_LIMIT = 500;

async function main() {
  var models:
    | readonly Optional<
        InferCreationAttributes<PropertyTransaction, { omit: never }>,
        NullishPropertiesOf<
          InferCreationAttributes<PropertyTransaction, { omit: never }>
        >
      >[]
    | {
        projectName: string;
        price: number;
        sqft: number;
        psf: number;
        saleDate: number;
        streetName: string;
        saleType: string;
        areaType: string;
        propertyType: string;
        leaseType: string;
        leaseLength: number | undefined;
        topYear: number | undefined;
        district: number;
        marketSegment: string;
        lowFloorLevel: string;
        highFloorLevel: string;
      }[] = [];
  const model = getDbModel();
  const readable = createReadStream("./data.csv").pipe(parse());
  for await (const row of readable) {
    const numUnits = parseInt(row[12]);
    if (numUnits > 1) {
      continue;
    }
    const projectName = row[0];
    const price = parseIntWithComma(row[1]);
    const sqft = parseIntWithComma(row[2]);
    const psf = parseIntWithComma(row[3]);
    const saleDate = row[4];
    const parsedDate = dateParse(saleDate, "MMM-yy", new Date());
    if (parsedDate === undefined) {
      console.log(saleDate);
    }
    const streetName = row[5];
    const saleType = row[6];
    const areaType = row[7];
    const propertyType = row[11];
    var leaseType: string;
    var leaseLength: number | undefined;
    var topYear: number | undefined;
    if (row[13].includes("Freehold")) {
      leaseType = "Freehold";
      leaseLength = undefined;
      topYear = undefined;
    } else {
      leaseType = "Leasehold";
      const split = row[13].split(" ");
      leaseLength = parseInt(split[0]);
      topYear = parseInt(split[split.length - 1]);
      if (isNaN(topYear)) {
        topYear = undefined;
      }
    }
    const district = parseInt(row[14]);
    const marketSegment = row[15];
    const levelSplit = row[16].split(" ");
    const lowFloorLevel = levelSplit[0];
    const highFloorLevel = levelSplit[levelSplit.length - 1];
    //@ts-ignore
    models.push({
      projectName,
      price,
      sqft,
      psf,
      saleDate: parsedDate.getTime() / 1000,
      streetName,
      saleType,
      areaType,
      propertyType,
      leaseType,
      leaseLength,
      topYear,
      district,
      marketSegment,
      lowFloorLevel,
      highFloorLevel,
    });

    if (models.length === SQLITE_BULK_INSERT_LIMIT) {
      await model.bulkCreate(models);
      models = [];
    }
  }
  if (models.length > 0) {
    await model.bulkCreate(models);
  }
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
