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
  useZIndex,
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
      menuPortalTarget={
        !useZIndex ? document.getElementById("portal-root") : null
      }
      {...rest}
    />
  );
}
