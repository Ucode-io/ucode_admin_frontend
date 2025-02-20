import {Box} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams, useSearchParams} from "react-router-dom";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {getColumnIcon} from "../../table-redesign/icons";
import DrawerFieldGenerator from "./ElementGenerator/DrawerFieldGenerator";

function DrawerFormDetailPage({
  tableSlugFromProps,
  selectedRow,
  control,
  watch,
  reset,
  data,
}) {
  const {i18n} = useTranslation();
  return (
    <>
      <Box mt="10px">
        {data?.tabs?.[0]?.sections?.map((section, secIndex) => (
          <Box key={secIndex}>
            {section?.fields?.map((field, fieldIndex) => {
              return (
                <Box
                  key={fieldIndex}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  {...(Boolean(field?.type === "MULTISELECT")
                    ? {minHeight: "30px"}
                    : {height: "34px"})}
                  py="8px">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={"space-between"}
                    padding="5px"
                    borderRadius={"4px"}
                    width="40%"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#F7F7F7",
                      },
                    }}>
                    <Box
                      width="14px"
                      height="16px"
                      mr="8px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center">
                      {getColumnIcon({
                        column: {
                          type: field?.type ?? field?.relation_type,
                          table_slug: field?.table_slug ?? field?.slug,
                        },
                      })}
                    </Box>
                    <Box
                      fontSize="12px"
                      color="#787774"
                      fontWeight="500"
                      width="100%">
                      {field?.attributes?.[`label_${i18n?.language}`] ||
                        field?.label}
                    </Box>
                  </Box>
                  <Box sx={{width: "60%"}}>
                    <DrawerFieldGenerator
                      control={control}
                      field={field}
                      watch={watch}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </>
  );
}

export default DrawerFormDetailPage;
