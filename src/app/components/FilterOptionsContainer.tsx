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
    <>
      {filterOptions
        ? Object.keys(filterOptions).map((column) => {
            return (
              <div key={column} className="flex p-8 flex-col w-full sm:w-auto">
                <label className="mr-2 mb-2">{column}:</label>
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
    </>
  );
}
