import { FilterOptions } from "../../chart";
import { SelectFilter } from "./SelectFilter";
import { SetStateAction } from "react";
import { RangeFilter } from "./RangeFilter";
import option_steps from "../../data/range_options";

interface FilterContainerProps {
  filterOptions: FilterOptions;
  setFilters: (
    value: SetStateAction<Partial<FilterOptions> | undefined>
  ) => void;
}

export function FilterContainer({
  filterOptions,
  setFilters,
}: FilterContainerProps) {
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
        ? Object.entries(filterOptions).map(([column, values]) => {
            return (
              <div key={column} className="flex p-8 flex-col w-full sm:w-auto">
                <label className="mr-2 mb-2">{column}:</label>
                {Object.keys(option_steps).includes(column) ? (
                  <RangeFilter
                    name={column as keyof FilterOptions}
                    onChange={onChange}
                  />
                ) : (
                  <SelectFilter
                    name={column}
                    values={values as string[]}
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
