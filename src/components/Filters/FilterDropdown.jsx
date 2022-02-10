import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Input } from "alisa-ui"
import Card from "../Card"
import Button from "../Button"
//material
import { withStyles } from "@material-ui/core"
import Menu from "@material-ui/core/Menu"
import SearchIcon from "@material-ui/icons/Search"

const Icon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.54168 4.71634C3.62501 4.82467 8.32501 10.8247 8.32501 10.8247V15.833C8.32501 16.2913 8.70001 16.6663 9.16668 16.6663H10.8417C11.3 16.6663 11.6833 16.2913 11.6833 15.833V10.8163C11.6833 10.8163 16.2583 4.96634 16.475 4.69967C16.6917 4.43301 16.6667 4.16634 16.6667 4.16634C16.6667 3.70801 16.2917 3.33301 15.825 3.33301H4.17501C3.66668 3.33301 3.33334 3.73301 3.33334 4.16634C3.33334 4.33301 3.38334 4.53301 3.54168 4.71634Z"
      fill="#9AAFCD"
    />
  </svg>
)

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
})((props) => (
  <Menu
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

export default function FilterDropdown({
  icon = Icon,
  options = [],
  isSearch = true,
  checked = [],
  onChange = () => {},
  onCheck = () => {},
  onFilter = () => {},
}) {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const [checkedElements, setCheckedElements] = useState(checked)
  const [items, setItems] = useState(options)

  useEffect(() => {
    onChange(checkedElements)
  }, [checkedElements])

  const onCheckboxChange = (e) => {
    // console.log(e.target.checked, e.target.value)
    onCheck(e)
    if (e.target.checked) {
      setCheckedElements((prev) => [...prev, e.target.value])
    } else {
      setCheckedElements((prev) => prev.filter((el) => el !== e.target.value))
    }
  }

  const onSearch = (e) => {
    setItems(
      options.filter((elm) =>
        elm.label.toLowerCase().includes(e.target.value.toLowerCase())
      )
    )
  }

  const onFilterClick = () => {
    onFilter(checkedElements)
    setAnchorEl(null)
  }

  const onClear = () => {
    setCheckedElements([])
    onFilter([])
    setAnchorEl(null)
  }

  const ItemContainer = ({ element }) => (
    <div
      className="w-full py-2 px-4 border-b flex justify-between items-center"
      key={element.value}
    >
      <div>{element.label}</div>
      <input
        onChange={onCheckboxChange}
        checked={checkedElements.includes(element.value?.toString())}
        // checked={true}
        className="w-5 h-5 rounded cursor-pointer"
        value={element.value}
        type="checkbox"
      />
    </div>
  )

  const footer = (
    <div className="grid grid-cols-2 justify-between items-center gap-3">
      <Button shape="outlined" style={{ width: "100%" }} onClick={onClear}>
        {t("clear")}
      </Button>
      <Button style={{ width: "100%" }} onClick={onFilterClick}>
        {t("to.filter")}
      </Button>
    </div>
  )

  return (
    <div>
      <div
        onClick={(e) => setAnchorEl(e.currentTarget)}
        className="cursor-pointer"
      >
        {icon}
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
          footer={footer}
          title={
            <Input
              // width={410}
              placeholder={t("search")}
              size="middle"
              addonBefore={<SearchIcon />}
              onChange={onSearch}
            />
          }
        >
          {/* <ItemContainer element={{ label: t('all'), value: 'all' }} /> */}
          {items.map((elm) => (
            <div key={elm.value}>
              <ItemContainer element={elm} />
            </div>
          ))}
        </Card>
      </StyledMenu>
    </div>
  )
}
