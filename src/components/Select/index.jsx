// import { BorderLeft } from "@material-ui/icons";
import { useEffect } from "react";
import RcSelect, { components } from "react-select";

export const customStyles = ({
  error = false,
  borderRight = "1px solid #eee",
  borderLeft = "1px solid #eee",
  width = "100%",
  height = "32px",
}) => ({
  control: (styles) => {
    return {
      ...styles,
      width: width,
      minHeight: height,
      borderRadius: 6,
      // borderTopLeftRadius: borderTopLeftRadius,
      // borderTopRightRadius: borderTopRightRadius,
      // borderBottomLeftRadius: borderBottomLeftRadius,
      // borderBottomRightRadius: borderBottomRightRadius,
      border: error
        ? "1px solid rgb(220, 38, 37)"
        : "1px solid rgba(229, 231, 235)",
      ":hover": {
        border: error
          ? "1px solid rgb(220, 38, 37, 0.5)"
          : "1px solid rgba(64, 148, 247, 1)",
      },
      borderRight: borderRight,
      boderLeft: borderLeft,

      ":focus-within": {
        border: "1px solid var(--color-primary)",
        boxShadow:
          "var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
      },
    };
  },
  valueContainer: (provided, state) => ({
    ...provided,
    padding: "0 14px",
    fontSize: "14px",
    lineHeight: "24px",
  }),
  input: (provided, state) => ({
    ...provided,

    margin: "0px",
  }),
  indicatorSeparator: (state) => ({
    display: "none",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: height,
  }),
  placeholder: (defaultStyles) => {
    return {
      ...defaultStyles,
      color: "#999",
    };
  },
  option: (styles) => {
    return {
      ...styles,
    };
  },
});

function Select({
  children,
  className = "",
  placeholder = "",
  width = "100%",
  height = "32px",
  isClearable = false,
  isSearchable = false,
  isMulti = false,
  disabled = false,
  isLoading = false,
  options = [],
  borderRight,
  borderLeft,
  maxMenuHeight = "initial",
  customOptionMulti = false,
  // borderTopLeftRadius,
  // borderTopRightRadius,
  // borderBottomLeftRadius,
  // borderBottomRightRadius,
  defaultValue,
  style,
  error,
  onChange,
  onInputChange,
  onClickOption,
  ...rest
}) {
  const MultiValueLabel = (props) => {
    return (
      <div className="cursor-pointer" onClick={() => onClickOption(props.data)}>
        <components.MultiValueLabel {...props} />
      </div>
    );
  };

  return (
    <div
      style={style}
      className={`${className} text-body focus-within:z-40 border-0`}
    >
      <RcSelect
        className="basic-single"
        classNamePrefix="select"
        components={customOptionMulti && { MultiValueLabel }}
        placeholder={placeholder}
        defaultValue={defaultValue}
        isDisabled={disabled}
        isLoading={isLoading}
        isMulti={isMulti}
        isClearable={isClearable}
        isSearchable={isSearchable}
        maxMenuHeight={maxMenuHeight}
        options={options}
        styles={customStyles({ error, borderRight, borderLeft, width, height })}
        onChange={onChange}
        onInputChange={onInputChange}
        {...rest}
      />
    </div>
  );
}

export default Select;
