export const formatPrice = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

export const formatSqft = (value: number): string => `${value.toLocaleString()} sqft`;

export const formatPsf = (value: number): string => `$${value.toLocaleString()}`;

