import cls from "./styles.module.scss";
import { Card } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import RingLoaderWithWrapper from "@/components/Loaders/RingLoader/RingLoaderWithWrapper";
import { CloseButton } from "@/components/CloseButton";
import { ViewForm } from "../ViewForm";
import { useGetTableInfo } from "@/services/tableService/table.service";
import { useViewContext } from "@/providers/ViewProvider";

export const ViewSettings = ({
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
  const { appId, menuId } = useParams();
  // const tableSlug = tableSlugFromParams ?? selectedView?.table_slug;
  const closeForm = () => setSelectedView(null);

  const { tableSlug } = useViewContext();

  const {
    data: { fields, views, columns, relationColumns } = {
      fields: [],
      views: [],
      columns: [],
      relationColumns: [],
    },
    isLoading,
    refetch: refetchViews,
  } = useGetTableInfo(
    tableSlug,
    {
      limit: 10,
      offset: 0,
      with_relations: true,
      app_id: appId ?? menuId,
    },
    {
      select: ({ data }) => {
        return {
          fields: data?.fields ?? [],
          views: data?.views ?? [],
          columns: data?.columns ?? [],
          relationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    },
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
    <Card className={cls.card}>
      <div className={cls.header}>
        <div className={cls.cardTitle}>View settings</div>
        <CloseButton onClick={closeModal} />
      </div>

      {isLoading ? (
        <RingLoaderWithWrapper />
      ) : (
        <div className={cls.body}>
          {selectedView && (
            <ViewForm
              viewData={viewData}
              initialValues={selectedView}
              typeNewView={typeNewView}
              closeForm={closeForm}
              refetchViews={refetchViews}
              closeModal={closeModal}
              setIsChanged={setIsChanged}
              defaultViewTab={defaultViewTab}
              columns={columns}
              views={views}
              relationColumns={relationColumns}
              setTab={setTab}
              fields={fields}
            />
          )}
        </div>
      )}
    </Card>
  );
};
