import { ThemeConfig } from "react-select";

export const themeConfig: ThemeConfig = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: "rgb(75, 192, 192)",
    primary25: "rgba(75, 192, 192, 0.25)",
    neutral0: "rgb(36, 36, 36)",
    neutral80: "white",
  },
});

interface Preset {
  label: string;
  value: number | null;
}

/**
 * Creates max presets by adding "No Max" option to the beginning
 */
const createMaxPresets = (minPresets: Preset[]): Preset[] => [
  { label: "No Max", value: null },
  ...minPresets.slice(1),
];

// Price presets (in dollars)
export const PRICE_PRESETS = [
  { label: "No Min", value: null },
  { label: "$200,000", value: 200000 },
  { label: "$300,000", value: 300000 },
  { label: "$400,000", value: 400000 },
  { label: "$500,000", value: 500000 },
  { label: "$600,000", value: 600000 },
  { label: "$700,000", value: 700000 },
  { label: "$800,000", value: 800000 },
  { label: "$900,000", value: 900000 },
  { label: "$1,000,000", value: 1000000 },
  { label: "$1,250,000", value: 1250000 },
  { label: "$1,500,000", value: 1500000 },
  { label: "$2,000,000", value: 2000000 },
  { label: "$2,500,000", value: 2500000 },
  { label: "$3,000,000", value: 3000000 },
  { label: "$4,000,000", value: 4000000 },
  { label: "$5,000,000", value: 5000000 },
  { label: "$6,000,000", value: 6000000 },
  { label: "$8,000,000", value: 8000000 },
  { label: "$10,000,000", value: 10000000 },
  { label: "$15,000,000", value: 15000000 },
  { label: "$20,000,000", value: 20000000 },
  { label: "$30,000,000", value: 30000000 },
  { label: "$50,000,000", value: 50000000 },
];

export const PRICE_PRESETS_MAX = createMaxPresets(PRICE_PRESETS);

// Sqft presets
export const SQFT_PRESETS = [
  { label: "No Min", value: null },
  { label: "500 sqft", value: 500 },
  { label: "750 sqft", value: 750 },
  { label: "1,000 sqft", value: 1000 },
  { label: "1,200 sqft", value: 1200 },
  { label: "1,500 sqft", value: 1500 },
  { label: "2,000 sqft", value: 2000 },
  { label: "2,500 sqft", value: 2500 },
  { label: "3,000 sqft", value: 3000 },
  { label: "4,000 sqft", value: 4000 },
  { label: "5,000 sqft", value: 5000 },
  { label: "7,500 sqft", value: 7500 },
  { label: "10,000 sqft", value: 10000 },
];

export const SQFT_PRESETS_MAX = createMaxPresets(SQFT_PRESETS);

// PSF (Price per Sqft) presets
export const PSF_PRESETS = [
  { label: "No Min", value: null },
  { label: "$500", value: 500 },
  { label: "$750", value: 750 },
  { label: "$1,000", value: 1000 },
  { label: "$1,200", value: 1200 },
  { label: "$1,500", value: 1500 },
  { label: "$2,000", value: 2000 },
  { label: "$2,500", value: 2500 },
  { label: "$3,000", value: 3000 },
  { label: "$4,000", value: 4000 },
  { label: "$5,000", value: 5000 },
  { label: "$7,500", value: 7500 },
  { label: "$10,000", value: 10000 },
];

export const PSF_PRESETS_MAX = createMaxPresets(PSF_PRESETS);
