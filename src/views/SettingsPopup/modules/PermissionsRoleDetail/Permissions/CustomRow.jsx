import { CTableCell, CTableHeadRow } from "@/components/CTable";
import { Box, Button } from "@mui/material";
import clsx from "clsx";
import styles from "./style.module.scss";
import { useState } from "react";
import request from "@/utils/request";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { showAlert } from "@/store/alert/alert.thunk";

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

const CustomRow = ({
  item,
  index,
  setValue,
  watch,
  handleUpdate,
  activeRoleId,
  activeClientType,
  name = `custom.${index}`,
  level = 0,
  setIsAddModalOpen,
  setSelectedRow,
  handleDelete = () => { },

  getValues,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const dispatch = useDispatch();

  const children = watch(`${name}.children`);

  const localHandleDelete = (e) => {
    e.stopPropagation();
    request
      .delete(`/custom-permission/${item.custom_permission_id}`)
      .then(() => {
        dispatch(showAlert("Successfully deleted", "success"));
        const pathParts = name.split(".");
        const indexToDelete = parseInt(pathParts.pop(), 10);
        const parentPath = pathParts.join(".");

        const parentList = getValues(parentPath);
        if (Array.isArray(parentList)) {
          const updatedList = parentList.filter(
            (_, idx) => idx !== indexToDelete
          );
          setValue(parentPath, updatedList);
        }
      });
  };

  const handleExpand = () => {
    if (expanded) {
      setExpanded(false);
      return;
    }

    setExpanded(true);

    if (!children) {
      setIsLoadingChildren(true);
      request
        .get(
          `/custom-permission/accesses?role_id=${activeRoleId}&client_type_id=${activeClientType?.id}&parent_id=${item.custom_permission_id}`,
        )
        .then((res) => {
          setValue(`${name}.children`, res?.permissions || []);
        })
        .finally(() => {
          setIsLoadingChildren(false);
        });
    }
  };

  const handleChange = (checked, type) => {
    // Determine the value to set based on checked state
    // "Yes" for checked, "No" for unchecked
    const value = checked ? "Yes" : "No";
    setValue(`${name}.${type}`, value);
    handleUpdate(checked, type, item);
  };

  const getValue = (type) => {
    return watch(`${name}.${type}`) === "Yes";
  };

  return (
    <>
      <CTableHeadRow>
        <CTableCell>
          <Box
            sx={{
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "20px",
              color: "#475467",
              display: "flex",
              alignItems: "center",
              paddingLeft: `${level * 20}px`,
            }}
          >
            {/* <span>
                            <IconGenerator
                                icon={icon || "folder-new.svg"}
                                size={16}
                                style={{ color: "#475467" }}
                            />
                        </span> */}
            <span style={{ marginLeft: "10px" }}>{item.title}</span>

            <Box ml="auto" display="flex" alignItems="center">
              <Button
                variant="text"
                style={{
                  padding: "4px",
                  minWidth: "auto",
                  marginRight: "8px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRow({ ...item, _formPath: name });
                  setIsAddModalOpen(true);
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="#667085"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>

              <Button
                variant="text"
                style={{
                  padding: "4px",
                  minWidth: "auto",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpand();
                }}
              >
                <ArrowForwardIosIcon
                  style={{
                    transform: `rotate(${expanded ? 90 : -90}deg)`,
                    width: "16px",
                    height: "16px",
                    color: "#667085",
                  }}
                />
              </Button>
            </Box>
          </Box>
        </CTableCell>
        <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
          <MenuCheckbox
            onChange={(e) => handleChange(e.target.checked, "read")}
            checked={getValue("read")}
            label="Read"
          />
        </CTableCell>
        <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
          <MenuCheckbox
            onChange={(e) => handleChange(e.target.checked, "write")}
            checked={getValue("write")}
            label="Write"
          />
        </CTableCell>
        <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
          <MenuCheckbox
            onChange={(e) => handleChange(e.target.checked, "update")}
            checked={getValue("update")}
            label="Update"
          />
        </CTableCell>
        <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
          <MenuCheckbox
            onChange={(e) => handleChange(e.target.checked, "delete")}
            checked={getValue("delete")}
            label="Delete"
          />
        </CTableCell>
        <CTableCell className={clsx(styles.tbBadgeCell, styles.tbCell)}>
          <Button onClick={localHandleDelete}>
            <DeleteIcon htmlColor="#ff4825" />
          </Button>
        </CTableCell>
      </CTableHeadRow>
      {expanded &&
        children?.map((child, i) => (
          <CustomRow
            key={child.custom_permission_id || i}
            item={child}
            index={i}
            setValue={setValue}
            watch={watch}
            handleUpdate={handleUpdate}
            activeRoleId={activeRoleId}
            activeClientType={activeClientType}
            name={`${name}.children.${i}`}
            level={level + 1}
            setIsAddModalOpen={setIsAddModalOpen}
            setSelectedRow={setSelectedRow}

            handleDelete={handleDelete}
            getValues={getValues}
          />
        ))}
    </>
  );
};

export default CustomRow;
