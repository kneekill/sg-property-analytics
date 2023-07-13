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
