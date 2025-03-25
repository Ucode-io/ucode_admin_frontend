import {Button, Pagination} from "@mui/material";
import React, {useState} from "react";
import {ChakraProvider, Flex} from "@chakra-ui/react";
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import {useTranslation} from "react-i18next";
import {CreatableSelect} from "chakra-react-select";
import {paginationActions} from "../../../store/pagination/pagination.slice";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";

function DrawerTablePagination({
  limit,
  tableLan = {},
  dataCount,
  currentPage,
  setLimit = () => {},
  onPaginationChange = () => {},
  multipleDelete = () => {},
  selectedObjectsForDelete,
}) {
  const {tableSlug} = useParams();
  const {i18n} = useTranslation();
  const dispatch = useDispatch();
  console.log("pageCountpageCount", dataCount);
  const [limitOptions, setLimitOptions] = useState([
    {value: 10, label: "10 rows"},
    {value: 20, label: "20 rows"},
    {value: 30, label: "30 rows"},
    {value: 40, label: "40 rows"},
  ]);

  const getLimitValue = (item) => {
    setLimit(item);
    dispatch(
      paginationActions.setTablePages({
        tableSlug: tableSlug,
        pageLimit: item,
      })
    );
  };
  return (
    <div>
      <Flex
        px="16px"
        py="6px"
        borderTop="1px solid #EAECF0"
        justifyContent="space-between"
        bg="#fff">
        <Flex
          columnGap="16px"
          alignItems="center"
          fontSize={14}
          fontWeight={600}
          color="#344054">
          {generateLangaugeText(tableLan, i18n?.language, "Show") || "Show"}
          <ChakraProvider>
            <CreatableSelect
              chakraStyles={{
                container: (provided) => ({
                  ...provided,
                  width: "150px",
                }),
              }}
              value={{
                value: limit,
                label: `${limit} rows`,
              }}
              options={limitOptions}
              menuPlacement="top"
              onChange={({value}) => getLimitValue(value)}
              //   onCreateOption={onCreateLimitOption}
            />
          </ChakraProvider>
          {generateLangaugeText(tableLan, i18n?.language, "out of") || "out of"}{" "}
          {dataCount}
        </Flex>

        <Pagination
          page={currentPage}
          onChange={(_, page) => onPaginationChange(page)}
          count={dataCount}
          variant="outlined"
          shape="rounded"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />

        {selectedObjectsForDelete?.length > 0 && (
          <RectangleIconButton color="error" onClick={multipleDelete}>
            <Button variant="outlined" color="error">
              {generateLangaugeText(
                tableLan,
                i18n?.language,
                "Delete all selected"
              ) || "Delete all selected"}
            </Button>
          </RectangleIconButton>
        )}
      </Flex>
    </div>
  );
}

export default DrawerTablePagination;
