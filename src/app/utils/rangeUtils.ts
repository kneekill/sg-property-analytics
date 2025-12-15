/**
 * Get the current range value, falling back to the full range if not set
 */
export const getCurrentRange = (
  filterValue: number[] | undefined,
  fullRange: number[]
): [number, number] => {
  if (filterValue && filterValue.length >= 2) {
    return [filterValue[0], filterValue[1]];
  }
  return [fullRange[0], fullRange[fullRange.length - 1]];
};

/**
 * Get range bounds from filter options with fallback defaults
 */
export const getRangeBounds = (
  rangeOption: number[] | undefined,
  defaultMin: number,
  defaultMax: number
): number[] => {
  return rangeOption || [defaultMin, defaultMax];
};

