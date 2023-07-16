# SG Property Analytics

Small project to explore React Server Components while also providing a better way of charting Singapore property data than [URA's website](https://www.ura.gov.sg/property-market-information/pmiResidentialTransactionSearch).

The app is hosted here: https://sg-property-analytics.vercel.app/ with supabase for postgres since vercel's serverless functions does not support SQLite.

## Run

### Webapp

- `npm run dev` and it will be hosted on [http://localhost:3000](http://localhost:3000)
  - By default, the app runs with the sqlite database. Expose `POSTGRES_CONNECTION` with a postgres connection string to use postgres instead.

### Update Data

To update the data for the app, you need to run the scraper and seed the database.

- Drop the current latest month from the database
- Update the [scrape.js](./scraper/scrape.js) with the latest dates
- Run `node ./scraper/scrape.js`
  - check the generated `data.csv` file to ensure that the scrape was successful
- Run `npx tsx ./scraper/seed.ts`

## TODOs

- Handle scraping failures
- Automate data updates using github actions
- Add transaction list
- More advanced charting
