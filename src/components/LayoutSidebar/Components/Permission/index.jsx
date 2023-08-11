import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse } from "@mui/material";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import clientTypeServiceV2 from "../../../../services/auth/clientTypeServiceV2";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import RecursiveBlock from "../../SidebarRecursiveBlock/RecursiveBlockComponent";
import "../../style.scss";

const permissionFolder = {
  label: "Permissions",
  type: "USER_FOLDER",
  icon: "lock.svg",
  parent_id: "12",
  id: "14",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const Permissions = ({ level = 1, menuStyle, menuItem, setElement }) => {
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [child, setChild] = useState();
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  const activeStyle = {
    backgroundColor:
      permissionFolder?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      permissionFolder?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: level * 2 * 5,
    display:
      menuItem?.id === "0" ||
      (menuItem?.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const labelStyle = {
    color:
      permissionFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
  };

  const { isLoading } = useQuery(
    ["GET_CLIENT_TYPE_LIST"],
    () => {
      return clientTypeServiceV2.getList();
    },
    {
      cacheTime: 10,
      enabled: false,
      onSuccess: (res) => {
        setChild(
          res.data.response?.map((row) => ({
            ...row,
            type: "PERMISSION",
            id: row.guid,
            parent_id: "13",
            data: {
              permission: {
                read: true,
              },
            },
          }))
        );
      },
    }
  );

  const clickHandler = (e) => {
    e.stopPropagation();
    setSelected(permissionFolder);
    queryClient.refetchQueries("GET_CLIENT_TYPE_LIST");
    setChildBlockVisible((prev) => !prev);
    dispatch(menuActions.setMenuItem(permissionFolder));
  };

  return (
    <Box>
      <div className="parent-block column-drag-handle">
        <Button
          style={activeStyle}
          className="nav-element"
          onClick={(e) => {
            clickHandler(e);
          }}
        >
          <div className="label" style={labelStyle}>
            <IconGenerator icon={"lock.svg"} size={18} />
            Permissions
          </div>
          {childBlockVisible ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )}
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {child?.map((childElement) => (
          <RecursiveBlock
            key={childElement.id}
            level={level + 1}
            element={childElement}
            menuStyle={menuStyle}
            menuItem={menuItem}
            setElement={setElement}
          />
        ))}
      </Collapse>
    </Box>
  );
};

export default Permissions;
