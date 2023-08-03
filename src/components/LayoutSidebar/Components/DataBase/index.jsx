import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse } from "@mui/material";
import { useMemo, useState } from "react";
import { useQueries } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { store } from "../../../../store";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import { useResourceListQuery } from "../../../../services/resourceService";
import constructorTableService, {
  useTableFolderListQuery,
} from "../../../../services/constructorTableService";
import { tableFolderListToNested } from "../../../../utils/tableFolderListToNestedLIst copy";
import useComputedResource from "../../../../utils/computedTables";
import DataBaseRecursive from "./RecursiveBlock";

const dataBase = {
  label: "Databases",
  type: "USER_FOLDER",
  icon: "database.svg",
  parent_id: "12",
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

const DataBase = ({ level = 1, menuStyle, setSubMenuIsOpen }) => {
  const { tableSlug } = useParams();
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const [selected, setSelected] = useState({});
  const [resourceId, setResourceId] = useState("");
  const company = store.getState().company;
  const [openedFolders, setOpenedFolders] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const activeStyle = {
    backgroundColor:
      selected?.id === dataBase?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      selected?.id === dataBase?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: level * 2 * 5,
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
    if (selected && selected?.type === "TABLE") {
      navigate(`/main/12/database/${resourceId}/${element.slug}/${element.id}`);
    }
    setSelected(element);
    if (element.resource_type) setResourceId(element.id);
    if (element.type !== "FOLDER" || openedFolders.includes(id)) return;
    setOpenedFolders((prev) => [...prev, id]);
  };

  return (
    <Box>
      <div className="parent-block column-drag-handle">
        <Button
          style={activeStyle}
          className={`nav-element ${
            dataBase?.isChild &&
            (tableSlug !== dataBase?.slug ? "active-with-child" : "active")
          }`}
          onClick={(e) => {
            clickHandler(e);
          }}
        >
          <div
            className="label"
            style={{
              color:
                selected?.id === dataBase?.id
                  ? menuStyle?.active_text
                  : menuStyle?.text,
            }}
          >
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
            selected={selected}
            resourceId={resourceId}
          />
        ))}
      </Collapse>
    </Box>
  );
};

export default DataBase;
