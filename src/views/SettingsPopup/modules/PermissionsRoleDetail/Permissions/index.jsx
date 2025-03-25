import {useWatch} from "react-hook-form";
import TableCard from "../../../../../components/TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
} from "../../../../../components/CTable";
import { Box, Card } from "@mui/material";
import { useEffect, useState } from "react";
import MenuRow from "./MenuRow";
import CustomPermissionRow from "./CustomPermission";
import styles from "./style.module.scss";
import { permissions } from "./mock";
import PermissionInfoModal from "./Components/Modals/PermissionInfoModal";
import { GoInfo } from "react-icons/go";
import { getAllFromDB } from "../../../../../utils/languageDB";
import { useTranslation } from "react-i18next";
import { generateLangaugeText } from "../../../../../utils/generateLanguageText";
import TableRow from "./TableRow";
import { CustomCheckbox } from "./CustomCheckbox";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import clsx from "clsx";

const Permissions = ({
  control,
  setChangedData,
  changedData,
  setValue,
  watch,
}) => {
  const [checkBoxValues, setCheckBoxValues] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);
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

  const isAllChecked =
    allReadTrue &&
    allWriteTrue &&
    allUpdateTrue &&
    allDeleteTrue &&
    allPublicTrue;

  useEffect(() => {
    const obj = {};
    allMenu?.forEach((item, index) => {
      obj[item.id] = item.permission;
    });
    setCheckBoxValues((prev) => ({ ...prev, ...obj }));
  }, [allMenu]);

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

  const handleChangeAllPermission = (e) => {
    setValue(
      "data.tables",
      tables?.tables?.map((el) => ({
        ...el,
        record_permissions: {
          ...el.record_permissions,
          read: e.target.checked ? "Yes" : "No",
          write: e.target.checked ? "Yes" : "No",
          update: e.target.checked ? "Yes" : "No",
          delete: e.target.checked ? "Yes" : "No",
          is_public: e.target.checked ? true : false,
        },
      }))
    );
  };

  const [activeTab, setActiveTab] = useState("table");
  const [isCategoryOpen, setCategoryOpen] = useState(false);

  const handleChangeTab = (tab) => setActiveTab(tab);

  const handleOpenCategory = () => setCategoryOpen(true);
  const handleCloseCategory = () => setCategoryOpen(false);

  const categories = {
    table: "Table",
    permission: "Global Permission",
    menu: "Menu",
  };

  const handleWindowClick = (e) => {
    if (!e.target.matches(`.${styles.categoryDropdownBtn}`)) {
      handleCloseCategory();
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);

    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  return (
    <>
      <div>
        <Card style={{ boxShadow: "none", paddingTop: "3px" }}>
          <div className={styles.categoryDropdown}>
            <button
              className={styles.categoryDropdownBtn}
              onClick={(e) => {
                e.stopPropagation();
                isCategoryOpen ? handleCloseCategory() : handleOpenCategory();
              }}
            >
              <span className={styles.categoryDropdownBtnInner}>
                <span>Category: {categories[activeTab]}</span>
                <ExpandMoreOutlinedIcon
                  sx={{
                    transform: isCategoryOpen ? "rotate(180deg)" : "rotate(0)",
                  }}
                  color="inherit"
                />
              </span>
            </button>
            {isCategoryOpen && (
              <div className={styles.categoryDropdownContent}>
                <p className={styles.categoryTitle}>Category</p>
                <ul className={styles.categoryList}>
                  <li className={styles.categoryItem}>
                    <div
                      className={styles.categoryLabel}
                      onClick={() => handleChangeTab("table")}
                    >
                      <span
                        className={clsx(styles.customRadio, {
                          [styles.active]: activeTab === "table",
                        })}
                      >
                        <span></span>
                      </span>
                      <span
                        className={clsx(
                          styles.categoryLabelBadge,
                          styles.table
                        )}
                      >
                        Table
                      </span>
                    </div>
                  </li>
                  <li className={styles.categoryItem}>
                    <div
                      className={styles.categoryLabel}
                      onClick={() => handleChangeTab("menu")}
                    >
                      <span
                        className={clsx(styles.customRadio, {
                          [styles.active]: activeTab === "menu",
                        })}
                      >
                        <span></span>
                      </span>
                      <span
                        className={clsx(styles.categoryLabelBadge, styles.menu)}
                      >
                        Menu
                      </span>
                    </div>
                  </li>
                  <li className={styles.categoryItem}>
                    <div
                      className={styles.categoryLabel}
                      onClick={() => handleChangeTab("permission")}
                    >
                      <span
                        className={clsx(styles.customRadio, {
                          [styles.active]: activeTab === "permission",
                        })}
                      >
                        <span></span>
                      </span>
                      <span
                        className={clsx(
                          styles.categoryLabelBadge,
                          styles.permission
                        )}
                      >
                        Global Permissions
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>

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
              <TableCard withBorder borderRadius="md" type={"withoutPadding"}>
                <CTable removableHeight={false}>
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
                          color="#475467"
                          fontSize="12px"
                          fontWeight={500}
                          lineHeight="18px"
                        >
                          <CustomCheckbox
                            onChange={handleChangeAllPermission}
                            defaultChecked={isAllChecked}
                          >
                            {generateLangaugeText(
                              permissionLan,
                              i18n?.language,
                              "Action"
                            ) || "Action"}
                          </CustomCheckbox>
                          {/* <GoInfo
                            size={18}
                            style={{ cursor: "pointer" }}
                            onClick={() => setModalData(recordPermission)}
                          /> */}
                        </Box>
                      </CTableCell>
                      {permissions.map((item) => (
                        <CTableCell rowSpan={2}>
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            columnGap={"4px"}
                            color="#475467"
                            fontSize="12px"
                            fontWeight={500}
                            lineHeight="18px"
                          >
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
                    {/* <CTableHeadRow>
                      <CTableCell>
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Reading"
                        ) || "Reading"}
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
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Adding"
                        ) || "Adding"}
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
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Editing"
                        ) || "Editing"}
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
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Deleting"
                        ) || "Deleting"}
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
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Public"
                        ) || "Public"}
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
                    </CTableHeadRow> */}
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
              <TableCard withBorder borderRadius="md" type={"withoutPadding"}>
                <CTable removableHeight={false}>
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
                    {/* <CTableHeadRow>
                    <CTableCell>
                      <Box
                        color="#475467"
                        fontSize="12px"
                        fontWeight={500}
                        lineHeight="18px"
                      >
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Read"
                        ) || "Read"}
                      </Box>
                    </CTableCell>
                    <CTableCell>
                      <Box
                        color="#475467"
                        fontSize="12px"
                        fontWeight={500}
                        lineHeight="18px"
                      >
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Add"
                        ) || "Add"}
                      </Box>
                    </CTableCell>
                    <CTableCell>
                      <Box
                        color="#475467"
                        fontSize="12px"
                        fontWeight={500}
                        lineHeight="18px"
                      >
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Edit"
                        ) || "Edit"}
                      </Box>
                    </CTableCell>
                    <CTableCell>
                      <Box
                        color="#475467"
                        fontSize="12px"
                        fontWeight={500}
                        lineHeight="18px"
                      >
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Delete"
                        ) || "Delete"}
                      </Box>
                    </CTableCell>
                    <CTableCell>
                      <Box
                        color="#475467"
                        fontSize="12px"
                        fontWeight={500}
                        lineHeight="18px"
                      >
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Settings"
                        ) || " Settings"}
                      </Box>
                    </CTableCell>
                  </CTableHeadRow> */}
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
          )}
          {activeTab === "permission" && (
            <Box py={1}>
              <TableCard withBorder borderRadius="md" type={"withoutPadding"}>
                <CTable removableHeight={false}>
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
