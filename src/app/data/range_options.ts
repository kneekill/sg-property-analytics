const rangedOptions = ["sqft", "psf", "price", "topYear", "saleDate"];
export const isRangeAttribute = (attribute: string) => {
  return rangedOptions.includes(attribute);
};
