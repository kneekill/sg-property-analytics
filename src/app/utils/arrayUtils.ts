/**
 * Toggle an item in an array - add if not present, remove if present
 */
export const toggleArrayItem = <T>(array: T[], item: T): T[] => {
  return array.includes(item)
    ? array.filter((i) => i !== item)
    : [...array, item];
};

