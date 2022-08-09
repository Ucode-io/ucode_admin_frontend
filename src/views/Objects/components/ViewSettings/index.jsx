import { Close } from "@mui/icons-material"
import { Card, IconButton } from "@mui/material"
import { useState } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import RingLoaderWithWrapper from "../../../../components/Loaders/RingLoader/RingLoaderWithWrapper"
import constructorObjectService from "../../../../services/constructorObjectService"
import constructorViewService from "../../../../services/constructorViewService"
import styles from "./style.module.scss"
import ViewForm from "./ViewForm"
import ViewsList from "./ViewsList"

const ViewSettings = ({ closeModal, setIsChanged }) => {
  const { tableSlug } = useParams()
  const [selectedView, setSelectedView] = useState(null)

  const closeForm = () => setSelectedView(null)

  const {
    data: { views, columns } = { views: [], columns: {} },
    isLoading,
    refetch: refetchViews,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", tableSlug],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: { limit: 0, offset: 0 },
      })
    },
    {
      select: ({ data }) => {
        return {
          views: data?.views ?? [],
          columns: data?.fields,
        }
      },
    }
  )

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.cardTitle}>View settings</div>
        <IconButton className={styles.closeButton} onClick={closeModal}>
          <Close className={styles.closeIcon} />
        </IconButton>
      </div>

      {isLoading ? (
        <RingLoaderWithWrapper />
      ) : (
        <div className={styles.body}>
          <ViewsList
            views={views}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
          />

          {selectedView && (
            <ViewForm
              initialValues={selectedView}
              closeForm={closeForm}
              refetchViews={refetchViews}
              closeModal={closeModal}
              setIsChanged={setIsChanged}
              columns={columns}
            />
          )}
        </div>
      )}
    </Card>
  )
}

export default ViewSettings
