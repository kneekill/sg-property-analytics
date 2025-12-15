import { parse as dateParse } from "date-fns";
import { parse } from "csv-parse/sync";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { InferAttributes, Op } from "sequelize";
import { PropertyTransaction, getDbModel } from "@/app/data/database";

function parseIntWithComma(str: string) {
  return parseInt(str.replace(/,/g, ""));
}
function getURLSearchParams(
  postalDistrict: string,
  fromYear: string,
  fromMonth: string,
  toYear: string,
  toMonth: string,
  page: number
) {
  const result = new URLSearchParams(
    `propertyTypeGroupNo=3&saleType%5B0%5D=1&saleType%5B1%5D=2&saleType%5B2%5D=3&downloadType=downloadCSV&selectColumn=1&selectColumn=2&selectColumn=3&selectColumn=4&selectColumn=5&selectColumn=6&selectColumn=7&selectColumn=8&selectColumn=9&selectColumn=10&selectColumn=11&selectColumn=12&selectColumn=13&selectColumn=14&selectColumn=15&selectColumn=16&selectColumn=17`
  );
  result.append("locationDetails", `["postalDistrict","${postalDistrict}"]`);
  result.append("saleYearFrom", fromYear);
  result.append("saleYearTo", toYear);
  result.append("saleMonthFrom", fromMonth);
  result.append("saleMonthTo", toMonth);
  result.append("gotoPage", page.toString());
  return result;
}

const SQLITE_BULK_INSERT_LIMIT = 500;
const postalDistricts = [
  "D01 / Raffles Place, Cecil, Marina, People's Park",
  "D02 / Anson, Tanjong Pagar",
  "D03 / Queenstown, Tiong Bahru",
  "D04 / Telok Blangah, Harbourfront",
  "D05 / Pasir Panjang, Hong Leong Garden, Clementi New Town",
  "D06 / High Street, Beach Road (part)",
  "D07 / Middle Road, Golden Mile",
  "D08 / Little India",
  "D09 / Orchard, Cairnhill, River Valley",
  "D10 / Ardmore, Bukit Timah, Holland Road, Tanglin",
  "D11 / Watten Estate, Novena, Thomson",
  "D12 / Balestier, Toa Payoh, Serangoon",
  "D13 / Macpherson, Braddell",
  "D14 / Geylang, Eunos",
  "D15 / Katong, Joo Chiat, Amber Road",
  "D16 / Bedok, Upper East Coast, Eastwood, Kew Drive",
  "D17 / Loyang, Changi",
  "D18 / Tampines, Pasir Ris",
  "D19 / Serangoon Garden, Hougang, Ponggol",
  "D20 / Bishan, Ang Mo Kio",
  "D21 / Upper Bukkit Timah, Clementi Park, Ulu Pandan",
  "D22 / Jurong",
  "D23 / Hillview, Dairy Farm, Bukkit Panjang, Choa Chu Kang",
  "D24 / Lim Chu Kang, Tengah",
  "D25 / Kranji, Woodgrove",
  "D26 / Upper Thomson, Springleaf",
  "D27 / Yishun, Sembawang",
  "D28 / Seletar",
];

async function seed(startDate: number, endDate: number, data: string[]) {
  var models: Omit<InferAttributes<PropertyTransaction>, "id">[] = [];
  const model = getDbModel();

  // drop start months transactions
  await model.destroy({
    where: { saleDate: { [Op.between]: [startDate, endDate] } },
  });
  for (const datum of data) {
    console.log(datum);
    const row = parse(datum)[0];
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

async function scrape(fromDate: string, toDate: string) {
  const [fromMonth, fromYear] = fromDate.split("/");
  const [toMonth, toYear] = toDate.split("/");
  const data = [];
  for (const postalDistrict of postalDistricts) {
    let page = 1;
    while (true) {
      const params = getURLSearchParams(
        postalDistrict,
        fromYear,
        fromMonth,
        toYear,
        toMonth,
        page
      );
      const response = await fetch(
        "https://eservice.ura.gov.sg/property-market-information/pmiSearchResidentialTransactionDownload",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
          method: "POST",
        }
      );
      const csvData = await response.text();
      const lines = csvData.trim().split(/\r\n|\r|\n/);
      console.log(
        `postalDistrict: ${postalDistrict}, page: ${page}, lines: ${lines.length}`
      );
      // skip header line
      lines.shift();
      data.push(...lines);

      if (lines.length < 10000) {
        break;
      }
      page += 1;
    }
  }
  return data;
}

async function main() {
  const args = await yargs(hideBin(process.argv)).options({
    from: {
      description: "<date> from date M/yyyy",
      demandOption: true,
      type: "string",
    },
    to: {
      description: "<date> to date M/yyyy",
      demandOption: true,
      type: "string",
    },
  }).argv;
  const fromDate = args.from;
  const toDate = args.to;
  const scrapedData = await scrape(fromDate, toDate);
  const unixStartDate =
    dateParse(fromDate, "M/yyyy", new Date()).getTime() / 1000;
    const unixEndDate =
    dateParse(toDate, "M/yyyy", new Date()).getTime() / 1000;
  await seed(unixStartDate, unixEndDate, scrapedData);
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
