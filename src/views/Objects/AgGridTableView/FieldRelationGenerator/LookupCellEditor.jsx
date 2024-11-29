import React, {useEffect, useState} from "react";
import Select, {components} from "react-select";

const LookupCellEditor = (props) => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(props?.value || "");
  console.log("propsprops", props);
  return (
    <Select
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
