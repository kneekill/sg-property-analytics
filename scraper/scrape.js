const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");

const postalDistricts = [
  "D01+/+Raffles+Place,+Cecil,+Marina,+People's+Park",
  "D02+/+Anson,+Tanjong+Pagar",
  "D03+/+Queenstown,+Tiong+Bahru",
  "D04+/+Telok+Blangah,+Harbourfront",
  "D05+/+Pasir+Panjang,+Hong+Leong+Garden,+Clementi+New+Town",
  "D06+/+High+Street,+Beach+Road+(part)",
  "D07+/+Middle+Road,+Golden+Mile",
  "D08+/+Little+India",
  "D09+/+Orchard,+Cairnhill,+River+Valley",
  "D10+/+Ardmore,+Bukit+Timah,+Holland+Road,+Tanglin",
  "D11+/+Watten+Estate,+Novena,+Thomson",
  "D12+/+Balestier,+Toa+Payoh,+Serangoon",
  "D13+/+Macpherson,+Braddell",
  "D14+/+Geylang,+Eunos",
  "D15+/+Katong,+Joo+Chiat,+Amber+Road",
  "D16+/+Bedok,+Upper+East+Coast,+Eastwood,+Kew+Drive",
  "D17+/+Loyang,+Changi",
  "D18+/+Tampines,+Pasir+Ris",
  "D19+/+Serangoon+Garden,+Hougang,+Ponggol",
  "D20+/+Bishan,+Ang+Mo+Kio",
  "D21+/+Upper+Bukit+Timah,+Clementi+Park,+Ulu+Pandan",
  "D22+/+Jurong",
  "D23+/+Hillview,+Dairy+Farm,+Bukit+Panjang,+Choa+Chu+Kang",
  "D24+/+Lim+Chu+Kang,+Tengah",
  "D25+/+Kranji,+Woodgrove",
  "D26+/+Upper+Thomson,+Springleaf",
  "D27+/+Yishun,+Sembawang",
  "D28+/+Seletar",
];

async function main() {
  const writer = fs.createWriteStream("./data.csv", {
    flags: "a",
  });
  // TODO: move this to query params
  const fromDate = "5/2023";
  const toDate = "7/2023";
  const [fromMonth, fromYear] = fromDate.split("/");
  const [toMonth, toYear] = toDate.split("/");
  postalDistricts.forEach(async (postalDistrict) => {
    var page = 1;
    const locationDetails = encodeURIComponent(
      `["postalDistrict","${postalDistrict}]"`
    );
    while (true) {
      const response = await fetch(
        "https://www.ura.gov.sg/property-market-information/pmiSearchResidentialTransactionDownload",
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          referrer:
            "https://www.ura.gov.sg/property-market-information/pmiResidentialTransactionSearch",

          body: `resultPerPage=20&displayResult=true&displayResultHeader=false&loadAnalysis=false&displayAnalysis=false&displayChart=true&displayAnalysisFilters=true&dashboardDisplay=false&panelNo=&panelId=&panelName=&locationDetails=${locationDetails}&saleYearFrom=${fromYear}&saleMonthFrom=${fromMonth}&saleYearTo=${toYear}&saleMonthTo=${toMonth}&propertyTypeGroupNo=3&transactedPriceFrom=&transactedPriceTo=&pricePerUnitAreaFrom=&pricePerUnitAreaTo=&pricePerUnitAreaUOM=PSF&areaFrom=&areaTo=&areaUOM=SQM&blockHouseNumber=&levelFrom=&levelTo=&unitNumberFrom=&unitNumberTo=&saleType%5B0%5D=1&saleType%5B1%5D=2&saleType%5B2%5D=3&typeofAreaLand=&typeofAreaStrata=&enblocYes=&enblocNo=&page=0&gotoPage=${page}&tableDisplay=showAllColumn&sortBy=15&sortAsc=1&downloadType=downloadCSV&variableNo=&dataSet1No=&dataSet2No=&selectColumn=1&selectColumn=2&selectColumn=3&selectColumn=4&selectColumn=5&selectColumn=6&selectColumn=7&selectColumn=8&selectColumn=9&selectColumn=10&selectColumn=11&selectColumn=12&selectColumn=13&selectColumn=14&selectColumn=15&selectColumn=16&selectColumn=17&_selectColumn=1&_csrf=de929511-b193-49db-b33d-64be61049fde`,
          method: "POST",
          mode: "cors",
        }
      );
      const csvData = await response.text();
      const lines = csvData.trim().split(/\r\n|\r|\n/);
      console.log(
        `postalDistrict: ${postalDistrict}, page: ${page}, lines: ${lines.length}`
      );
      // skip header line
      for (var line = 1; line < lines.length; line++) {
        writer.write(lines[line] + "\n");
      }

      if (lines.length < 10000) {
        break;
      }
      page += 1;
    }
  });
}
main();
