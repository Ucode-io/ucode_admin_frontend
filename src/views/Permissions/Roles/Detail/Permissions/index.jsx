import { useFieldArray, useWatch } from "react-hook-form";
import TableCard from "../../../../../components/TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
} from "../../../../../components/CTable";
import { Box, Button, Card } from "@mui/material";
import { useEffect, useState } from "react";
import TableRow from "./TableRow";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import MenuRow from "./MenuRow";
import CustomPermissionRow from "./CustomPermission";

const Permissions = ({
  control,
  setChangedData,
  changedData,
  setValue,
  watch,
}) => {
  const { fields: apps } = useFieldArray({
    control,
    name: "data.tables",
    keyName: "key",
  });
  console.log("apps", apps);
  const [checkBoxValues, setCheckBoxValues] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);

  const tables = useWatch({
    control,
    name: "data",
  });

  const allMenu = useWatch({
    control,
    name: "menus",
  });

  useEffect(() => {
    const obj = {};
    allMenu?.forEach((item, index) => {
      obj[item.id] = item.permission;
    });
    setCheckBoxValues(obj);
  }, [allMenu]);

  return (
    <>
      <Tabs
        direction={"ltr"}
        selectedIndex={selectedTab}
        onSelect={setSelectedTab}
      >
        <div style={{ padding: "20px" }}>
          <Card style={{ padding: "10px" }}>
            <TabList>
              <Tab>Table</Tab>
              <Tab>Menu</Tab>
              <Tab>Global Permission</Tab>
            </TabList>

            <TabPanel>
              <Box py={4}>
                <TableCard withBorder borderRadius="md">
                  <CTable>
                    <CTableHead>
                      <CTableHeadRow>
                        <CTableCell rowSpan={2} w={200}>
                          Объекты
                        </CTableCell>
                        <CTableCell colSpan={5}>
                          <Box
                            sx={{ justifyContent: "center", display: "flex" }}
                          >
                            Record permissions
                          </Box>
                        </CTableCell>
                        <CTableCell rowSpan={2}>Field permissions</CTableCell>
                        <CTableCell rowSpan={2}>Action permissions</CTableCell>
                        <CTableCell rowSpan={2}>Relation permission</CTableCell>
                        <CTableCell rowSpan={2}>View permission</CTableCell>
                        <CTableCell rowSpan={2}>Custom permission</CTableCell>
                      </CTableHeadRow>
                      <CTableHeadRow>
                        <CTableCell>Чтение</CTableCell>
                        <CTableCell>Добавление</CTableCell>
                        <CTableCell>Изменение</CTableCell>
                        <CTableCell>Удаление</CTableCell>
                        <CTableCell>Публичный</CTableCell>
                      </CTableHeadRow>
                    </CTableHead>
                    <CTableBody
                      //   loader={isLoading}
                      columnsCount={8}
                      dataLength={tables?.tables?.length}
                    >
                      {tables?.tables?.map((table, tableIndex) => (
                        <TableRow
                          key={table.id}
                          table={table}
                          tableIndex={tableIndex}
                          control={control}
                        />
                      ))}
                    </CTableBody>
                  </CTable>
                </TableCard>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box py={4}>
                <TableCard withBorder borderRadius="md">
                  <CTable>
                    <CTableHead>
                      <CTableHeadRow>
                        <CTableCell rowSpan={2} w={200}>
                          Объекты
                        </CTableCell>
                        <CTableCell colSpan={5} tex>
                          <Box
                            sx={{ justifyContent: "center", display: "flex" }}
                          >
                            Menu permissions
                          </Box>
                        </CTableCell>
                      </CTableHeadRow>
                      <CTableHeadRow>
                        <CTableCell>Чтение</CTableCell>
                        <CTableCell>Добавление</CTableCell>
                        <CTableCell>Изменение</CTableCell>
                        <CTableCell>Удаление</CTableCell>
                        <CTableCell>Настройки</CTableCell>
                      </CTableHeadRow>
                    </CTableHead>
                    <CTableBody columnsCount={6} dataLength={allMenu?.length}>
                      {allMenu?.map((app, appIndex) => (
                        <MenuRow
                          key={app.id}
                          allMenus={allMenu}
                          app={app}
                          changedData={changedData}
                          appIndex={appIndex}
                          control={control}
                          checkBoxValues={checkBoxValues}
                          setCheckBoxValues={setCheckBoxValues}
                          setChangedData={setChangedData}
                          setValue={setValue}
                        />
                      ))}
                    </CTableBody>
                  </CTable>
                </TableCard>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box py={4}>
                <TableCard withBorder borderRadius="md">
                  <CTable>
                    <CTableHead>
                      <CTableHeadRow>
                        <CTableCell>Chat</CTableCell>
                        <CTableCell>Menu button</CTableCell>
                        <CTableCell>Settings button</CTableCell>
                        <CTableCell>Projects button</CTableCell>
                        <CTableCell>Environments button</CTableCell>
                        <CTableCell>API keys button</CTableCell>
                        <CTableCell>Redirects button</CTableCell>
                        <CTableCell>Menu setting button</CTableCell>
                        <CTableCell>Profile settings button</CTableCell>
                        <CTableCell>Project settings button</CTableCell>
                      </CTableHeadRow>
                    </CTableHead>
                    <CTableBody columnsCount={10}>
                      <CustomPermissionRow watch={watch} setValue={setValue} />
                    </CTableBody>
                  </CTable>
                </TableCard>
              </Box>
            </TabPanel>
          </Card>
        </div>
      </Tabs>
    </>
  );
};

export default Permissions;
