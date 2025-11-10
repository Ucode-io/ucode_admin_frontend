import clsx from "clsx";
import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import { components } from "react-select";
import { updateQueryWithoutRerender } from "../../../../utils/useSafeQueryUpdater";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { detailDrawerActions } from "../../../../store/detailDrawer/detailDrawer.slice";
import { groupFieldActions } from "../../../../store/groupField/groupField.slice";
import useTabRouter from "../../../../hooks/useTabRouter";
import LaunchIcon from "@mui/icons-material/Launch";

export const CustomSingleValue = ({ refetch, disabled, isNewRouter, tableSlug, field, localValue, menuId, ...props }) => {
  const { menuIsOpen } = props.selectProps;

  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const { navigateToForm } = useTabRouter();

  return (
    <components.SingleValue className={cls.singleValue} {...props}>
      <div
        className={clsx("select_icon")}
        style={{ display: "flex", alignItems: "center" }}
        onClick={() => {
          refetch();
        }}
      >
        <div className={cls.selectValue}>
          {props?.data?.[`name_${i18n?.language}`] ||
            props?.data?.name ||
            props.children}
          {!disabled && (
            <Box
              sx={{
                width: "20px",
                height: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 99999,
                borderRadius: "4px",
                marginLeft: "5px",

                "&:hover": {
                  backgroundColor: "rgba(55, 53, 47, 0.06)",
                },
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (isNewRouter) {
                  const { data } = props;
                  dispatch(detailDrawerActions.openDrawer());
                  dispatch(groupFieldActions.clearViewsPath());
                  dispatch(groupFieldActions.clearViews());
                  dispatch(
                    groupFieldActions.addView({
                      id: data?.table_id,
                      detailId: data?.guid,
                      is_relation_view: true,
                      table_slug: data?.table_slug,
                      label:
                        field?.attributes?.[`label_${i18n?.language}`] || "",
                      relation_table_slug: data?.table_slug,
                    })
                  );
                  dispatch(
                    groupFieldActions.addViewPath({
                      id: data?.table_id,
                      detailId: data?.guid,
                      is_relation_view: true,
                      table_slug: data?.table_slug,
                      label:
                        field?.attributes?.[`label_${i18n?.language}`] || "",
                    })
                  );
                  updateQueryWithoutRerender("p", props?.data?.guid);
                  updateQueryWithoutRerender("field_slug", field?.table_slug);
                } else {
                  navigateToForm(tableSlug, "EDIT", localValue, {}, menuId);
                }
              }}
            >
              <LaunchIcon
                htmlColor="rgba(50, 48, 44, 0.5)"
                className={cls.launchIcon}
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              />
            </Box>
          )}
          {menuIsOpen && (
            <span
              className={cls.closeIcon}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={(e) => {
                e.stopPropagation();
                props?.clearValue();
              }}
            >
              <svg
                aria-hidden="true"
                role="graphics-symbol"
                viewBox="0 0 8 8"
                class="closeThick"
                style={{
                  width: "8px",
                  height: "8px",
                  display: "block",
                  fill: "rgba(50, 48, 44, 0.5)",
                  flexShrink: 0,
                  opacity: "0.5",
                }}
              >
                <polygon points="8 1.01818182 6.98181818 0 4 2.98181818 1.01818182 0 0 1.01818182 2.98181818 4 0 6.98181818 1.01818182 8 4 5.01818182 6.98181818 8 8 6.98181818 5.01818182 4"></polygon>
              </svg>
            </span>
          )}
        </div>
      </div>
    </components.SingleValue>
  );
}
