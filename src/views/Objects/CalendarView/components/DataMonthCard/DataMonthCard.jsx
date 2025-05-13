import cls from "./styles.module.scss";
import { useRef, useState } from "react";
import { Menu } from "@mui/material";
import { dateValidFormat } from "@/utils/dateValidFormat";
import IconGenerator from "@/components/IconPicker/IconGenerator";
import { getRelationFieldTableCellLabel } from "@/utils/getRelationFieldLabel";
import MultiselectCellColoredElement from "@/components/ElementGenerators/MultiselectCellColoredElement";
import { useTranslation } from "react-i18next";
import { InfoBlockMonth } from "../InfoBlockMonth";

export const DataMonthCard = ({
  date,
  view,
  fieldsMap,
  data,
  viewFields,
  navigateToEditPage,
}) => {
  const [info, setInfo] = useState(data);
  const [anchorEl, setAnchorEl] = useState(null);
  const ref = useRef();
  const { i18n } = useTranslation();

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        key={data.guid}
        className={cls.infoBlockWrapper}
        style={{
          transform: `translateX(${info.calendar?.startPosition}px)`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          navigateToEditPage(info);
        }}
        ref={ref}
      >
        <p className={cls.infoPopup}>
          <InfoBlockMonth
            viewFields={viewFields}
            data={info}
            textClassName={cls.infoText}
          />
        </p>
        <div>
          <InfoBlockMonth viewFields={viewFields} data={info} />
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        classes={{ list: cls.menu, paper: cls.paper }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <div className={cls.popupHeader}>
          {/* <p className={cls.time}>
            {dateValidFormat(info.calendar?.elementFromTime, "HH:mm")} -
            {dateValidFormat(info.calendar?.elementToTime, " HH:mm")}
          </p> */}

          <IconGenerator
            onClick={() => {
              navigateToEditPage(info);
              closeMenu();
            }}
            className={cls.linkIcon}
            icon="arrow-up-right-from-square.svg"
            size={16}
          />
        </div>
        {viewFields?.map((field) => (
          <InfoBlock field={field} info={info} key={field.slug} i18n={i18n} />
        ))}
        {/* <CalendarStatusSelect
          view={view}
          fieldsMap={fieldsMap}
          info={info}
          setInfo={setInfo}
        /> */}
      </Menu>
    </>
  );
};

const InfoBlock = ({ field, info, i18n }) => {
  return (
    <div>
      <b>
        {field?.attributes?.icon ? (
          <IconGenerator
            className={cls.linkIcon}
            icon={field?.attributes?.icon}
            size={16}
          />
        ) : (
          field?.label ||
          field?.attributes?.[`label_${i18n?.language}`] ||
          field?.attributes?.[`name_${i18n?.language}`]
        )}
        :{" "}
      </b>
      {field?.type === "LOOKUP" ? (
        getRelationFieldTableCellLabel(field, info, field.slug + "_data")
      ) : field?.type === "DATE_TIME" || field?.type === "DATE" ? (
        dateValidFormat(info[field.slug], "dd.MM.yyyy - HH:mm")
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
  );
};