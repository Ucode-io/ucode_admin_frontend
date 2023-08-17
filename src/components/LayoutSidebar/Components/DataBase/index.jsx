import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse } from "@mui/material";
import { useMemo, useState } from "react";
import { useQueries } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import constructorTableService, {
  useTableFolderListQuery,
} from "../../../../services/constructorTableService";
import { useResourceListQuery } from "../../../../services/resourceService";
import { store } from "../../../../store";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import useComputedResource from "../../../../utils/computedTables";
import { tableFolderListToNested } from "../../../../utils/tableFolderListToNestedLIst copy";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import DataBaseRecursive from "./RecursiveBlock";
import { FaFolder } from "react-icons/fa";
import { BsTable } from "react-icons/bs";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const dataBase = {
  label: "Databases",
  type: "USER_FOLDER",
  icon: "database.svg",
  parent_id: adminId,
  id: "15",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const DataBase = ({ level = 1, menuStyle, setSubMenuIsOpen, menuItem }) => {
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const [selected, setSelected] = useState({});
  const [resourceId, setResourceId] = useState("");
  const company = store.getState().company;
  const [openedFolders, setOpenedFolders] = useState([]);
  const navigate = useNavigate();

  const activeStyle = {
    backgroundColor:
      dataBase?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      dataBase?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: level * 2 * 5,
  };

  const labelStyle = {
    color:
      dataBase?.id === menuItem?.id ? menuStyle?.active_text : menuStyle?.text,
  };

  const clickHandler = (e) => {
    e.stopPropagation();
    dispatch(menuActions.setMenuItem(dataBase));
    setSelected(dataBase);
    if (!pinIsEnabled && dataBase.type !== "USER_FOLDER") {
      setSubMenuIsOpen(false);
    }
    setChildBlockVisible((prev) => !prev);
  };

  const { data: { resources } = {} } = useResourceListQuery({
    params: {
      project_id: company.projectId,
    },
  });

  const { data: folders, isLoading: loading } = useTableFolderListQuery({
    queryParams: {
      select: (res) =>
        res?.folders?.map((item) => ({
          name: item?.title,
          icon: FaFolder,
          parent_id: item?.parent_id,
          id: item?.id,
          type: "FOLDER",
          hasChild: true,
        })),
    },
  });

  const fetchTable = useMemo(() => {
    return openedFolders.map((folderId) => ({
      queryKey: [
        "TABLES",
        {
          "folder-id": folderId,
        },
      ],
      queryFn: () =>
        constructorTableService.getList({
          folder_id: folderId,
        }),
    }));
  }, [openedFolders]);

  const tableResults = useQueries(fetchTable);

  const computedTables = useMemo(() => {
    const list = [];
    tableResults?.forEach((table) => {
      table.data?.tables?.forEach((table) => {
        list.push({
          ...table,
          name: table.label,
          icon: BsTable,
          parent_id: table.folder_id,
          type: "TABLE",
        });
      });
    });
    return list;
  }, [tableResults]);

  const computedTableList = useMemo(() => {
    return tableFolderListToNested([...(folders ?? []), ...computedTables], {
      undefinedChildren: true,
    });
  }, [folders, computedTables]);

  const sidebarElements = useMemo(() => computedTableList, [computedTableList]);

  const computedResourceFromUtils = useComputedResource(
    resources,
    sidebarElements
  );

  const rowClickHandler = (id, element) => {
    setSelected(element);
    element.type === "FOLDER" && navigate(`/main/${adminId}`);
    if (element.resource_type) setResourceId(element.id);
    if (element.type !== "FOLDER" || openedFolders.includes(id)) return;
    setOpenedFolders((prev) => [...prev, id]);
  };

  const onSelect = (id, element) => {
    if (element.type === "TABLE") {
      navigate(
        `/main/${adminId}/database/${resourceId}/${element.slug}/${element.id}`
      );
    }
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
            <IconGenerator icon={"database.svg"} size={18} />
            Databases
          </div>
          {childBlockVisible ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )}
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {computedResourceFromUtils?.map((childElement) => (
          <DataBaseRecursive
            key={childElement.id}
            level={level + 1}
            element={childElement}
            menuStyle={menuStyle}
            onRowClick={rowClickHandler}
            onSelect={onSelect}
            selected={selected}
            resourceId={resourceId}
            menuItem={menuItem}
          />
        ))}
      </Collapse>
    </Box>
  );
};

export default DataBase;
