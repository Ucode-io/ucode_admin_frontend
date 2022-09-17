import { useQuery } from "react-query"
import request from "../../../../../utils/request"
import PanelViews from "../PanelViews"
import styles from "./style.module.scss"

const PanelPreview = ({ form, variablesValue = {} }) => {
  const title = form.watch('title')

  const panel = form.watch()

  const { data, isLoading } = useQuery(
    ["GET_DATA_BY_QUERY_IN_PREVIEW", { panelID: panel.id, variablesValue }],
    () => {
      const query = form.getValues('query')
      
      if (!query) return []
      return request.post("/query", {
        data: variablesValue,
        query: query,
      })
    },
  )
  

  return (
    <div className={styles.panel}>
      <div className={styles.title}>{title}</div>

      <div className={styles.previewPanel} >
        <PanelViews panel={panel} variablesValue={variablesValue} data={data} isLoading={isLoading} />
      </div>

     
    </div>
  )
}

export default PanelPreview
