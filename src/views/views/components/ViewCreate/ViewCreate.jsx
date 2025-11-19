import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import { useViewCreateProps } from "./useViewCreateProps";
import SVG from "react-inlinesvg";

export const ViewCreate = ({
  handleSelectViewType,
}) => {
  const { computedViewTypes, viewIcons } = useViewCreateProps();

  return (
    <Box className={cls.paper}>
      <Box>
        <h3 className={cls.title}>New view</h3>
      </Box>
      <ul className={cls.list}>
        {computedViewTypes.map((type) => (
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
