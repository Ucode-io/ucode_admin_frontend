import {useWatch} from "react-hook-form";
import TableCard from "@/components/TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
} from "@/components/CTable";
import {Box, Card} from "@mui/material";
import {useEffect, useState} from "react";
import MenuRow from "./MenuRow";
import CustomPermissionRow from "./CustomPermission";
import styles from "./style.module.scss";
import {permissions} from "./mock";
import PermissionInfoModal from "./Components/Modals/PermissionInfoModal";
import {GoInfo} from "react-icons/go";
import {getAllFromDB} from "../../../../../utils/languageDB";
import {useTranslation} from "react-i18next";
import {generateLangaugeText} from "@/utils/generateLanguageText";
import TableRow from "./TableRow";
import {CustomCheckbox} from "../../../components/CustomCheckbox";

const Permissions = ({
  control,
  setChangedData,
  changedData,
  setValue,
  watch,
  activeTab,
  getValues,
  activeRoleId,
}) => {
  const [modalData, setModalData] = useState(null);
  const [permissionLan, setPermissionLan] = useState(null);
  const { i18n } = useTranslation();

  const closeModal = () => {
    setModalData(null);
  };

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

  const allMenuReadTrue = allMenu?.every((item) => item.permission?.read);
  const allMenuWriteTrue = allMenu?.every((item) => item.permission?.write);
  const allMenuUpdateTrue = allMenu?.every((item) => item.permission?.update);
  const allMenuDeleteTrue = allMenu?.every((item) => item.permission?.delete);
  const allMenuMenuSettingsTrue = allMenu?.every(
    (item) => item.permission?.menu_settings
  );

  useEffect(() => {
    let isMounted = true;

    getAllFromDB().then((storedData) => {
      if (isMounted && storedData && Array.isArray(storedData)) {
        const formattedData = storedData.map((item) => ({
          ...item,
          translations: item.translations || {},
        }));
        setPermissionLan(
          formattedData?.find((item) => item?.key === "Permission")
        );
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div>
        <Card style={{ boxShadow: "none", paddingTop: "3px" }}>
          {/* <TabList>
            <Tab>
              {generateLangaugeText(permissionLan, i18n?.language, "Table") ||
                "Table"}
            </Tab>
            <Tab>
              {generateLangaugeText(permissionLan, i18n?.language, "Menu") ||
                "Menu"}
            </Tab>
            <Tab>
              {generateLangaugeText(
                permissionLan,
                i18n?.language,
                "Global Permission"
              ) || "Global Permission"}
            </Tab>
          </TabList> */}

          {activeTab === "table" && (
            <Box py={1}>
              <TableCard
                withBorder
                borderRadius="md"
                disablePagination
                type={"withoutPadding"}
                bodyClassname={styles.body}
              >
                <CTable removableHeight={284} disablePagination>
                  <CTableHead>
                    <CTableHeadRow>
                      <CTableCell
                        rowSpan={2}
                        w={200}
                        className={styles.sticky_header}
                      >
                        <Box
                          minWidth="198px"
                          color="#475467"
                          fontSize="12px"
                          fontWeight={500}
                          lineHeight="18px"
                        >
                          {generateLangaugeText(
                            permissionLan,
                            i18n?.language,
                            "Objects"
                          ) || "Objects"}
                        </Box>
                      </CTableCell>
                      <CTableCell colSpan={5}>
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent="center"
                          columnGap={"4px"}
                          className={styles.headCellBox}
                        >
                          {generateLangaugeText(
                            permissionLan,
                            i18n?.language,
                            "Record Permission"
                          ) || "Record Permission"}
                        </Box>
                      </CTableCell>
                      {permissions.map((item) => (
                        <CTableCell rowSpan={2}>
                          <Box className={styles.headCellBox}>
                            {item.title}{" "}
                            <GoInfo
                              size={18}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                item?.content && setModalData(item)
                              }
                            />
                          </Box>
                        </CTableCell>
                      ))}
                    </CTableHeadRow>
                    <CTableHeadRow>
                      <CTableCell>
                        <CustomCheckbox
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
                        <CustomCheckbox
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
                        <CustomCheckbox
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
                        <CustomCheckbox
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
                        <CustomCheckbox
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
                        permissionLan={permissionLan}
                      />
                    ))}
                  </CTableBody>
                </CTable>
              </TableCard>
            </Box>
          )}
          {activeTab === "menu" && (
            <Box py={1}>
              <TableCard
                withBorder
                disablePagination
                borderRadius="md"
                type={"withoutPadding"}
              >
                <CTable removableHeight={false} disablePagination>
                  <CTableHead>
                    <CTableHeadRow>
                      <CTableCell rowSpan={2} w={200}>
                        <Box
                          minWidth="198px"
                          color="#475467"
                          fontSize="12px"
                          fontWeight={500}
                          lineHeight="18px"
                        >
                          {generateLangaugeText(
                            permissionLan,
                            i18n?.language,
                            "Objects"
                          ) || "Objects"}
                        </Box>
                      </CTableCell>
                      <CTableCell colSpan={5} tex>
                        <Box
                          sx={{ justifyContent: "center", display: "flex" }}
                          color="#475467"
                          fontSize="12px"
                          fontWeight={500}
                          lineHeight="18px"
                        >
                          {generateLangaugeText(
                            permissionLan,
                            i18n?.language,
                            "Menu permissions"
                          ) || "Menu permissions"}
                        </Box>
                      </CTableCell>
                    </CTableHeadRow>
                    <CTableHeadRow>
                      <CTableCell>
                        <CustomCheckbox
                          checked={allMenuReadTrue}
                          onChange={(e) => {
                            setValue(
                              "menus",
                              allMenu?.map((item) => ({
                                ...item,
                                permission: {
                                  ...item.permission,
                                  read: e.target.checked,
                                },
                              }))
                            );
                            setChangedData(
                              allMenu?.map((item) => ({
                                ...item,
                                permission: {
                                  ...item.permission,
                                  read: e.target.checked,
                                },
                              }))
                            );
                          }}
                        />
                      </CTableCell>
                      <CTableCell>
                        <CustomCheckbox
                          checked={allMenuWriteTrue}
                          onChange={(e) => {
                            setValue(
                              "menus",
                              allMenu?.map((item) => ({
                                ...item,
                                permission: {
                                  ...item.permission,
                                  write: e.target.checked,
                                },
                              }))
                            );
                            setChangedData(
                              allMenu?.map((item) => ({
                                ...item,
                                permission: {
                                  ...item.permission,
                                  write: e.target.checked,
                                },
                              }))
                            );
                          }}
                        />
                      </CTableCell>
                      <CTableCell>
                        <CustomCheckbox
                          checked={allMenuUpdateTrue}
                          onChange={(e) => {
                            setValue(
                              "menus",
                              allMenu?.map((item) => ({
                                ...item,
                                permission: {
                                  ...item.permission,
                                  update: e.target.checked,
                                },
                              }))
                            );
                            setChangedData(
                              allMenu?.map((item) => ({
                                ...item,
                                permission: {
                                  ...item.permission,
                                  update: e.target.checked,
                                },
                              }))
                            );
                          }}
                        />
                      </CTableCell>
                      <CTableCell>
                        <CustomCheckbox
                          checked={allMenuDeleteTrue}
                          onChange={(e) => {
                            setValue(
                              "menus",
                              allMenu?.map((item) => ({
                                ...item,
                                permission: {
                                  ...item.permission,
                                  delete: e.target.checked,
                                },
                              }))
                            );
                            setChangedData(
                              allMenu?.map((item) => ({
                                ...item,
                                permission: {
                                  ...item.permission,
                                  delete: e.target.checked,
                                },
                              }))
                            );
                          }}
                        />
                      </CTableCell>
                      <CTableCell>
                        <CustomCheckbox
                          checked={allMenuMenuSettingsTrue}
                          onChange={(e) => {
                            setValue(
                              "menus",
                              allMenu?.map((item) => ({
                                ...item,
                                permission: {
                                  ...item.permission,
                                  menu_settings: e.target.checked,
                                },
                              }))
                            );
                            setChangedData(
                              allMenu?.map((item) => ({
                                ...item,
                                permission: {
                                  ...item.permission,
                                  menu_settings: e.target.checked,
                                },
                              }))
                            );
                          }}
                        />
                      </CTableCell>
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
                        setChangedData={setChangedData}
                        setValue={setValue}
                        watch={watch}
                        getValues={getValues}
                        activeRoleId={activeRoleId}
                        icon={
                          app?.icon ||
                          app?.data?.microfrontend?.icon ||
                          app?.data?.webpage?.icon
                        }
                      />
                    ))}
                  </CTableBody>
                </CTable>
              </TableCard>
            </Box>
          )}
          {activeTab === "permission" && (
            <Box py={1}>
              <TableCard
                withBorder
                borderRadius="md"
                type={"withoutPadding"}
                disablePagination
              >
                <CTable removableHeight={false} disablePagination>
                  <CTableHead>
                    <CTableHeadRow>
                      <CTableCell width={"50%"}>
                        <Box
                          color="#475467"
                          fontSize="12px"
                          fontWeight={500}
                          lineHeight="18px"
                        >
                          {generateLangaugeText(
                            permissionLan,
                            i18n?.language,
                            "Global Permissions"
                          ) || "Global Permissions"}
                        </Box>
                      </CTableCell>
                      <CTableCell></CTableCell>
                    </CTableHeadRow>
                  </CTableHead>
                  <CTableBody columnsCount={2} dataLength={5}>
                    <CustomPermissionRow watch={watch} setValue={setValue} />
                  </CTableBody>
                </CTable>
              </TableCard>
            </Box>
          )}
        </Card>
      </div>
      {modalData && (
        <PermissionInfoModal modalData={modalData} closeModal={closeModal} />
      )}
    </>
  );
};

export default Permissions;
