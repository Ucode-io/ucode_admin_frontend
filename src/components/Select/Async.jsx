import AsyncSelect from "react-select/async";

export default function Async({
  loadOptions,
  onChange,
  onInputChange,
  defaultOptions,
  cacheOptions,
  isClearable,
  isMulti,
  styles,
  ...rest
}) {
  return (
    <AsyncSelect
      isMulti={isMulti}
      isClearable={isClearable}
      cacheOptions={cacheOptions}
      defaultOptions={defaultOptions}
      loadOptions={loadOptions}
      onChange={onChange}
      onInputChange={onInputChange}
      styles={styles}
      {...rest}
    />
  );
}
