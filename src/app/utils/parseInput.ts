/**
 * Parse numeric input string with support for K (thousands) and M (millions) suffixes
 */
export const parseNumericInput = (input: string, supportSuffixes = false): number => {
  if (!supportSuffixes) {
    const cleaned = input.replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  }

  const upperInput = input.toUpperCase();
  let multiplier = 1;
  
  if (upperInput.includes('K')) {
    multiplier = 1000;
  } else if (upperInput.includes('M')) {
    multiplier = 1000000;
  }
  
  const cleaned = input.replace(/[^0-9.]/g, "");
  const baseValue = parseFloat(cleaned) || 0;
  
  return baseValue * multiplier;
};

