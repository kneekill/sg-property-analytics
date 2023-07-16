import { FilterOptions } from "../chart";

export const rangeFilterOptions = {
  sqft: [500, 750, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000],
  psf: [
    100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400,
    1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600,
    2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800,
    3900, 4000,
  ],
  price: [
    200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000,
    1250000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000, 6000000,
    7000000, 8000000, 10000000, 15000000, 20000000, 30000000, 50000000,
  ],
  topYear: [
    1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988,
    1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000,
    2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012,
    2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
  ],
} as Partial<FilterOptions>;
export const isRangeAttribute = (attribute: string) => {
  return Object.keys(rangeFilterOptions).includes(attribute);
};
