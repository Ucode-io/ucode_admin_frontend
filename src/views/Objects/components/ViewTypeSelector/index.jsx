import {
  AccountTree,
  Add,
  CalendarMonth,
  TableChart,
} from "@mui/icons-material"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import IconGenerator from "../../../../components/IconPicker/IconGenerator"
import ViewCreateModal from "../../TableView/ViewCreateModal"
import style from "./style.module.scss"

const ViewTabSelector = ({
  selectedTabIndex,
  setSelectedTabIndex,
  views = [],
  setViews,
}) => {
  const { tableSlug } = useParams()

  const columns = useSelector((state) => state.tableColumn.list)
  const [viewCreateModalVisible, setViewCreateModalVisible] = useState(false)

  return (
    <>
      <div className={style.selector} style={{ minWidth: `${33 * (views.length + 1)}px` }} >
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

        <div
          className={style.element}
          onClick={() => setViewCreateModalVisible(true)}
        >
          <Add />
        </div>
      </div>
      {viewCreateModalVisible && (
        <ViewCreateModal
          fields={columns[tableSlug]}
          closeModal={() => setViewCreateModalVisible(false)}
          setViews={setViews}
          tableSlug={tableSlug}
        />
      )}
    </>
  )
}

export default ViewTabSelector
