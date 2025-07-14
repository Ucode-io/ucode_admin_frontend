import cls from "./styles.module.scss";
import { Box, Dialog } from "@mui/material";
import { useViewCreateProps } from "./useViewCreateProps";
import SVG from "react-inlinesvg";

export const ViewCreate = ({
  tableRelations,
  relationView,
  view,
  fieldsMap,
  tableSlug,
  views,
  refetchViews,
  handleSelectViewType,
}) => {
  const { computedViewTypes, viewIcons, selectedViewTab } = useViewCreateProps({
    tableRelations,
    relationView,
    view,
    fieldsMap,
    tableSlug,
    views,
    refetchViews,
  });

  return (
    <Box className={cls.paper}>
      <Box>
        <h3 className={cls.title}>New view</h3>
      </Box>
      <ul className={cls.list}>
        {computedViewTypes.map((type, index) => (
          <li className={cls.item} key={type.value}>
            <button
              className={cls.button}
              onClick={(e) => handleSelectViewType(e, type.value)}
            >
              <span className={cls.buttonInner}>
                <span className={cls.icon}>
                  <SVG
                    src={`/img/${viewIcons[type?.value]}`}
                    width={18}
                    height={18}
                  />
                </span>
                <span className={cls.label}>{type.label}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Box>
  );
};
