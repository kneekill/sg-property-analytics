-- SQLite
-- drop table if EXISTS transactions;
create table transactions
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectName TEXT NOT NULL,
    price INTEGER NOT NULL,
    sqft INTEGER NOT NULL,
    psf INTEGER NOT NULL,
    saleDate INTEGER NOT NULL,
    streetName TEXT NOT NULL,
    saleType TEXT NOT NULL,
    areaType TEXT NOT NULL,
    propertyType TEXT NOT NULL,
    leaseType TEXT NOT NULL,
    leaseLength INTEGER,
    topYear INTEGER,
    district INTEGER NOT NULL,
    marketSegment TEXT NOT NULL,
    lowFloorLevel TEXT NOT NULL,
    highFloorLevel TEXT NOT NULL
)
