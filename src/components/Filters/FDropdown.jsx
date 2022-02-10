import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Input } from "alisa-ui"
import Card from "../Card"
import { withStyles, Popover } from "@material-ui/core"
import SearchIcon from "@material-ui/icons/Search"
import { PlacemarkIcon } from "../../constants/icons"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import CloseIcon from "@material-ui/icons/Close"

const StyledMenu = withStyles({
  paper: {
    width: "320px",
    maxHeight: "336px",
    border: "none",
    borderRadius: 6,
    filter: "drop-shadow(0px 16px 40px rgba(0, 0, 0, 0.1))",
  },
  list: {
    padding: 0,
  },
})((props) => (
  <Popover
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
))

export default function FDropdown({ options = [], onClick, reset, value }) {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const [items, setItems] = useState(options)

  const onSearch = (e) => {
    setItems(
      options.filter((elm) =>
        elm.label.toLowerCase().includes(e.target.value.toLowerCase())
      )
    )
  }

  const valueLabel = options.find((item) => item.value === value)

  return (
    <>
      <div
        className="h-9 flex items-center gap-2 border px-3 rounded-md cursor-pointer text-sm"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <PlacemarkIcon />
        {valueLabel ? valueLabel.label : "Город"}
        {valueLabel ? (
          <CloseIcon
            fontSize="small"
            onClick={reset}
            style={{ fill: "var(--color-primary)" }}
          />
        ) : (
          <KeyboardArrowDownIcon
            fontSize="medium"
            style={{ fill: "var(--color-primary)" }}
          />
        )}
      </div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <Card
          style={{ backgroundColor: "#F7F9FB" }}
          headerStyle={{ padding: "10px 12px" }}
          bodyStyle={{
            padding: 0,
            overflowY: "auto",
            maxHeight: 336 - 56 * 2,
          }}
          title={
            <Input
              placeholder={t("search")}
              size="large"
              addonBefore={
                <SearchIcon style={{ fill: "var(--color-primary)" }} />
              }
              onChange={onSearch}
            />
          }
        >
          {items.map((elm, index) => (
            <div
              className={`px-4 py-3 text-sm cursor-pointer hover:bg-white ${
                index + 1 === items.length ? "" : "border-b"
              }`}
              onClick={() => onClick(elm.value, () => setAnchorEl(null))}
              key={elm.value}
            >
              {elm.label}
            </div>
          ))}
        </Card>
      </StyledMenu>
    </>
  )
}
