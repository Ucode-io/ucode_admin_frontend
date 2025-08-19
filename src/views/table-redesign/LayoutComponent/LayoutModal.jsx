import {Close} from "@mui/icons-material";
import {Card, IconButton} from "@mui/material";
import {useEffect, useState} from "react";
import {useQuery} from "react-query";
import {useParams} from "react-router-dom";
import styles from "./style.module.scss";
import constructorTableService from "../../../services/constructorTableService";
import RingLoaderWithWrapper from "../../../components/Loaders/RingLoader/RingLoaderWithWrapper";

const LayoutModal = ({
  closeModal = () => {},
  setIsChanged,
  isChanged,
  viewData,
  typeNewView,
  defaultViewTab,
  setTab,
  selectedTabIndex,
  refetchMainView = () => {},
  setSelectedView = () => {},
  selectedView,
}) => {
  const {tableSlug: tableSlugFromParams, appId, menuId} = useParams();
  const tableSlug = tableSlugFromParams ?? selectedView?.table_slug;
  const closeForm = () => setSelectedView(null);

  const {
    data: {fields, views, columns, relationColumns} = {
      fields: [],
      views: [],
      columns: [],
      relationColumns: [],
    },
    isLoading,
    refetch: refetchViews,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS_AT_VIEW_SETTINGS", {tableSlug}],
    () => {
      return constructorTableService.getTableInfo(tableSlug, {
        data: {
          limit: 10,
          offset: 0,
          with_relations: true,
          app_id: appId ?? menuId,
        },
      });
    },
    {
      select: ({data}) => {
        return {
          fields: data?.fields ?? [],
          views: data?.views ?? [],
          columns: data?.fields ?? [],
          relationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  useEffect(() => {
    if (isChanged === true) {
      refetchViews();
      refetchMainView();
      closeModal();
    }
  }, [isChanged]);

  useEffect(() => {
    setSelectedView(views?.[selectedTabIndex]);
  }, []);

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.cardTitle}>Layout</div>
        <IconButton className={styles.closeButton} onClick={closeModal}>
          <Close className={styles.closeIcon} />
        </IconButton>
      </div>

      {isLoading ? (
        <RingLoaderWithWrapper />
      ) : (
        <div className={styles.body}>
          {/* <ViewsList
            views={views}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
          /> */}

          {/* {selectedView && (
            
          )} */}
        </div>
      )}
    </Card>
  );
};

export default LayoutModal;
