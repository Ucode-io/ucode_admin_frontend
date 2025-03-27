import cls from "../../styles/styles.module.scss";
import Select from "react-select";
import {generateLangaugeText} from "@/utils/generateLanguageText";
import { useActivityFeedHeaderProps } from "./useActivityFeedHeaderProps";
import FiltersBlock from "@/components/FiltersBlock";
import CRangePickerNew from "@/components/DatePickers/CRangePickerNew";
import { customStyles } from "@/components/Status";
import { ContentTitle } from "../../../../components/ContentTitle";
import { Box } from "@mui/material";

export const ActivityFeedHeader = ({
  histories,
  setDateFilters,
  dateFilters,
  activityLan,
  setActionValue,
  isLoading,
}) => {
  const {
    inputValue,
    setInputValue,
    i18n,
    actionOptions,
    changeHandler,
    handleDownloadExcel,
    actionType,
  } = useActivityFeedHeaderProps({ setActionValue, dateFilters });

  return (
    <>
      <ContentTitle
        subtitle={
          <>
            {histories?.length || "0"}{" "}
            {generateLangaugeText(activityLan, i18n?.language, "Items") ||
              "Items"}
          </>
        }
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <span>
            {generateLangaugeText(
              activityLan,
              i18n?.language,
              "Activity Logs"
            ) || "Activity Logs"}
          </span>
          <a
            onClick={handleDownloadExcel}
            href="/"
            style={{
              fontSize: "14px",
              cursor: isLoading ? "progress" : "pointer",
            }}
          >
            {generateLangaugeText(
              activityLan,
              i18n?.language,
              "Download Excel"
            ) || "Download Excel"}
          </a>
        </Box>
      </ContentTitle>
      <FiltersBlock sideClassName={cls.side} className={cls.filter_block}>
        <Select
          inputValue={inputValue}
          onInputChange={(newInputValue, { action }) => {
            setInputValue(newInputValue);
          }}
          options={actionOptions}
          isClearable
          isSearchable
          // components={{
          //   DropdownIndicator: null,
          // }}
          onChange={(newValue, { action }) => {
            console.log(action);
            if (action === "clear") {
              setInputValue("");
            }
            changeHandler(newValue);
          }}
          value={actionType?.label ? actionType : null}
          menuShouldScrollIntoView
          styles={customStyles}
          // onPaste={(e) => {}}
          isOptionSelected={(option, value) =>
            value.some((val) => val.guid === value)
          }
          placeholder={
            generateLangaugeText(activityLan, i18n?.language, "Action Type") ||
            "Action Type"
          }
          blurInputOnSelect
        />
        <CRangePickerNew
          onChange={setDateFilters}
          value={dateFilters}
          isClearable={false}
          maxZIndex={true}
        />
      </FiltersBlock>
    </>
  );
};
