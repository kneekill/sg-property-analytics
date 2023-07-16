import Select, { createFilter } from "react-select";
import { themeConfig } from "./FilterConstants";

interface SelectFilterProps {
  name: string;
  values: string[];
  onChange: (key: string, options: string[]) => void;
}
export function SelectFilter({ name, values, onChange }: SelectFilterProps) {
  return (
    <Select
      instanceId={name}
      isMulti
      name={name}
      options={values.map((option) => ({
        value: option,
        label: option,
      }))}
      filterOption={createFilter({ ignoreAccents: false })}
      onChange={(selectedOptions) => {
        onChange(
          name,
          selectedOptions.map((option) => option.value)
        );
      }}
      styles={{
        multiValue: (styles) => ({
          ...styles,
          backgroundColor: "rgba(75, 192, 192, 0.25)",
        }),
      }}
      theme={themeConfig}
    />
  );
}
