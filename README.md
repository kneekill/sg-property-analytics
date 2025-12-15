# SG Property Analytics

Small project to explore React Server Components while also providing a better way of charting Singapore property data than [URA's website](https://go.gov.sg/ura-pmi-resi).

The app is hosted here: https://sg-property-analytics.vercel.app/ with supabase for postgres since vercel's serverless functions does not support SQLite.

## Run

### Webapp

- `bun run dev` and it will be hosted on [http://localhost:3000](http://localhost:3000)
  - By default, the app runs with the sqlite database. Expose `POSTGRES_CONNECTION` with a postgres connection string to use postgres instead.

### Update Data

To update the data for the app, you need to run the scraper and seed the database.

- Update the [seed.ts](./scraper/seed.ts) with the latest dates
- Run `bunx ./scraper/seed.ts`

## TODOs

- Handle scraping failures
- Automate data updates using github actions
- Add transaction list
- More advanced charting
