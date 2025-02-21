import {InsertDriveFile} from "@mui/icons-material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Backdrop,
  Box,
  Button,
  Card,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import {useEffect, useMemo, useRef, useState} from "react";
import {useFieldArray} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {useParams, useSearchParams} from "react-router-dom";
import {Container, Draggable} from "react-smooth-dnd";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import styles from "./style.module.scss";
import constructorTableService from "../../../services/constructorTableService";
import layoutService from "../../../services/layoutService";
import RelationTable from "../RelationSection/RelationTable";
import {listToMap} from "../../../utils/listToMap";
import FixColumnsRelationSection from "../RelationSection/FixColumnsRelationSection";
import VisibleColumnsButtonRelationSection from "../RelationSection/VisibleColumnsButtonRelationSection";

const DrawerRelationTable = ({
  selectedTabIndex,
  relations,
  loader,
  tableSlug: tableSlugFromProps,
  id: idFromProps,
  control,
  reset,
  setFormValue,
  watch,
  selectedTab,
  getAllData,
  data,
}) => {
  const {i18n} = useTranslation();
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [type, setType] = useState(null);
  const myRef = useRef();
  const {tableSlug: tableSlugFromParams, id: idFromParams, appId} = useParams();
  const tableSlug = tableSlugFromProps ?? tableSlugFromParams;
  const id = idFromProps ?? idFromParams;

  const [relationsCreateFormVisible, setRelationsCreateFormVisible] = useState(
    {}
  );

  const getRelatedTabeSlug = useMemo(() => {
    return relations?.find((el) => el?.id === selectedTab?.relation_id);
  }, [relations, selectedTab]);

  const relatedTableSlug = getRelatedTabeSlug?.relatedTable;

  const {fields, remove, update} = useFieldArray({
    control,
    name: "multi",
  });

  const setCreateFormVisible = (relationId, value) => {
    setRelationsCreateFormVisible((prev) => ({
      ...prev,
      [relationId]: value,
    }));
  };

  useEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    setSelectedObjects([]);
    setFormVisible(false);
  }, [selectedTabIndex]);

  useEffect(() => {
    setRelationsCreateFormVisible({
      [data?.id]: false,
    });
  }, [data]);

  const {
    data: {fieldsMap} = {
      views: [],
      fieldsMap: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", relatedTableSlug, i18n?.language],
    () => {
      return constructorTableService.getTableInfo(
        relatedTableSlug,
        {
          data: {},
        },
        {
          language_setting: i18n?.language,
        }
      );
    },
    {
      enabled: Boolean(relatedTableSlug),
      select: ({data}) => {
        return {
          fieldsMap: listToMap(data?.fields),
        };
      },
      enabled: !!relatedTableSlug,
    }
  );

  return (
    <Box sx={{height: "100vh"}}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "flex-end",
          borderBottom: "1px solid #eee",
        }}>
        <FixColumnsRelationSection
          relatedTable={getRelatedTabeSlug}
          fieldsMap={fieldsMap}
          getAllData={getAllData}
        />
        <Divider orientation="vertical" flexItem />
        <VisibleColumnsButtonRelationSection
          currentView={getRelatedTabeSlug}
          fieldsMap={fieldsMap}
          getAllData={getAllData}
          // getLayoutList={getLayoutList}
          selectedTabIndex={selectedTabIndex}
          data={data}
        />
      </Box>
      <RelationTable
        ref={myRef}
        loader={loader}
        remove={remove}
        reset={reset}
        selectedTabIndex={selectedTabIndex}
        watch={watch}
        selectedTab={selectedTab}
        control={control}
        setFormValue={setFormValue}
        fields={fields}
        setFormVisible={setFormVisible}
        formVisible={formVisible}
        key={selectedTab.id}
        relation={relations}
        getRelatedTabeSlug={getRelatedTabeSlug}
        createFormVisible={relationsCreateFormVisible}
        setCreateFormVisible={setCreateFormVisible}
        selectedObjects={selectedObjects}
        setSelectedObjects={setSelectedObjects}
        tableSlug={tableSlug}
        removableHeight={140}
        id={id}
        getAllData={getAllData}
        type={type}
        layoutData={data}
      />
    </Box>
  );
};

export default DrawerRelationTable;
