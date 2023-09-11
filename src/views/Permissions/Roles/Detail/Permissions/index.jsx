import {useWatch} from "react-hook-form";
import TableCard from "../../../../../components/TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
} from "../../../../../components/CTable";
import {Box, Card, Checkbox} from "@mui/material";
import {useEffect, useState} from "react";
import TableRow from "./TableRow";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import MenuRow from "./MenuRow";
import CustomPermissionRow from "./CustomPermission";

const Permissions = ({
  control,
  setChangedData,
  changedData,
  setValue,
  watch,
}) => {
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
  const allReadTrue = tables?.tables?.every(
    (permission) => permission.record_permissions?.read === "Yes"
  );
  const allWriteTrue = tables?.tables?.every(
    (permission) => permission.record_permissions?.write === "Yes"
  );
  const allUpdateTrue = tables?.tables?.every(
    (permission) => permission.record_permissions?.update === "Yes"
  );
  const allDeleteTrue = tables?.tables?.every(
    (permission) => permission.record_permissions?.delete === "Yes"
  );
  const allPublicTrue = tables?.tables?.every(
    (permission) => permission.record_permissions?.is_public === true
  );

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
        <div>
          <Card style={{boxShadow: "none"}}>
            <TabList>
              <Tab>Table</Tab>
              <Tab>Menu</Tab>
              <Tab>Global Permission</Tab>
            </TabList>

            <TabPanel>
              <Box py={1}>
                <TableCard withBorder borderRadius="md" type={"withoutPadding"}>
                  <CTable>
                    <CTableHead>
                      <CTableHeadRow>
                        <CTableCell rowSpan={2} w={200}>
                          Объекты
                        </CTableCell>
                        <CTableCell colSpan={5}>
                          <Box sx={{justifyContent: "center", display: "flex"}}>
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
                        <CTableCell>
                          Чтение
                          <Checkbox
                            checked={allReadTrue ? true : false}
                            onChange={(e) => {
                              setValue(
                                "data.tables",
                                tables?.tables?.map((el) => ({
                                  ...el,
                                  record_permissions: {
                                    ...el.record_permissions,
                                    read: e.target.checked ? "Yes" : "No",
                                  },
                                }))
                              );
                            }}
                          />
                        </CTableCell>
                        <CTableCell>
                          Добавление
                          <Checkbox
                            checked={allWriteTrue ? true : false}
                            onChange={(e) => {
                              setValue(
                                "data.tables",
                                tables?.tables?.map((el) => ({
                                  ...el,
                                  record_permissions: {
                                    ...el.record_permissions,
                                    write: e.target.checked ? "Yes" : "No",
                                  },
                                }))
                              );
                            }}
                          />
                        </CTableCell>
                        <CTableCell>
                          Изменение
                          <Checkbox
                            checked={allUpdateTrue ? true : false}
                            onChange={(e) => {
                              setValue(
                                "data.tables",
                                tables?.tables?.map((el) => ({
                                  ...el,
                                  record_permissions: {
                                    ...el.record_permissions,
                                    update: e.target.checked ? "Yes" : "No",
                                  },
                                }))
                              );
                            }}
                          />
                        </CTableCell>
                        <CTableCell>
                          Удаление
                          <Checkbox
                            checked={allDeleteTrue ? true : false}
                            onChange={(e) => {
                              setValue(
                                "data.tables",
                                tables?.tables?.map((el) => ({
                                  ...el,
                                  record_permissions: {
                                    ...el.record_permissions,
                                    delete: e.target.checked ? "Yes" : "No",
                                  },
                                }))
                              );
                            }}
                          />
                        </CTableCell>
                        <CTableCell>
                          Публичный
                          <Checkbox
                            checked={allPublicTrue ? true : false}
                            onChange={(e) => {
                              setValue(
                                "data.tables",
                                tables?.tables?.map((el) => ({
                                  ...el,
                                  record_permissions: {
                                    ...el.record_permissions,
                                    is_public: e.target.checked,
                                  },
                                }))
                              );
                            }}
                          />
                        </CTableCell>
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
                          setValue={setValue}
                          watch={watch}
                        />
                      ))}
                    </CTableBody>
                  </CTable>
                </TableCard>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box py={1}>
                <TableCard withBorder borderRadius="md" type={"withoutPadding"}>
                  <CTable>
                    <CTableHead>
                      <CTableHeadRow>
                        <CTableCell rowSpan={2} w={200}>
                          Объекты
                        </CTableCell>
                        <CTableCell colSpan={5} tex>
                          <Box sx={{justifyContent: "center", display: "flex"}}>
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
              <Box py={1}>
                <TableCard withBorder borderRadius="md" type={"withoutPadding"}>
                  <CTable>
                    <CTableHead>
                      <CTableHeadRow>
                        <CTableCell width={"50%"}>Global permission</CTableCell>
                        <CTableCell></CTableCell>
                      </CTableHeadRow>
                    </CTableHead>
                    <CTableBody columnsCount={2} dataLength={5}>
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
