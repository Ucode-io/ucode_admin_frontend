import { useMemo, useRef, useState } from "react";
import styles from "./month.module.scss";
import "../moveable.scss";
import { Menu } from "@mui/material";
import InfoBlock from "../InfoBlock";
import { dateValidFormat } from "../../../../utils/dateValidFormat";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import { getRelationFieldTableCellLabel } from "../../../../utils/getRelationFieldLabel";
import MultiselectCellColoredElement from "../../../../components/ElementGenerators/MultiselectCellColoredElement";
import CalendarStatusSelect from "../../components/CalendarStatusSelect";

const DataMonthCard = ({
  date,
  view,
  fieldsMap,
  data,
  viewFields,
  navigateToEditPage,
}) => {
  const [info, setInfo] = useState(data);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHover, setIsHover] = useState(false);
  const ref = useRef();

  console.log("info", info);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const infoBlockBg = useMemo(() => {
    return (
      fieldsMap[view.status_field_slug]?.attributes?.options?.find(
        (opt) => opt.value === info.status[0]
      )?.color ?? "silver"
    );
    //
  }, [view.status_field_slug, fieldsMap, info.status]);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <>
      <div
        key={data.guid}
        className={styles.infoBlockWrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          //   top: 0,
          transform: `translateY(${info.calendar?.startPosition}px)`,
        }}
        onClick={openMenu}
        ref={ref}
      >
        <div
          className={styles.resizing}
          style={{ background: infoBlockBg, height: "100%" }}
        >
          <div
            className={styles.infoCard}
            style={{
              height: "100%",
              background: infoBlockBg,
              overflow: "auto",
              filter: isHover
                ? "saturate(100%)"
                : "saturate(50%) brightness(125%)",
            }}
          >
            <InfoBlock viewFields={viewFields} data={info} />
          </div>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <div className={styles.popupHeader}>
          <p className={styles.time}>
            {dateValidFormat(info.calendar?.elementFromTime, "HH:mm")} -
            {dateValidFormat(info.calendar?.elementToTime, " HH:mm")}
          </p>

          <IconGenerator
            onClick={() => navigateToEditPage(info)}
            className={styles.linkIcon}
            icon="arrow-up-right-from-square.svg"
            size={16}
          />
        </div>
        {viewFields?.map((field) => (
          <div>
            <b>
              {field?.attributes?.icon ? (
                <IconGenerator
                  className={styles.linkIcon}
                  icon={field?.attributes?.icon}
                  size={16}
                />
              ) : (
                field?.label
              )}
              :{" "}
            </b>
            {field?.type === "LOOKUP" ? (
              getRelationFieldTableCellLabel(field, info, field.slug + "_data")
            ) : field?.type === "DATE_TIME" ? (
              dateValidFormat(info[field.slug], "dd.MM.yyyy HH:mm")
            ) : field?.type === "MULTISELECT" ? (
              <MultiselectCellColoredElement
                style={{ padding: "2px 5px", marginBottom: 4 }}
                value={info[field.slug]}
                field={field}
              />
            ) : (
              info[field?.slug]
            )}
          </div>
        ))}
        <CalendarStatusSelect
          view={view}
          fieldsMap={fieldsMap}
          info={info}
          setInfo={setInfo}
        />
      </Menu>
    </>
  );
};

export default DataMonthCard;
