import {get} from "@ngard/tiny-get";
import { useEffect, useMemo, useState } from "react";
import { useTimelineBlockContext } from "../../providers/TimelineBlockProvider";

export const useTimelineRecursiveRowProps = ({
  item,
  fieldsMap,
  openedRows,
  setOpenedRows,
  lastLabels = "",
  handleAllOpen,
  handleAllClose,
  computedData,
  setIsAllOpen,
}) => {
  const [open, setOpen] = useState(false);

  const { hoveredRowId } = useTimelineBlockContext();

  const viewFields = Object.values(fieldsMap)
    .find((field) => field?.table_slug === item?.group_by_slug)
    ?.view_fields?.map((field) => field?.slug);

  const handleClick = () => {
    const isCurrentlyOpen = openedRows.includes(
      lastLabels?.length ? lastLabels + "." + item?.label : item?.label
    );

    setOpen(!isCurrentlyOpen);

    if (!isCurrentlyOpen) {
      setOpenedRows(() => {
        const newOpenedRows = [
          ...openedRows,
          lastLabels?.length ? lastLabels + "." + item?.label : item?.label,
        ];

        if (newOpenedRows.length === computedData?.length) {
          setIsAllOpen(true);
        }
        return newOpenedRows;
      });
    } else {
      setOpenedRows(() => {
        const newOpenedRows = openedRows.filter(
          (row) =>
            row !==
            (lastLabels?.length ? lastLabels + "." + item?.label : item?.label)
        );

        if (newOpenedRows?.length < computedData?.length) {
          setIsAllOpen(false);
        }

        return newOpenedRows;
      });
    }
  };

  const computedValue = useMemo(() => {
    const slugs = viewFields?.map((item) => item) ?? [];

    return slugs
      .map((slug) =>
        get(item?.[`${item?.group_by_slug}_id_data`]?.[0], slug, "")
      )
      .join(" ");
  }, [viewFields]);

  // useEffect(() => {
  //   if (item?.group_by_type === "LOOKUP") {
  //     constructorObjectService
  //       .getById(item?.group_by_slug, item?.label)
  //       .then((res) => {
  //         if (res?.data?.response) {
  //           // setLabel(res?.data?.response);
  //         }
  //       });
  //   }
  // }, [item]);

  useEffect(() => {
    if (
      openedRows.includes(
        lastLabels?.length ? lastLabels + "." + item?.label : item?.label
      )
    ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [item, openedRows, lastLabels]);

  return {
    handleClick,
    computedValue,
    open,
    hoveredRowId,
  };
};
