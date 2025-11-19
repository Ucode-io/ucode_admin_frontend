import cls from "../../styles/styles.module.scss";
import Select from "react-select";
import {generateLangaugeText} from "@/utils/generateLanguageText";
import { useActivityFeedHeaderProps } from "./useActivityFeedHeaderProps";
import FiltersBlock from "@/components/FiltersBlock";
import CRangePickerNew from "@/components/DatePickers/CRangePickerNew";
import { customStyles } from "@/components/Status";
import { ContentTitle } from "../../../../components/ContentTitle";
import { Box } from "@mui/material";
import { DatePickerInput } from "@mantine/dates";
import { Portal } from "@mantine/core";
import InlineSVG from "react-inlinesvg";
import { CloseIcon } from "@chakra-ui/icons";

export const getColumnIconPath = ({ column }) => {
  if (column.table_slug === "person") {
    return "/table-icons/person.svg";
  }
  return "/table-icons/date.svg";
};

export const ActivityFeedHeader = ({
  histories,
  setDateFilters,
  dateFilters,
  activityLan,
  setActionValue,
  isLoading,
  actionType,
}) => {
  const { i18n, handleDownloadExcel } = useActivityFeedHeaderProps({
    setActionValue,
    dateFilters,
    actionType,
  });

  const onClearButtonClick = () => {
    setDateFilters({})(undefined);
  };

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
          alignItems={"flex-start"}
        >
          <span>
            {generateLangaugeText(
              activityLan,
              i18n?.language,
              "Activity Logs",
            ) || "Activity Logs"}
          </span>
          <Box display={"flex"} gap={2} alignItems={"center"}>
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
                "Download Excel",
              ) || "Download Excel"}
            </a>
            <Box position="relative" minWidth="176px">
              <DatePickerInput
                styles={{
                  minWidth: "176px",
                }}
                popoverProps={{
                  withinPortal: false,
                }}
                id="dateFieldActivity"
                type="range"
                onChange={(value) => {
                  setDateFilters({
                    $gte: value[0],
                    $lte: value[1],
                  });
                }}
                value={[dateFilters.$gte, dateFilters.$lte]}
                // isClearable={false}
                clearable
                placeholder="Date filter"
                valueFormat="DD.MM.YYYY"
                rightSection={
                  dateFilters.$gte && dateFilters.$lte ? (
                    <CloseIcon
                      color="#909EAB"
                      width="9px"
                      height="9px"
                      ml="4px"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onClearButtonClick(ev);
                      }}
                      _hover={{ color: "#c00000" }}
                    />
                  ) : null
                }
                leftSection={
                  !dateFilters.$gte &&
                  !dateFilters.$lte && (
                    <InlineSVG
                      src={"/table-icons/date.svg"}
                      width={14}
                      height={14}
                      color="#909EAB"
                    />
                  )
                }
              />
            </Box>
          </Box>
        </Box>
      </ContentTitle>
      {/* <FiltersBlock sideClassName={cls.side} className={cls.filter_block}>
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
      </FiltersBlock> */}
    </>
  );
};
