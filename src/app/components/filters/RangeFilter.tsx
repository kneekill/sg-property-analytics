import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import optionsJson from "../../data/range_options";
import { FilterOptions } from "../../chart";
import { themeConfig } from "./FilterConstants";

interface RangeFilterProps {
  name: keyof FilterOptions;
  onChange: (key: string, options: number[]) => void;
}

const isValidNewOption = (inputValue: string) => {
  return !isNaN(parseFloat(inputValue));
};

export function RangeFilter({ name, onChange }: RangeFilterProps) {
  const options = optionsJson[name] as number[];
  const [value, setValue] = useState<number[]>([0, Number.MAX_SAFE_INTEGER]);
  const handleChange = (values: number[]) => {
    console.log(values);
    onChange(name, values);
    setValue(values);
  };
  return (
    <div className="flex">
      <CreatableSelect
        instanceId={`${name}-min`}
        className="w-full mr-8"
        isValidNewOption={isValidNewOption}
        name={name}
        options={[
          { value: 0, label: "No min" },
          ...options.map((option) => ({
            value: option,
            label: option,
          })),
        ]}
        onChange={(selectedOption) => {
          if (selectedOption) {
            handleChange([selectedOption.value, value[1]]);
          }
        }}
        theme={themeConfig}
      />
      <CreatableSelect
        instanceId={`${name}-max`}
        className="w-full"
        name={name}
        formatCreateLabel={(inputValue) => inputValue}
        isValidNewOption={isValidNewOption}
        options={[
          { value: Number.MAX_SAFE_INTEGER, label: "No max" },
          ...options.map((option) => ({
            value: option,
            label: option,
          })),
        ]}
        onChange={(selectedOption) => {
          if (selectedOption) {
            handleChange([value[0], selectedOption.value]);
          }
        }}
        theme={themeConfig}
      />
    </div>
  );
}