import React, {useState} from "react";
import {Box, Grid} from "@chakra-ui/react";
import {Controller, useWatch} from "react-hook-form";
import {Checkbox} from "@mui/material";
import {useMenuListQuery} from "../../../services/menuService";

const templateColumns = "minmax(42px,32px) minmax(540px,1fr) minmax(60px,1fr)";

function MicroFunctions({control, selectedFolder = {}, templatePopover = ""}) {
  const tables = useWatch({control, name: "microfronts"}) || [];
  const [childs, setChilds] = useState([]);

  const {isLoading} = useMenuListQuery({
    params: {parent_id: selectedFolder?.id},
    queryParams: {
      enabled: Boolean(selectedFolder?.id),
      onSuccess: (res) => {
        // Handle different data structures based on templatePopover
        if (templatePopover === "create-template") {
          // For create-template: res?.menus?.microfronts
          setChilds(res?.menus?.microfronts || []);
        } else {
          // For template: res?.menus filtered by MICROFRONTEND type
          setChilds(
            res?.menus?.filter((menu) => menu.type === "MICROFRONTEND") || []
          );
        }
      },
    },
  });

  return (
    <Box border="1px solid #EAECF0" borderRadius="8px" overflow="hidden">
      <Grid templateColumns={templateColumns} borderBottom="1px solid #EAECF0">
        <Th justifyContent="center">
          <img src="/img/hash.svg" alt="index" />
        </Th>
        <Th>Microfrontend Name</Th>
        <Th justifyContent="center">With Data</Th>
      </Grid>

      <Box h="260px" overflow="scroll">
        {childs?.map((table) => {
          const selectedIndex = tables.findIndex((t) => t.id === table.id);
          const isSelected = selectedIndex > -1;
          const withRows = isSelected ? tables[selectedIndex].with_rows : false;

          return (
            <Grid
              key={table?.id}
              templateColumns={templateColumns}
              borderBottom="1px solid #EAECF0"
              _hover={{bg: "gray.50"}}
              cursor="pointer">
              <Td justifyContent="center" fontWeight={600}>
                <Controller
                  name="microfronts"
                  control={control}
                  render={({field}) => (
                    <Checkbox
                      size="small"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([
                            ...tables,
                            {...table, with_rows: false},
                          ]);
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

              <Td display="flex" justifyContent="center">
                <Controller
                  name="microfronts"
                  control={control}
                  render={({field}) => (
                    <Checkbox
                      size="small"
                      disabled={!isSelected}
                      checked={withRows}
                      onChange={(e) => {
                        if (!isSelected) return;
                        const newTables = tables.map((t) =>
                          t.id === table.id
                            ? {...t, with_rows: e.target.checked}
                            : t
                        );
                        field.onChange(newTables);
                      }}
                    />
                  )}
                />
              </Td>
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

export default MicroFunctions;
