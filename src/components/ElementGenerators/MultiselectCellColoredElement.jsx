import IconGenerator from "../IconPicker/IconGenerator"

const MultiselectCellColoredElement = ({ field, value, style, ...props }) => {
  const color =
    value && field?.attributes?.has_color
      ? field?.attributes?.options?.find((i) => i.value === value[0])?.color
      : ""

  const icon =
    value && field?.attributes?.has_icon
      ? field?.attributes?.options?.find((i) => i.value === value[0])?.icon
      : ""

  return (
    <div
      style={{
        color,
        backgroundColor: color + 33,
        padding: "5px 12px",
        width: "fit-content",
        borderRadius: 6,
        ...style,
      }}
      {...props}
    >
      {icon && (
        <>
          <IconGenerator
            icon={icon}
            size="14"
            style={{ transform: "translateY(2px)" }}
          />
          &nbsp;
        </>
      )}
      {value}
    </div>
  )
}

export default MultiselectCellColoredElement
