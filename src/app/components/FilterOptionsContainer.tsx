import { FilterOptions } from "../chart";
import { SelectFilter } from "./SelectFilterOption";
import { SetStateAction } from "react";
import { RangeFilter } from "./NumberFilterOption";
import option_steps from "../data/option_steps";

interface FilterOptionsContainerProps {
  filterOptions: FilterOptions;
  setFilters: (
    value: SetStateAction<Partial<FilterOptions> | undefined>
  ) => void;
}

export function FilterOptionsContainer({
  filterOptions,
  setFilters,
}: FilterOptionsContainerProps) {
  const onChange = (name: string, value: string[] | number[]) => {
    setFilters((prevState) => {
      return {
        ...prevState,
        [name]: value.length === 0 ? undefined : value,
      };
    });
  };
  return (
    <div className="flex flex-wrap items-center justify-center mt-4">
      {filterOptions
        ? Object.keys(filterOptions).map((column) => {
            return (
              <div key={column} className="flex items-center mb-2 mr-4">
                <label className="mr-2">{column}:</label>
                {Object.keys(option_steps).includes(column) ? (
                  <RangeFilter name={column} onChange={onChange} />
                ) : (
                  <SelectFilter
                    name={column}
                    values={
                      filterOptions[column as keyof FilterOptions] as string[]
                    }
                    onChange={onChange}
                  />
                )}
              </div>
            );
          })
        : null}
    </div>
  );
}
