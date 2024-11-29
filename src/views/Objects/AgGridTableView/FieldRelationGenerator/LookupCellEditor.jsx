import React, {useEffect, useState} from "react";
import Select, {components} from "react-select";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    background: isBlackBg ? "#2A2D34" : disabled ? "#FFF" : "transparent",
    color: isBlackBg ? "#fff" : "",
    width: "100%",
    display: "flex",
    alignItems: "center",
    border: "0px solid #fff",
    outline: "none",
  }),
  input: (provided) => ({
    ...provided,
    width: "100%",
    border: "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    display: "flex",
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected ? "#007AFF" : provided.background,
    color: state.isSelected ? "#fff" : provided.color,
    cursor: "pointer",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

const LookupCellEditor = (props) => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(props?.value || "");
  console.log("propsprops", props);
  return (
    <Select
      customStyles={customStyles}
      value={props?.value}
      style={{border: "0px solid #000"}}
      // inputValue={inputValue}
      // onInputChange={(newInputValue, {action}) => {
      //   if (action !== "reset") {
      //     setInputValue(newInputValue);
      //     inputChangeHandler(newInputValue);
      //   }
      // }}
      // isDisabled={disabled || autofilterDisable}
      // onMenuScrollToBottom={loadMoreItems}
      // options={computedOptions ?? []}
      // value={localValue}
      // menuPortalTarget={document.body}
      // onMenuOpen={(e) => {
      //   refetch();
      // }}
      isClearable
      // components={{
      //   ClearIndicator: () =>
      //     localValue?.length && (
      //       <div
      //         style={{
      //           marginRight: "10px",
      //           cursor: "pointer",
      //         }}
      //         onClick={(e) => {
      //           e.stopPropagation();
      //           setLocalValue([]);
      //         }}>
      //         <ClearIcon />
      //       </div>
      //     ),
      //   SingleValue: CustomSingleValue,
      //   DropdownIndicator: null,
      // }}
      // onChange={(newValue, {action}) => {
      //   changeHandler(newValue);
      // }}
      // noOptionsMessage={() => (
      //   <span
      //     onClick={() => navigateToForm(tableSlug, "CREATE", {}, {}, menuId)}
      //     style={{color: "#007AFF", cursor: "pointer", fontWeight: 500}}>
      //     Create new
      //   </span>
      // )}
      // menuShouldScrollIntoView
      // styles={customStyles}
      // getOptionLabel={(option) => `${getRelationFieldTabsLabel(field, option)}`}
      // getOptionValue={(option) => option.value}
      // isOptionSelected={(option, value) =>
      //   value.some((val) => val.guid === value)
      // }
      blurInputOnSelect
    />
  );
};

export default LookupCellEditor;
