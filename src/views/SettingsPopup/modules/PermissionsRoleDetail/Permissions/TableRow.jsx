import {useState} from "react";
import {FiFilter} from "react-icons/fi";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import {CTableCell, CTableHeadRow} from "../../../../../components/CTable";
import PermissionCheckbox from "./Components/PermissionCheckbox";
import FormCheckbox from "./Components/Checkbox/FormCheckbox";
import useBooleanState from "../../../../../hooks/useBooleanState";
import AutoFilterModal from "./Components/Modals/AutoFilterModal";
import FieldPermissions from "./Components/Modals/FieldPermissionModal";
import ActionPermissionModal from "./Components/Modals/ActionPermissionModal";
import TableViewPermission from "./Components/Modals/TableViewPermission";
import RelationPermissionModal from "./Components/Modals/RelationPermissionModal";
import CustomPermissionModal from "./Components/Modals/CustomPermissionModal";
import {Box, Icon} from "@mui/material";
import {MdDashboardCustomize} from "react-icons/md";
import {BiTable} from "react-icons/bi";
import {
  RouteIcon,
  LinkIcon,
  TableIcon,
  EyeIcon,
  EditCardIcon,
} from "../../../../../assets/icons/icon";
import { useTranslation } from "react-i18next";
import styles from "./style.module.scss";
import clsx from "clsx";

const TableRow = ({
  table,
  tableIndex,
  control,
  setValue,
  watch,
  permissionLan,
}) => {
  const [type, setType] = useState("");
  const { i18n } = useTranslation();

  const basePath = `data.tables.${tableIndex}.record_permissions`;
  const [
    fieldPermissionModalIsOpen,
    openFieldPermissionModal,
    closeFieldPermissionModal,
  ] = useBooleanState(false);
  const [autoFiltersModalIsOpen, openAutoFiltersModal, closeAutoFiltersModal] =
    useBooleanState(false);
  const [
    actionPermissionsModalIsOpen,
    openActionPermissionsModal,
    closeOpenActionPermissionsModal,
  ] = useBooleanState(false);
  const [
    tableViewPermissionModalIsOpen,
    openTableViewPermissionModal,
    closeTableViewPermissionModal,
  ] = useBooleanState(false);
  const [
    relationPermissionModalIsOpen,
    openRelationPermissionModal,
    closeRelationPermissionModal,
  ] = useBooleanState(false);
  const [
    customPermissionModalIsOpen,
    openCustomPermissionModal,
    closeCustomPermissionModal,
  ] = useBooleanState(false);

  return (
    <>
      <CTableHeadRow className={styles.head_row}>
        <CTableCell className={styles.sticky_header}>
          {table?.attributes?.[`label_${i18n?.language}`] ??
            table?.attributes?.[`title${i18n?.language}`] ??
            table.label}
        </CTableCell>
        <CTableCell className={clsx(styles.tbCell, styles.tbBadgeCell)}>
          <Box
            sx={{
              justifyContent: "center",
              display: "flex",
              gap: "6px",
              alignItems: "center",
            }}
          >
            <label>
              <PermissionCheckbox
                className={clsx(styles.visuallyHidden)}
                control={control}
                name={basePath + ".read"}
              />
              <span
                className={clsx(styles.label, {
                  [styles.active]: watch(basePath + ".read") === "Yes",
                })}
              >
                Read
              </span>
            </label>
            <RectangleIconButton
              size="small"
              onClick={() => {
                setType("read");
                openAutoFiltersModal();
              }}
            >
              <FiFilter color="#475467" width="16px" height="16px" />
            </RectangleIconButton>
          </Box>
        </CTableCell>
        <CTableCell className={clsx(styles.tbCell, styles.tbBadgeCell)}>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <label>
              <PermissionCheckbox
                className={clsx(styles.visuallyHidden)}
                control={control}
                name={basePath + ".write"}
              />
              <span
                className={clsx(styles.label, {
                  [styles.active]: watch(basePath + ".write") === "Yes",
                })}
              >
                Write
              </span>
            </label>
          </Box>
        </CTableCell>
        <CTableCell className={clsx(styles.tbCell, styles.tbBadgeCell)}>
          <Box
            sx={{
              justifyContent: "center",
              display: "flex",
              gap: "6px",
              alignItems: "center",
            }}
          >
            <label>
              <PermissionCheckbox
                className={clsx(styles.visuallyHidden)}
                control={control}
                name={basePath + ".update"}
              />

              <span
                className={clsx(styles.label, {
                  [styles.active]: watch(basePath + ".update") === "Yes",
                })}
              >
                Update
              </span>
            </label>
            {/* <RectangleIconButton
              size="small"
              onClick={() => {
                setType("update");
                openAutoFiltersModal();
              }}
            >
              <FiFilter color="#475467" width="16px" height="16px" />
            </RectangleIconButton> */}
          </Box>
        </CTableCell>
        <CTableCell className={clsx(styles.tbCell, styles.tbBadgeCell)}>
          <Box
            sx={{
              justifyContent: "center",
              display: "flex",
              gap: "6px",
              alignItems: "center",
            }}
          >
            <label>
              <PermissionCheckbox
                className={clsx(styles.visuallyHidden)}
                control={control}
                name={basePath + ".delete"}
              />
              <span
                className={clsx(styles.label, {
                  [styles.active]: watch(basePath + ".delete") === "Yes",
                })}
              >
                Delete
              </span>
            </label>
            {/* <RectangleIconButton
              size="small"
              onClick={() => {
                setType("delete");
                openAutoFiltersModal();
              }}
            >
              <FiFilter color="#475467" width="16px" height="16px" />
            </RectangleIconButton> */}
          </Box>
        </CTableCell>
        <CTableCell className={styles.tbCell}>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <label>
              <FormCheckbox
                className={styles.visuallyHidden}
                control={control}
                name={basePath + ".is_public"}
              />
              <span
                className={clsx(styles.label, {
                  [styles.active]:
                    typeof watch(basePath + ".is_public") === "string"
                      ? watch(basePath + ".is_public") === "Yes"
                      : watch(basePath + ".is_public"),
                })}
              >
                Public
              </span>
            </label>
          </Box>
        </CTableCell>
        <CTableCell className={styles.tbCell}>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <RectangleIconButton
              className={styles.iconBtn}
              size="lg"
              onClick={openFieldPermissionModal}
            >
              <TableIcon w={"34px"} h={"34px"} />
            </RectangleIconButton>
          </Box>
        </CTableCell>
        <CTableCell className={styles.tbCell}>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <RectangleIconButton
              className={styles.iconBtn}
              size="lg"
              onClick={openActionPermissionsModal}
            >
              <RouteIcon w={"34px"} h={"34px"} />
            </RectangleIconButton>
          </Box>
        </CTableCell>
        <CTableCell className={styles.tbCell}>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <RectangleIconButton
              className={styles.iconBtn}
              size="lg"
              onClick={openRelationPermissionModal}
            >
              <LinkIcon w={"26px"} h={"26px"} />
            </RectangleIconButton>
          </Box>
        </CTableCell>
        <CTableCell className={styles.tbCell}>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <RectangleIconButton
              className={styles.iconBtn}
              size="lg"
              onClick={openTableViewPermissionModal}
            >
              <EyeIcon width={"34px"} height={"34px"} />
            </RectangleIconButton>
          </Box>
        </CTableCell>
        <CTableCell className={styles.tbCell}>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <RectangleIconButton
              className={styles.iconBtn}
              size="lg"
              onClick={openCustomPermissionModal}
            >
              <EditCardIcon width={"34px"} height={"34px"} />
            </RectangleIconButton>
          </Box>
        </CTableCell>
      </CTableHeadRow>

      {autoFiltersModalIsOpen && (
        <AutoFilterModal
          permissionLan={permissionLan}
          control={control}
          closeModal={closeAutoFiltersModal}
          tableIndex={tableIndex}
          type={type}
          setValue={setValue}
          watch={watch}
        />
      )}
      {fieldPermissionModalIsOpen && (
        <FieldPermissions
          permissionLan={permissionLan}
          control={control}
          tableIndex={tableIndex}
          closeModal={closeFieldPermissionModal}
          setValue={setValue}
          watch={watch}
        />
      )}
      {actionPermissionsModalIsOpen && (
        <ActionPermissionModal
          permissionLan={permissionLan}
          control={control}
          closeModal={closeOpenActionPermissionsModal}
          tableIndex={tableIndex}
          type={type}
        />
      )}
      {tableViewPermissionModalIsOpen && (
        <TableViewPermission
          permissionLan={permissionLan}
          control={control}
          closeModal={closeTableViewPermissionModal}
          tableIndex={tableIndex}
          type={type}
        />
      )}
      {relationPermissionModalIsOpen && (
        <RelationPermissionModal
          permissionLan={permissionLan}
          control={control}
          tableIndex={tableIndex}
          closeModal={closeRelationPermissionModal}
        />
      )}
      {customPermissionModalIsOpen && (
        <CustomPermissionModal
          permissionLan={permissionLan}
          control={control}
          closeModal={closeCustomPermissionModal}
          tableIndex={tableIndex}
          type={type}
          setValue={setValue}
          watch={watch}
        />
      )}
    </>
  );
};

export default TableRow;
