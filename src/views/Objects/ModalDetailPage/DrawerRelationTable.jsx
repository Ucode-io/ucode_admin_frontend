import {useQuery} from "react-query";
import {Box, Divider} from "@mui/material";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useFieldArray} from "react-hook-form";
import {listToMap} from "../../../utils/listToMap";
import {useEffect, useMemo, useRef, useState} from "react";
import RelationTable from "../RelationSection/RelationTable";
import constructorTableService from "../../../services/constructorTableService";
import FixColumnsRelationSection from "../RelationSection/FixColumnsRelationSection";
import VisibleColumnsButtonRelationSection from "../RelationSection/VisibleColumnsButtonRelationSection";

const DrawerRelationTable = ({
  selectedTabIndex,
  relations,
  loader,
  id: idFromProps,
  control,
  reset,
  setFormValue,
  watch,
  selectedTab,
  getAllData,
  data,
  tableSlug: tableSlugFromProps,
  handleMouseDown = () => {},
}) => {
  const myRef = useRef();
  const {i18n} = useTranslation();
  const [type, setType] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const {tableSlug: tableSlugFromParams, id: idFromParams, appId} = useParams();
  const [relationsCreateFormVisible, setRelationsCreateFormVisible] = useState(
    {}
  );

  const tableSlug = tableSlugFromProps ?? tableSlugFromParams;
  const id = idFromProps ?? idFromParams;

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
    <>
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

      <Box
        onMouseDown={handleMouseDown}
        sx={{
          position: "absolute",
          height: "calc(100vh - 50px)",
          width: "3px",
          left: 0,
          top: 0,
          cursor: "col-resize",
        }}
      />
    </>
  );
};

export default DrawerRelationTable;
