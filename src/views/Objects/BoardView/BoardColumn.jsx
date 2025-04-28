import {Add} from "@mui/icons-material";
import {Button, IconButton} from "@mui/material";
import {useEffect, useMemo} from "react";
import {useState} from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import BoardCardRowGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator";
import constructorObjectService from "../../../services/constructorObjectService";
import { applyDrag, applyDragIndex } from "../../../utils/applyDrag";
import styles from "./style.module.scss";
import BoardPhotoGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator/BoardPhotoGenerator";
import BoardModalDetailPage from "./components/BoardModaleDetailPage";
import MultiselectCellColoredElement from "../../../components/ElementGenerators/MultiselectCellColoredElement";
import DrawerDetailPage from "../DrawerDetailPage";
import { useProjectGetByIdQuery } from "../../../services/projectService";
import { useSelector } from "react-redux";
import layoutService from "../../../services/layoutService";
import MaterialUIProvider from "../../../providers/MaterialUIProvider";

const BoardColumn = ({
  tab,
  data = [],
  fieldsMap,
  view = {},
  computedColumnsFor,
  menuItem,
  layoutType,
  setLayoutType,
}) => {
  const projectId = useSelector((state) => state.company?.projectId);
  const selectedGroupField = fieldsMap?.[view?.group_fields?.[0]];

  const isStatusType = selectedGroupField?.type === "STATUS";

  const { tableSlug, appId } = useParams();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState();
  const [index, setIndex] = useState();

  const [dateInfo, setDateInfo] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [defaultValue, setDefaultValue] = useState(null);

  const [openDrawerModal, setOpenDrawerModal] = useState(false);
  const [computedData, setComputedData] = useState(
    data.filter((el) => {
      if (isStatusType) {
        return el?.[selectedGroupField?.slug];
      } else {
        if (Array.isArray(el[tab.slug]))
          return el[tab.slug].includes(tab.value);
        return el[tab.slug] === tab.value;
      }
    })
  );

  const [selectedViewType, setSelectedViewType] = useState(
    localStorage?.getItem("detailPage") === "FullPage"
      ? "SidePeek"
      : localStorage?.getItem("detailPage")
  );

  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });

  const { mutate } = useMutation(
    ({ data, index }) => {
      const mutateData = {
        ...data,
        board_order: index + 1,
      };

      if (isStatusType) {
        mutateData[selectedGroupField?.slug] = tab.value;
      } else {
        mutateData[tab.slug] = tab.value;
      }

      return constructorObjectService.update(tableSlug, {
        data: mutateData,
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
      },
    }
  );

  const {
    data: { layout } = {
      layout: [],
    },
  } = useQuery({
    queryKey: [
      "GET_LAYOUT",
      {
        tableSlug,
      },
    ],
    queryFn: () => {
      return layoutService.getLayout(tableSlug, appId);
    },
    select: (data) => {
      return {
        layout: data ?? {},
      };
    },
    onError: (error) => {
      console.error("Error", error);
    },
  });

  const onDrop = (dropResult) => {
    const result = applyDrag(computedData, dropResult);
    if (result) setComputedData(result);
    setIndex(dropResult?.addedIndex);
    if (result?.length > computedData?.length) {
      mutate({ data: dropResult.payload, index: dropResult.addedIndex });
    } else if (result?.length === computedData?.length) {
      mutate({ data: dropResult.payload, index: dropResult.addedIndex });
    }
  };

  const viewFields = useMemo(() => {
    return view.columns?.map((id) => fieldsMap[id]).filter((el) => el) ?? [];
  }, [view, fieldsMap, data]);

  useEffect(() => {
    setComputedData(
      data.filter((el) => {
        if (isStatusType) {
          return el?.[selectedGroupField?.slug] === tab?.label;
        } else {
          if (Array.isArray(el[tab.slug]))
            return el[tab.slug].includes(tab.value);
          return el[tab.slug] === tab.value;
        }
      })
    );
  }, [data]);

  const navigateToEditPage = (el) => {
    setOpenDrawerModal(true);
    setSelectedRow(el);
    setDateInfo({});
  };
  const navigateToCreatePage = (slug) => {
    setOpenDrawerModal(true);
    setSelectedRow(null);
    setDefaultValue({
      field: tab.slug,
      value: [tab.value],
    });
  };
  const field = computedColumnsFor?.find((field) => field?.slug === tab?.slug);

  const hasColor = tab?.color || field?.attributes?.has_color;
  const color =
    tab?.color ||
    field?.attributes?.options?.find((item) => item?.value === tab?.value)
      ?.color;

  const refetch = () => {
    queryClient.refetchQueries(["GET_OBJECTS_LIST_WITH_RELATIONS"]);
    queryClient.refetchQueries(["GET_TABLE_INFO"]);
  };

  return (
    <>
      <div className={styles.column}>
        <div className={`${styles.columnHeaderBlock} column-header`}>
          <div className={styles.leftSide}>
            <div className={styles.title}>
              <span
                style={{
                  background: hasColor ? color + 33 : "rgb(139, 150, 160)",
                  color: hasColor ? color - 50 : "rgb(139, 150, 160)",
                }}
                className={styles.tabBlockStatus}
              >
                <span
                  className={styles.dot}
                  style={{ background: color }}
                ></span>
                {tab.label}
              </span>
              {/* <MultiselectCellColoredElement
                className={styles.tabBlockStatus}
                {...tab}
                field={computedColumnsFor?.find(
                  (field) => field?.slug === tab?.slug
                )}
              /> */}
              {/* {tab.label} */}
            </div>
            <div className={styles.counter}>{computedData?.length ?? 0}</div>
          </div>
          <div className={styles.rightSide}>
            <IconButton
              className={styles.addButton}
              color="inherit"
              onClick={(e) => {
                e.stopPropagation();
                navigateToCreatePage();
              }}
            >
              <Add />
            </IconButton>
          </div>
        </div>

        <Container
          groupName="subtask"
          getChildPayload={(i) => computedData[i]}
          onDrop={(e) => {
            onDrop(e);
          }}
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
          style={{
            padding: "0 8px",
          }}
        >
          {computedData.map((el) => (
            <Draggable
              key={el.guid}
              index={index}
              className={styles.cardWrapper}
            >
              <div
                className={styles.card}
                key={el.guid}
                onClick={() => navigateToEditPage(el)}
              >
                {viewFields.map((field) => (
                  <BoardPhotoGenerator key={field.id} field={field} el={el} />
                ))}
                {viewFields.map((field) => (
                  <BoardCardRowGenerator
                    key={field.id}
                    isStatus={field?.type === "STATUS"}
                    field={field}
                    el={el}
                    fieldsMap={fieldsMap}
                    slug={selectedGroupField?.slug}
                  />
                ))}
              </div>
            </Draggable>
          ))}
        </Container>

        <div className={styles.columnFooterBlock}>
          <Button
            style={{ height: "41px" }}
            id={`addBoardItem`}
            variant="contain"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              navigateToCreatePage();
            }}
          >
            <Add /> Add new
          </Button>
        </div>
      </div>
      <MaterialUIProvider>
        <DrawerDetailPage
          projectInfo={projectInfo}
          open={openDrawerModal}
          setOpen={setOpenDrawerModal}
          selectedRow={selectedRow}
          menuItem={menuItem}
          layout={layout}
          fieldsMap={fieldsMap}
          // refetch={refetch}
          setLayoutType={setLayoutType}
          selectedViewType={selectedViewType}
          setSelectedViewType={setSelectedViewType}
          navigateToEditPage={() => {}}
          dateInfo={dateInfo}
          defaultValue={defaultValue}
        />
      </MaterialUIProvider>
      {/* <BoardModalDetailPage
        open={open}
        setOpen={setOpen}
        dateInfo={dateInfo}
        selectedRow={selectedRow}
      /> */}
    </>
  );
};

export default BoardColumn;
