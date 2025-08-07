import {useState} from "react";
import { useWatch } from "react-hook-form";
import { useMemo } from "react";
import { CTableCell, CTableHeadRow } from "../../../../../components/CTable";
import { Box, Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useMenuPermissionGetByIdQuery } from "../../../../../services/rolePermissionService";
import { store } from "../../../../../store";
import { useTranslation } from "react-i18next";
import styles from "./style.module.scss";
import clsx from "clsx";
import { useSelector } from "react-redux";

const MenuCheckbox = ({ label, onChange, checked }) => {
  return (
    <label>
      <input
        className={styles.visuallyHidden}
        type="checkbox"
        onChange={onChange}
        checked={checked}
      />
      <span
        className={clsx(styles.label, {
          [styles.active]: checked,
        })}
      >
        {label}
      </span>
    </label>
  );
};

const MenuRow = ({
  app,
  appIndex,
  control,
  level = 1,
  setChangedData,
  changedData,
  setValue,
  allMenus,
  childIndex = null,
  watch,
  name = `menus.${appIndex}.children`,
}) => {
  const roleId = useSelector((state) => state.settingsModal.roleId);

  const [tableBlockIsOpen, setTableBlockIsOpen] = useState(false);
  const [parentId, setParentId] = useState("");
  const [data, setData] = useState([]);
  const projectId = store.getState().company.projectId;
  const { i18n } = useTranslation();
  const [innerName, setInnerName] = useState(null);

  const { data: permissionData, isLoading: permissionGetByIdLoading } =
    useMenuPermissionGetByIdQuery({
      projectId: projectId,
      roleId: roleId,
      parentId: parentId,
      queryParams: {
        enabled: !!parentId,
        onSuccess: (res) => {
          // const obj = {};

          // res?.menus?.forEach((item) => {
          //   obj[item?.id] = item.permission;
          // });

          // setCheckBoxValues((prev) => ({ ...prev, ...obj }));

          setData(res?.menus);
          if (!parentId) {
            setValue(`menus`, res?.menus);
          } else {
            if (innerName) {
              setValue(innerName, res?.menus);
            } else {
              setValue(name, res?.menus);
            }
          }
        },
      },
    });

  const renderMenuRows = (items) => {
    return items?.map((item, index) => {
      return (
        <MenuRow
          key={item.id}
          app={item}
          appIndex={appIndex}
          childIndex={index}
          control={control}
          level={level + 1}
          setChangedData={setChangedData}
          changedData={changedData}
          setValue={setValue}
          watch={watch}
          name={
            item.type === "FOLDER"
              ? level === 1
                ? `menus.${appIndex}.children`
                : `${name}.${index}.children`
              : level === 1
                ? `menus.${appIndex}.children.${index}`
                : `${name}.${childIndex}.children.${index}`
          }
        />
      );
    });
  };

  const detectDuplicate = (checked, type) => {
    if (changedData?.find((obj) => obj?.id === app?.id)?.id) {
      const computedData = changedData.map((item) => {
        if (app?.id === item?.id) {
          return {
            ...item,
            permission: {
              ...item.permission,
              [type]: checked,
            },
          };
        } else {
          return item;
        }
      });
      setChangedData(computedData);
    } else {
      setChangedData([
        ...changedData,
        {
          ...app,
          permission: {
            ...app.permission,
            [type]: checked,
          },
        },
      ]);
    }
  };

  const handleChange = (e, type, isFolder) => {
    detectDuplicate(e, type);
    if (childIndex !== null) {
      // setValue(
      //   `menus.${appIndex}.children.${childIndex}.permission.${type}`,
      //   e
      // );
      if (level > 1 && isFolder) {
        setValue(`${name}.${childIndex}.permission.${type}`, e);
      } else {
        setValue(`${name}.permission.${type}`, e);
      }
    } else {
      setValue(`menus.${appIndex}.permission.${type}`, e);
    }
  };

  return (
    <>
      {app?.type === "FOLDER" ? (
        <CTableHeadRow pl={4}>
          <CTableCell
            fontWeight="bold"
            cursor="pointer"
            onClick={() => {
              setTableBlockIsOpen((prev) => !prev);
              setParentId(app?.id);
              if (level > 1) {
                const clickedChildFolderIndex = watch(name)?.findIndex(
                  (item) => item?.id === app?.id
                );
                setInnerName(`${name}.${clickedChildFolderIndex}.children`);
              }
            }}
          >
            <Box
              sx={{
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#475467",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {app?.attributes?.[`label_${i18n?.language}`] ??
                app?.attributes?.[`title_${i18n?.language}`] ??
                app.label}
              <Button
                variant="text"
                style={{
                  padding: "0",
                  justifyContent: "flex-end",
                }}
                disabled
              >
                <ArrowForwardIosIcon
                  style={{
                    transform: `rotate(${tableBlockIsOpen ? 90 : -90}deg)`,
                  }}
                />
              </Button>
            </Box>
          </CTableCell>

          <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
            <MenuCheckbox
              onChange={(e) => {
                handleChange(e.target.checked, "read", true);
              }}
              checked={watch(
                `${level > 1 ? `${name}.${childIndex}` : `menus.${appIndex}`}.permission.read`
              )}
              label="Read"
            />
          </CTableCell>
          <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
            <MenuCheckbox
              onChange={(e) => {
                handleChange(e.target.checked, "write", true);
              }}
              checked={watch(
                `${level > 1 ? `${name}.${childIndex}` : `menus.${appIndex}`}.permission.write`
              )}
              label="Write"
            />
          </CTableCell>
          <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
            <MenuCheckbox
              onChange={(e) => {
                handleChange(e.target.checked, "update", true);
              }}
              checked={watch(
                `${level > 1 ? `${name}.${childIndex}` : `menus.${appIndex}`}.permission.update`
              )}
              label="Update"
            />
          </CTableCell>
          <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
            <MenuCheckbox
              onChange={(e) => {
                handleChange(e.target.checked, "delete", true);
              }}
              checked={watch(
                `${level > 1 ? `${name}.${childIndex}` : `menus.${appIndex}`}.permission.delete`
              )}
              label="Delete"
            />
          </CTableCell>
          <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
            <MenuCheckbox
              onChange={(e) => {
                handleChange(e.target.checked, "menu_settings", true);
              }}
              checked={watch(
                `${level > 1 ? `${name}.${childIndex}` : `menus.${appIndex}`}.permission.menu_settings`
              )}
              label="Settings"
            />
          </CTableCell>
        </CTableHeadRow>
      ) : (
        <CTableHeadRow>
          <CTableCell cursor="pointer">
            <Box
              sx={{
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#475467",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: `${level * 7}px`,
              }}
            >
              {app?.attributes?.[`label_${i18n?.language}`] ??
                app?.attributes?.[`title_${i18n?.language}`] ??
                app.label}
            </Box>
          </CTableCell>
          <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
            <MenuCheckbox
              onChange={(e) => {
                handleChange(e.target.checked, "read");
              }}
              checked={
                level > 1
                  ? watch(`${name}.permission.read`)
                  : watch(`menus.${appIndex}.permission.read`)
                // childIndex !== null
                //   ? watch(
                //       `menus.${appIndex}.children.${childIndex}.permission.read`
                //     )
                //   : watch(`menus.${appIndex}.permission.read`)
              }
              label="Read"
            />
          </CTableCell>
          <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
            <MenuCheckbox
              onChange={(e) => {
                handleChange(e.target.checked, "write");
              }}
              checked={
                level > 1
                  ? watch(`${name}.permission.write`)
                  : watch(`menus.${appIndex}.permission.write`)
                // childIndex !== null
                //   ? watch(
                //       `menus.${appIndex}.children.${childIndex}.permission.write`
                //     )
                //   : watch(`menus.${appIndex}.permission.write`)
              }
              label="Write"
            />
          </CTableCell>
          <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
            <MenuCheckbox
              onChange={(e) => {
                handleChange(e.target.checked, "update");
              }}
              checked={
                level > 1
                  ? watch(`${name}.permission.update`)
                  : watch(`menus.${appIndex}.permission.update`)
                // childIndex !== null
                //   ? watch(
                //       `menus.${appIndex}.children.${childIndex}.permission.update`
                //     )
                //   : watch(`menus.${appIndex}.permission.update`)
              }
              label="Update"
            />
          </CTableCell>
          <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
            <MenuCheckbox
              onChange={(e) => {
                handleChange(e.target.checked, "delete");
              }}
              checked={
                level > 1
                  ? watch(`${name}.permission.delete`)
                  : watch(`menus.${appIndex}.permission.delete`)
                // childIndex !== null
                //   ? watch(
                //       `menus.${appIndex}.children.${childIndex}.permission.delete`
                //     )
                //   : watch(`menus.${appIndex}.permission.delete`)
              }
              label="Delete"
            />
          </CTableCell>
          <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
            <MenuCheckbox
              onChange={(e) => {
                handleChange(e.target.checked, "menu_settings");
              }}
              checked={
                level > 1
                  ? watch(`${name}.permission.menu_settings`)
                  : watch(`menus.${appIndex}.permission.menu_settings`)
                // childIndex !== null
                //   ? watch(
                //       `menus.${appIndex}.children.${childIndex}.permission.menu_settings`
                //     )
                //   : watch(`menus.${appIndex}.permission.menu_settings`)
              }
              label="Settings"
            />
          </CTableCell>
        </CTableHeadRow>
      )}

      {tableBlockIsOpen && renderMenuRows(data)}
    </>
  );
};

export default MenuRow;
