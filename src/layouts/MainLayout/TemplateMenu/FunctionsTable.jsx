import React from "react";
import {Box, Grid} from "@chakra-ui/react";
import {Controller, useWatch} from "react-hook-form";
import {Checkbox} from "@mui/material";
import {useQuery} from "react-query";
import constructorTableService from "../../../services/constructorTableService";

const templateColumns = "minmax(42px,32px) minmax(540px,1fr)";

function FunctionsTable({
  control,
  selectedFolder = {},
  element = {},
  templatePopover = "",
}) {
  const tables = useWatch({control, name: "functions"}) || [];
  const tableSlug = element?.data?.table?.slug;

  const {
    data: {custom_events} = {
      custom_events: [],
    },
  } = useQuery({
    queryKey: [
      "GET_TABLE_INFO_ACTIONS",
      {
        tableSlug,
      },
    ],
    queryFn: () => {
      return constructorTableService.getTableInfo(tableSlug, {
        data: {},
      });
    },
    enabled: Boolean(tableSlug),
    select: (res) => {
      return {
        custom_events: res?.data?.custom_events ?? [],
      };
    },
  });

  return (
    <Box border="1px solid #EAECF0" borderRadius="8px" overflow="hidden">
      <Grid templateColumns={templateColumns} borderBottom="1px solid #EAECF0">
        <Th justifyContent="center">
          <img src="/img/hash.svg" alt="index" />
        </Th>
        <Th>Action Name</Th>
      </Grid>

      <Box h="260px" overflow="scroll">
        {custom_events?.map((table) => {
          const selectedIndex = tables.findIndex((t) => t.id === table.id);
          const isSelected = selectedIndex > -1;

          return (
            <Grid
              key={table?.id}
              templateColumns={templateColumns}
              borderBottom="1px solid #EAECF0"
              _hover={{bg: "gray.50"}}
              cursor="pointer">
              <Td justifyContent="center" fontWeight={600}>
                <Controller
                  name="functions"
                  control={control}
                  render={({field}) => (
                    <Checkbox
                      size="small"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...tables, {...table}]);
                        } else {
                          field.onChange(
                            tables.filter((t) => t.id !== table.id)
                          );
                        }
                      }}
                    />
                  )}
                />
              </Td>

              <Td>{table?.label}</Td>
            </Grid>
          );
        })}
      </Box>
    </Box>
  );
}

const Th = ({children, ...props}) => (
  <Grid
    as="div"
    display="flex"
    alignItems="center"
    h="32px"
    px="8px"
    py="4px"
    bg="#F9FAFB"
    borderRight="1px solid #EAECF0"
    color="#475467"
    fontWeight={500}
    fontSize="12px"
    {...props}>
    {children}
  </Grid>
);

const Td = ({children, ...props}) => (
  <Grid
    as="div"
    display="flex"
    alignItems="center"
    h="32px"
    px="8px"
    py="4px"
    bg="#fff"
    borderRight="1px solid #EAECF0"
    color="#475467"
    fontSize="14px"
    fontWeight={400}
    whiteSpace="nowrap"
    overflow="hidden"
    textOverflow="ellipsis"
    {...props}>
    {children}
  </Grid>
);

export default FunctionsTable;
