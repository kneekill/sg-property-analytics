import Select from "react-select";

interface SelectFilterProps {
  name: string;
  values: string[];
  onChange: (key: string, options: string[]) => void;
}
export function SelectFilter({ name, values, onChange }: SelectFilterProps) {
  return (
    <Select
      className="w-64"
      isMulti
      name={name}
      options={values.map((option) => ({
        value: option,
        label: option,
      }))}
      onChange={(selectedOptions) => {
        console.log(selectedOptions);
        console.log(name);
        onChange(
          name,
          selectedOptions.map((option) => option.value)
        );
      }}
      styles={{
        multiValue: (styles, opts) => ({
          ...styles,
          backgroundColor: "rgba(75, 192, 192, 0.25)",
        }),
      }}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: "rgb(75, 192, 192)",
          primary25: "rgba(75, 192, 192, 0.25)",
          neutral0: "rgb(36, 36, 36)",
          neutral80: "white",
        },
      })}
    />
  );
}
