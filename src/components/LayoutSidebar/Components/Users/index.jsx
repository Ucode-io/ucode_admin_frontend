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
import { updateLevel } from "../../../../utils/level";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const userFolder = {
  label: "Users",
  type: "USER_FOLDER",
  icon: "users.svg",
  parent_id: "a8de4296-c8c3-48d6-bef0-ee17057733d6",
  id: "13",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const Users = ({ level = 1, menuStyle, menuItem, setElement }) => {
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [child, setChild] = useState();
  const queryClient = useQueryClient();

  const activeStyle = {
    backgroundColor:
      userFolder?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      userFolder?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
    display:
      menuItem?.id === "0" ||
      (menuItem?.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };
  const labelStyle = {
    color:
      userFolder?.id === menuItem?.id
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
            type: "USER",
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
    dispatch(menuActions.setMenuItem(userFolder));
    e.stopPropagation();
    queryClient.refetchQueries("GET_CLIENT_TYPE_LIST");
    setChildBlockVisible((prev) => !prev);
  };

  const handleGetClientType = (e) => {
    e.stopPropagation();
    queryClient.refetchQueries("GET_CLIENT_TYPE_LIST");
    dispatch(menuActions.setMenuItem(userFolder));
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
            <IconGenerator icon={"users.svg"} size={18} />
            Users
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
            onClick={() => {
              handleGetClientType();
            }}
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

export default Users;
