import {
  AccountTree,
  CalendarMonth,
  Settings,
  TableChart,
} from "@mui/icons-material"
import { Modal } from "@mui/material"
import { useState } from "react"
import { useQueryClient } from "react-query"
import IconGenerator from "../../../../components/IconPicker/IconGenerator"
import ViewSettings from "../ViewSettings"
import style from "./style.module.scss"

const ViewTabSelector = ({
  selectedTabIndex,
  setSelectedTabIndex,
  views = [],
}) => {
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const queryClient = useQueryClient()

  const openModal = () => {
    setIsChanged(false)
    setSettingsModalVisible(true)
  }
  const closeModal = () => {
    setSettingsModalVisible(false)
    if(isChanged) queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"])
  }

  return (
    <>
      <div
        className={style.selector}
        style={{ minWidth: `${32 * views.length}px` }}
      >
        {views.map((view, index) => (
          <div
            onClick={() => setSelectedTabIndex(index)}
            key={view.id}
            className={`${style.element} ${
              selectedTabIndex === index ? style.active : ""
            }`}
          >
            {view.type === "TABLE" && <TableChart className={style.icon} />}
            {view.type === "CALENDAR" && (
              <CalendarMonth className={style.icon} />
            )}
            {view.type === "GANTT" && (
              <IconGenerator className={style.icon} icon="chart-gantt.svg" />
            )}
            {view.type === "TREE" && <AccountTree className={style.icon} />}
            {view.type === "BOARD" && (
              <IconGenerator className={style.icon} icon="brand_trello.svg" />
            )}
          </div>
        ))}

        <div className={style.element} onClick={openModal} >
          <Settings className={style.icon} />
        </div>
      </div>

      <Modal className={style.modal} open={settingsModalVisible} onClose={closeModal}>
        <ViewSettings closeModal={closeModal} setIsChanged={setIsChanged} />
      </Modal>
    </>
  )
}

export default ViewTabSelector
