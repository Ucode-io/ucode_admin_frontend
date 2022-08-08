import {
  AccountTree,
  CalendarMonth,
  TableChart,
} from "@mui/icons-material"
import IconGenerator from "../../../../components/IconPicker/IconGenerator"
import style from "./style.module.scss"

const ViewTabSelector = ({
  selectedTabIndex,
  setSelectedTabIndex,
  views = [],
}) => {

  return (
    <>
      <div className={style.selector} style={{ minWidth: `${32 * (views.length)}px` }} >
        {views.map((view, index) => (
          <div
            onClick={() => setSelectedTabIndex(index)}
            key={view.id}
            className={`${style.element} ${
              selectedTabIndex === index ? style.active : ""
            }`}
          >
            {view.type === "TABLE" && <TableChart />}
            {view.type === "CALENDAR" && <CalendarMonth />}
            {view.type === "TREE" && <AccountTree />}
            {view.type === "BOARD" && <IconGenerator icon="brand_trello.svg" />}
          </div>
        ))}

        {/* <div
          className={style.element}
          // onClick={() => setViewCreateModalVisible(true)}
        >
          <Add />
        </div> */}
      </div>

    </>
  )
}

export default ViewTabSelector
