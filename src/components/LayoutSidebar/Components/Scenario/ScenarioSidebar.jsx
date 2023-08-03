import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse } from "@mui/material";
import { useMemo, useState } from "react";
import { FaFolder } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  useScenarioCategoryDeleteMutation,
  useScenarioCategoryListQuery,
} from "../../../../services/scenarioCategory";
import {
  useScenarioDeleteMutation,
  useScenarioListQuery,
} from "../../../../services/scenarioService";
import { store } from "../../../../store";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import ScenarioRecursive from "./RecursiveBlock";

const scenarioFolder = {
  label: "Scenarios",
  type: "USER_FOLDER",
  icon: "scenario.svg",
  parent_id: "12",
  id: "16",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const ScenarioSidebar = ({ level = 1, menuStyle, setSubMenuIsOpen }) => {
  const { tableSlug } = useParams();
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
      selected?.id === scenarioFolder?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      selected?.id === scenarioFolder?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: level * 2 * 5,
  };

  const clickHandler = (e) => {
    e.stopPropagation();
    dispatch(menuActions.setMenuItem(scenarioFolder));
    setSelected(scenarioFolder);
    if (!pinIsEnabled && scenarioFolder.type !== "USER_FOLDER") {
      setSubMenuIsOpen(false);
    }
    setChildBlockVisible((prev) => !prev);
  };

  const rowClickHandler = (id, element) => {
    if (selected && selected?.type === "DAG") {
      navigate(`/main/12/scenario/${id}`);
    }
    setSelected(element);
    if (element.type !== "FOLDER" || openedFolders.includes(id)) return;
    setOpenedFolders((prev) => [...prev, id]);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const {
    data: category = [],
    isLoading: formLoading,
    refetch: refetchCategory,
  } = useScenarioCategoryListQuery({});
  const {
    data: scenario = [],
    isLoading: scenarioLoading,
    refetch,
  } = useScenarioListQuery();

  const deleteEndpointClickHandler = (id) => {
    deleteScenario({
      id,
      envId: company.environmentId,
      projectId: company.projectId,
    });
  };
  console.log("category", category);

  const { mutate: deleteScenario, deleteScenarioLoading } =
    useScenarioDeleteMutation({
      onSuccess: () => {
        refetch();
      },
    });

  const { mutate: deleteCategory } = useScenarioCategoryDeleteMutation({
    onSuccess: () => refetchCategory(),
  });
  const onDeleteCategory = (id) => {
    deleteCategory({
      id,
      envId: company.environmentId,
      projectId: company.projectId,
    });
  };
  const computedElements = useMemo(
    () =>
      category?.categories?.map((category) => ({
        icon: FaFolder,
        name: category.name,
        id: category.guid,
        type: "FOLDER",
        // buttons: (
        //   <>
        //     <ApiDeleteButton onClick={() => onDeleteCategory(category.guid)} />
        //     <ApiCreateButton
        //       onClick={() => {
        //         navigate(
        //           `/project/${projectId}/scenarios/${category.guid}/create`
        //         );
        //         closeSidebar();
        //       }}
        //     />
        //   </>
        // ),
        children: scenario?.DAGs?.filter(
          (dag) => dag.category_id === category.guid
        ).map((dag) => ({
          ...dag,
          //   icon: WebPagesIcon,
          id: dag.id,
          name: dag.title,
          type: "DAG",
          //   buttons: (
          //     <ApiDeleteButton
          //       onClick={(e) => {
          //         deleteEndpointClickHandler(dag.id);
          //       }}
          //     />
          //   ),
        })),
      })),
    [category, scenario, company.projectId, navigate]
  );

  const sidebarElements = [
    {
      name: "SCENARIO",
      id: 1,
      children: computedElements,
      type: "FOLDER",
      //   buttons: (
      //     <>
      //       <IconButton
      //         variant="ghost"
      //         colorScheme="whiteAlpha"
      //         icon={<AiFillFolderAdd size={20} />}
      //         onClick={() => {
      //           openApiCategoryModal({}, "CREATE");
      //         }}
      //       />
      //     </>
      //   ),
    },
  ];
  console.log("computedElements", computedElements);

  return (
    <Box>
      <div className="parent-block column-drag-handle">
        <Button
          style={activeStyle}
          className={`nav-element ${
            scenarioFolder?.isChild &&
            (tableSlug !== scenarioFolder?.slug
              ? "active-with-child"
              : "active")
          }`}
          onClick={(e) => {
            clickHandler(e);
          }}
        >
          <div
            className="label"
            style={{
              color:
                selected?.id === scenarioFolder?.id
                  ? menuStyle?.active_text
                  : menuStyle?.text,
            }}
          >
            <IconGenerator icon={"film.svg"} size={18} />
            Scenarios
          </div>
          {childBlockVisible ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )}
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {computedElements?.map((childElement) => (
          <ScenarioRecursive
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

export default ScenarioSidebar;
