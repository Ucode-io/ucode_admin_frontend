import {Box} from "@mui/material";
import React, {useMemo, useState} from "react";
import DetailPageTableBody from "./DetailPageTableBody";
import constructorTableService from "../../../../services/constructorTableService";
import {useTranslation} from "react-i18next";
import {listToMap} from "../../../../utils/listToMap";
import {useQuery} from "react-query";
import styles from "./style.module.scss";
import constructorObjectService from "../../../../services/constructorObjectService";
import useRelationTabRouter from "../../../../hooks/useRelationTabRouter";
import {useSearchParams} from "react-router-dom";
import {useMenuGetByIdQuery} from "../../../../services/menuService";
import DetailRelationVisibleColumns from "./DetailRelationVisibleColumns";
import AddIcon from "@mui/icons-material/Add";
import {useForm} from "react-hook-form";

function DetailPageTable({field, selectedTab}) {
  const {i18n} = useTranslation();
  const relatedTableSlug = field?.attributes?.table_from?.slug;
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [addRow, setAddRow] = useState(false);
  const open = Boolean(anchorEl);

  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);
  const menuId = searchParams.get("menuId");
  const {navigateToRelationForm} = useRelationTabRouter();

  const handleColumnClick = (e) => setAnchorEl(e.currentTarget);
  const handleColumnClose = () => setAnchorEl(null);
  const handleAddRowClick = () => setAddRow(!addRow);

  const {
    handleSubmit,
    control,
    setValue: setFormValue,
    formState: {errors},
  } = useForm({});

  const params = {
    language_setting: i18n?.language,
  };
  const {
    data: {fieldsMap, views, fields} = {
      views: [],
      fields: [],
      fieldsMap: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS_LIST", i18n?.language, relatedTableSlug],
    () => {
      return constructorTableService.getTableInfo(
        relatedTableSlug,
        {
          data: {},
        },
        params
      );
    },
    {
      enabled: Boolean(relatedTableSlug),
      select: ({data}) => {
        return {
          fields: data?.fields,
          fieldsMap: listToMap(data?.fields),
          views: data?.views,
        };
      },
    }
  );

  const computedView = useMemo(() => {
    return views?.find((el) => el?.table_slug === relatedTableSlug);
  }, [field, views]);

  const {
    data: {tableData = [], count} = {},
    refetch,
    isLoading: dataFetchingLoading,
  } = useQuery(
    [
      "GET_OBJECT_LIST",
      relatedTableSlug,
      {
        offset: offset,
        limit,
      },
    ],
    () => {
      return constructorObjectService.getList(
        relatedTableSlug,
        {
          data: {
            offset: offset,
            limit: limit,
          },
        },
        {
          language_setting: i18n?.language,
        }
      );
    },
    {
      select: ({data}) => {
        const count = data?.count;
        const tableData = data?.response ?? [];
        const pageCount = isNaN(data?.count) || tableData.length === 0;

        return {
          count,
          tableData,
          pageCount,
        };
      },
    }
  );

  const {loader: menuLoader} = useMenuGetByIdQuery({
    menuId: searchParams.get("menuId"),
    queryParams: {
      enabled: Boolean(searchParams.get("menuId")),
      onSuccess: (res) => {
        setMenuItem(res);
      },
    },
  });

  const computedColumn = useMemo(() => {
    return fields?.filter((item) => {
      if (item?.type === "LOOKUP" || item?.type === "LOOKUPS") {
        return computedView?.columns?.includes(item?.relation_id);
      } else {
        return computedView?.columns?.includes(item?.id);
      }
    });
  }, [fields, computedView]);

  return (
    <Box sx={{overflow: "auto"}}>
      <Box
        sx={{
          padding: "14px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}>
        <button
          onClick={() => {
            navigateToRelationForm(relatedTableSlug, "CREATE", {}, {}, menuId);
          }}
          className={styles.addBtn}>
          Добавить
        </button>
        <button onClick={handleColumnClick} className={styles.addBtnColumn}>
          <img src="/img/eye_off.svg" alt="" />
        </button>
        <button onClick={handleAddRowClick} className={styles.addBtnColumn}>
          <AddIcon sx={{fontSize: "24px", color: "#000"}} />
        </button>
      </Box>
      <DetailPageTableBody
        setLimit={setLimit}
        setOffset={setOffset}
        tableData={tableData}
        fields={fields}
        limit={limit}
        offset={offset}
        count={count}
        view={computedView}
        field={field}
        relatedTableSlug={relatedTableSlug}
        computedColumn={computedColumn}
        addRow={addRow}
      />

      <DetailRelationVisibleColumns
        fields={fields}
        fieldsMap={fieldsMap}
        currentView={computedView}
        handleColumnClose={handleColumnClose}
        anchorEl={anchorEl}
        open={open}
        relatedTableSlug={relatedTableSlug}
      />
    </Box>
  );
}

export default DetailPageTable;
