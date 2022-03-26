import { useState, useEffect, useMemo, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Card from "../Card";
import Switch from "../Switch";
import Menu from "@material-ui/core/Menu";
import { withStyles } from "@material-ui/core";
import TableChartIcon from "@material-ui/icons/TableChart";

const StyledMenu = withStyles({
  paper: {
    width: "320px",
    maxHeight: "336px",
    border: "1px solid #d3d4d5",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  list: {
    padding: 0,
  },
})(
  forwardRef((props, ref) => {
    return (
      <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        {...props}
        ref={ref}
      />
    );
  }),
);

export default function SwitchColumns({
  columns = [],
  onChange = () => {},
  iconClasses = "",
}) {
  const { t } = useTranslation();
  const [data, setData] = useState(columns);
  const [anchorEl, setAnchorEl] = useState(null);
  const [all, setAll] = useState(true);

  const switchType = useMemo(() => {
    if (data.every((elm) => !elm.hide)) return "allChecked";
    else if (data.some((elm) => !elm.hide)) return "checked";
    else return "unChecked";
  }, [data]);

  useEffect(() => {
    setAll((prev) => {
      return data.every((elm) => !elm.hide);
    });
    onChange(data.filter((elm) => !elm.hide));
  }, [data, onChange]);

  const onSwitchChange = (val, key) => {
    setData((prev) =>
      prev.map((elm) => (elm.key === key ? { ...elm, hide: !val } : elm)),
    );
    setAll((prev) => {
      return !val && prev && !prev;
    });
  };

  const onAllClick = () => {
    setAll((prev) => !prev);
    if (switchType === "checked" || switchType === "unChecked") {
      setData((prev) => prev.map((elm) => ({ ...elm, hide: false })));
    } else {
      setData((prev) => prev.map((elm) => ({ ...elm, hide: true })));
    }
    setAnchorEl(null);
  };

  const title = (
    <div className="flex justify-between items-center">
      <div>{t("all")}</div>
      <div className="cursor-pointer pr-3.5">
        <Switch checked={all} onChange={onAllClick} />
      </div>
    </div>
  );

  const ItemContainer = ({ element }) => (
    <div
      className="w-full py-2 px-4 border-b flex justify-between items-center"
      key={element.value}
    >
      <div>{element.title}</div>
      <Switch
        checked={!element.hide}
        onChange={(val) => onSwitchChange(val, element.key)}
      />
    </div>
  );

  return (
    <div className="cursor-pointer transition-all duration-100">
      <div
        className={`fill-current text-primary cursor-pointer ${iconClasses}`}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <TableChartIcon />
      </div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <Card
          headerStyle={{ padding: "10px 12px" }}
          footerStyle={{ padding: "10px 12px" }}
          bodyStyle={{
            padding: 0,
            overflowY: "scroll",
            maxHeight: 336 - 56 * 2,
          }}
          footer={null}
          title={title}
        >
          {data.map((elm) => (
            <div key={elm.key + "-col"}>
              <ItemContainer element={elm} />
            </div>
          ))}
        </Card>
      </StyledMenu>
    </div>
  );
}
