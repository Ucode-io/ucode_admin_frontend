import {useMemo} from "react";
import IconGenerator from "../IconPicker/IconGenerator";
import clsx from "clsx";
import cls from "./style.module.scss";

const MultiselectCellColoredElement = ({
  field,
  value = [],
  style,
  resize,
  className,
  statusTypeOptions,
  el,
  fieldsMap,
  slug,
  columnIndex,
  ...props
}) => {

  const hasColor = field?.attributes?.has_color;
  const hasIcon = field?.attributes?.has_icon;

  const tags = useMemo(() => {
    if (typeof value === "string" || typeof value === "number")
      return [
        {
          value,
          color: hasColor
            ? field.attributes?.options?.find(
                (option) => option.value === value
              )
            : "",
        },
      ];
    if (Array.isArray(value)) {
      return value
        ?.map((tagValue) =>
          field.attributes?.options?.find((option) => option.value === tagValue)
        )
        ?.filter((el) => el);
    }
  }, [value, field?.attributes?.options]);

  const color = statusTypeOptions?.find(
    (option) => option?.label === el?.[slug]
  )?.color;

  if (!value?.length) return "";
  return (
    <div
      className={clsx(className, "flex align-center gap-1")}
      style={{
        flexWrap: "wrap",
        // justifyContent: "center",
        alignItems: "center",
        minWidth: "150px",
      }}
    >
      {tags?.map((tag) => (
        <div
          className={cls.cellColoredElementLabel}
          style={{
            color: color || hasColor ? tag.color?.color || tag?.color : "#000",
            backgroundColor: color
              ? color + 33
              : hasColor
                ? (tag.color?.color || tag.color) + 33
                : "#c0c0c039",
            padding: resize ? "0px 5px" : "5px 12px",
            width: "fit-content",
            borderRadius: 6,
            display: "flex",
            ...style,
          }}
          {...props}
        >
          {hasIcon && (
            <IconGenerator
              icon={tag.icon}
              size={14}
              className="mr-1"
              style={{ transform: "translateY(2px)" }}
            />
          )}

          {tag.label ?? tag.value}
          <span
            className={clsx(cls.cellColoredElementLabelPopup, {
              [cls.fromLeft]: columnIndex === 0,
            })}
          >
            {field?.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MultiselectCellColoredElement;
