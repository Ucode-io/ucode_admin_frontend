import {useMemo} from "react";
import ActionButtons from "../ActionButtons";
import RowIndexField from "../RowIndexField";
import IndexHeaderComponent from "../IndexHeaderComponent";
import FieldCreateHeaderComponent from "../FieldCreateHeaderComponent";
import constructorObjectService from "@/services/constructorObjectService";
import { useTranslation } from "react-i18next";

function AggridDefaultComponents({ customAutoGroupColumnDef }) {
  const { fields, tableSlug, view, fiedlsarray } = customAutoGroupColumnDef;

  const { i18n } = useTranslation();

  const recursiveField = fields?.find((el) => el?.table_slug === tableSlug);

  const defaultColDef = useMemo(
    () => ({
      width: 200,
      autoHeaderHeight: true,
      suppressServerSideFullWidthLoadingRow: true,
      enableRangeSelection: true,
      enableFillHandle: true,
      fillHandleDirection: "xy",
      suppressMultiRangeSelection: false,
    }),
    [],
  );

  const autoGroupColumnDef = useMemo(() => {
    // 1. Пытаемся найти слаг для группировки из настроек вью (view)
    const groupByColumns = view?.attributes?.group_by_columns;
    let targetSlug = recursiveField?.view_fields?.[1]?.slug; // ваш дефолт

    if (groupByColumns?.length > 0) {
      const groupFieldId = groupByColumns[0];
      // Ищем этот филд в fiedlsarray, чтобы достать его slug
      const foundField = fiedlsarray?.find(
        (f) => f.columnID === groupFieldId || f.fieldObj?.id === groupFieldId,
      );
      if (foundField) targetSlug = foundField.field;
    }

    return {
      // Указываем основной слаг, но valueGetter его переопределит для локализации
      field: targetSlug,
      minWidth: 280,
      headerName: i18n.language === "ru" ? "Группа" : "Group",
      cellRendererParams: {
        suppressCount: true,
        innerRenderer: (params) => {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              {params.value}
            </div>
          );
        },
        checkbox: true,
      },
      valueGetter: (params) => {
        const data = params.data;
        if (!data) return null;

        const lang = i18n.language;

        // 1. Если у нас определен конкретный slug (из группировки или дефолтный)
        if (targetSlug) {
          // Проверяем локализованную версию (name_ru, name_en)
          const localizedVal =
            data[`${targetSlug}_${lang}`] ||
            data[`${targetSlug}_en` || targetSlug];
          if (localizedVal) return localizedVal;

          // Если это LOOKUP (объект _data), ищем внутри него
          const nestedData = data[`${targetSlug}_data` || `${targetSlug}Data`];
          if (nestedData) {
            return (
              nestedData[`name_${lang}`] ||
              nestedData.name ||
              nestedData.Nazvanie ||
              nestedData.label ||
              nestedData.task
            );
          }

          // Если простое значение в самом поле
          if (data[targetSlug]) return data[targetSlug];
        }

        // 2. FALLBACK: Если по слагу ничего не нашли или его нет, ищем в стандартных полях
        // Это исправит вашу проблему с пустым полем "name", когда текст лежит в "task"
        return (
          data[`name_${lang}`] ||
          data[`name_en`] ||
          data.task ||
          data.name ||
          data.label ||
          (Array.isArray(data.path) ? data.path[data.path.length - 1] : "")
        );
      },
    };
    // ВАЖНО: Добавляем зависимости, чтобы при смене языка или вью группа пересчиталась
  }, [i18n.language, view, fiedlsarray, recursiveField, tableSlug]);

  // const autoGroupColumnDef = useMemo(
  //   () => ({
  //     field: recursiveField?.view_fields?.[1]?.slug,
  //     cellRendererParams: {
  //       suppressCount: true,
  //       innerRenderer: (params) => {
  //         return (
  //           <div style={{ display: "flex", alignItems: "center" }}>
  //             {params.value}
  //           </div>
  //         );
  //       },
  //       checkbox: true,
  //     },
  //     valueGetter: (params) => {
  //       const lang = i18n.language;
  //       return params.data?.[`name_${lang}`] || params.data?.name;
  //     },
  //     minWidth: 280,
  //   }),
  //   [],
  // );
  const rowSelection = useMemo(
    () => ({
      mode: "multiRow",
      checkboxes: false,
      headerCheckbox: false,
    }),
    [],
  );
  const cellSelection = useMemo(
    () => ({
      handle: {
        mode: "fill",
        direction: "y",
      },
    }),
    [],
  );
  return {
    rowSelection,
    cellSelection,
    defaultColDef,
    autoGroupColumnDef,
  };
}

export default AggridDefaultComponents;

export const IndexColumn = {
  width: 45,
  height: 32,
  filter: false,
  pinned: "left",
  headerName: "№",
  field: "button",
  editable: false,
  sortable: false,
  suppressMenu: true,
  suppressMovable: true,
  lockPinned: true,
  lockPosition: "left",
  cellClass: "indexClass",
  suppressSizeToFit: true,
  cellRenderer: RowIndexField,
  headerComponent: IndexHeaderComponent,
};

export const ActionsColumn = {
  width: 45,
  height: 32,
  filter: false,
  sortable: false,
  field: "button",
  pinned: "right",
  type: "ACTIONS",
  suppressMenu: true,
  lockPinned: true,
  suppressMovable: true,
  headerName: "Actions",
  suppressSizeToFit: true,
  suppressPaste: true,
  editable: false,
  cellRenderer: ActionButtons,
  headerComponent: FieldCreateHeaderComponent,
};

export const updateObject = (tableSlug = "", data) => {
  constructorObjectService.update(tableSlug, {data: {...data}});
};
