import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { useMemo } from "react";
import { CTableCell, CTableHeadRow } from "../../../../../components/CTable";
import { Box, Button, CircularProgress } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useMenuPermissionGetByIdQuery } from "../../../../../services/rolePermissionService";
import { store } from "../../../../../store";
import { useTranslation } from "react-i18next";
import styles from "./style.module.scss";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import IconGeneratorIconjs from "../../../../../components/IconPicker/IconGeneratorIconjs";
import IconGenerator from "../../../../../components/IconPicker/IconGenerator";
import menuSettingsService from "../../../../../services/menuSettingsService";
import { useQuery } from "react-query";
import { menuAccordionActions } from "../../../../../store/menus/menus.slice";
import { useMenuListQuery } from "../../../../../services/menuService";

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
  icon,
  getValues,
  activeRoleId,
}) => {
  const dispatch = useDispatch();

  const roleId = useSelector((state) => state.settingsModal.roleId);
  const menuChilds = useSelector((state) => state?.menuAccordion?.menuChilds);

  const [tableBlockIsOpen, setTableBlockIsOpen] = useState(false);
  const [parentId, setParentId] = useState("");
  const [data, setData] = useState([]);
  const projectId = store.getState().company.projectId;
  const { i18n } = useTranslation();
  const [innerName, setInnerName] = useState(null);

  function computeMenuChilds(id, children = []) {
    const updated = { ...menuChilds };
    updated[id] = { children };
    dispatch(menuAccordionActions.toggleMenuChilds(updated));
  }

  const { isLoading: permissionGetByIdLoading } = useMenuListQuery({
    params: {
      parent_id: parentId,
      role_id: activeRoleId,
    },
    queryParams: {
      enabled: !!parentId,
      onSuccess: (res) => {
        setData(
          res.menus?.map((item) => ({
            ...item,
            permission: item?.data?.permission,
          }))
        );
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

  // const { data: permissionData, isLoading: permissionGetByIdLoading } =
  //   useMenuPermissionGetByIdQuery({
  //     projectId: projectId,
  //     roleId: roleId,
  //     parentId: parentId,
  //     queryParams: {
  //       enabled: !!parentId,
  //       onSuccess: (res) => {
  //         console.log({ res }, "OLD");
  //         // const obj = {};

  //         // res?.menus?.forEach((item) => {
  //         //   obj[item?.id] = item.permission;
  //         // });

  //         // setCheckBoxValues((prev) => ({ ...prev, ...obj }));

  //         setData(res?.menus);
  //         if (!parentId) {
  //           setValue(`menus`, res?.menus);
  //         } else {
  //           if (innerName) {
  //             setValue(innerName, res?.menus);
  //           } else {
  //             setValue(name, res?.menus);
  //           }
  //         }
  //       },
  //     },
  //   });

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
          icon={item?.icon}
          getValues={getValues}
          activeRoleId={activeRoleId}
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
            data: {
              ...item.data,
              permission: {
                ...item.data.permission,
                [type]: checked,
              },
            },
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
          data: {
            ...app.data,
            permission: {
              ...app.permission,
              [type]: checked,
            },
          },
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
        console.log(`${name}.${childIndex}.data.permission.${type}`, e);
        setValue(`${name}.${childIndex}.data.permission.${type}`, e);
      } else {
        setValue(`${name}.data.permission.${type}`, e);
      }
    } else {
      setValue(`menus.${appIndex}.data.permission.${type}`, e);
    }
  };

  function isValidUrl(str) {
    try {
      const url = new URL(str);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

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
            className={styles.tableHeadCell}
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
                paddingLeft: `${level > 1 ? level * 7 : 0}px`,
              }}
            >
              <span>
                {icon?.includes(":") ? (
                  <IconGeneratorIconjs
                    icon={
                      !icon || icon === "folder.svg" ? "folder-new.svg" : icon
                    }
                    size={16}
                    style={{
                      color: "#475467",
                    }}
                  />
                ) : isValidUrl(icon) ? (
                  <img width={"24px"} height={"24px"} src={icon} />
                ) : (
                  <IconGenerator
                    icon={
                      !icon || icon === "folder.svg" ? "folder-new.svg" : icon
                    }
                    size={16}
                    style={{
                      color: "#475467",
                    }}
                  />
                )}
              </span>
              <span style={{ marginLeft: "10px" }}>
                {app?.attributes?.[`label_${i18n?.language}`] ??
                  app?.attributes?.[`title_${i18n?.language}`] ??
                  app.label}
              </span>
              <Button
                variant="text"
                style={{
                  padding: "0",
                  justifyContent: "flex-end",
                  marginLeft: "auto",
                }}
                disabled
              >
                {permissionGetByIdLoading ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : (
                  <ArrowForwardIosIcon
                    style={{
                      transform: `rotate(${tableBlockIsOpen ? 90 : -90}deg)`,
                    }}
                  />
                )}
              </Button>
            </Box>
          </CTableCell>

          <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
            <MenuCheckbox
              onChange={(e) => {
                handleChange(e.target.checked, "read", true);
              }}
              checked={watch(
                `${level > 1 ? `${name}.${childIndex}` : `menus.${appIndex}`}.data.permission.read`
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
                `${level > 1 ? `${name}.${childIndex}` : `menus.${appIndex}`}.data.permission.write`
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
                `${level > 1 ? `${name}.${childIndex}` : `menus.${appIndex}`}.data.permission.update`
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
                `${level > 1 ? `${name}.${childIndex}` : `menus.${appIndex}`}.data.permission.delete`
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
                `${level > 1 ? `${name}.${childIndex}` : `menus.${appIndex}`}.data.permission.menu_settings`
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
                alignItems: "center",
                paddingLeft: `${level > 1 ? level * 7 : 0}px`,
              }}
            >
              <span>
                {icon?.includes(":") ? (
                  <IconGeneratorIconjs
                    icon={
                      !icon || icon === "folder.svg" ? "folder-new.svg" : icon
                    }
                    size={16}
                    style={{
                      color: "#475467",
                    }}
                  />
                ) : isValidUrl(icon) ? (
                  <img width={"24px"} height={"24px"} src={icon} />
                ) : (
                  <IconGenerator
                    icon={
                      !icon || icon === "folder.svg" ? "folder-new.svg" : icon
                    }
                    size={16}
                    style={{
                      color: "#475467",
                    }}
                  />
                )}
              </span>
              <span style={{ marginLeft: "10px" }}>
                {app?.attributes?.[`label_${i18n?.language}`] ??
                  app?.attributes?.[`title_${i18n?.language}`] ??
                  app.label}
              </span>
            </Box>
          </CTableCell>
          <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
            <MenuCheckbox
              onChange={(e) => {
                handleChange(e.target.checked, "read");
              }}
              checked={
                level > 1
                  ? watch(`${name}.data.permission.read`)
                  : watch(`menus.${appIndex}.data.permission.read`)
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
                  ? watch(`${name}.data.permission.write`)
                  : watch(`menus.${appIndex}.data.permission.write`)
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
                  ? watch(`${name}.data.permission.update`)
                  : watch(`menus.${appIndex}.data.permission.update`)
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
                  ? watch(`${name}.data.permission.delete`)
                  : watch(`menus.${appIndex}.data.permission.delete`)
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
                  ? watch(`${name}.data.permission.menu_settings`)
                  : watch(`menus.${appIndex}.data.permission.menu_settings`)
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
