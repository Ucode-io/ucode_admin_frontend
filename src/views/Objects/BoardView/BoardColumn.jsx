import { Add } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useEffect, useState } from "react"
import { useMutation } from "react-query"
import { Container, Draggable } from "react-smooth-dnd"
import BoardCardRowGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator"
import constructorObjectService from "../../../services/constructorObjectService"
import { applyDrag } from "../../../utils/applyDrag"
import styles from "./style.module.scss"

const BoardColumn = ({
  column,
  data = [],
  groupFieldName,
  tableColumns = [],
  tableSlug,
}) => {
  const [computedData, setComputedData] = useState(
    data.filter((el) => el[groupFieldName] === column.value)
  )

  const { mutate } = useMutation((data) => {
    return constructorObjectService.update(tableSlug, {
      data: {
        ...data,
        [groupFieldName]: column.value,
      }
    })
  })

  const onDrop = (dropResult) => {
    const result = applyDrag(computedData, dropResult)

    if (result) setComputedData(result)

    if (result?.length > computedData?.length) {
      mutate(dropResult.payload)
    }
  }

  return (
    <div className={styles.column}>
      <div className={`${styles.columnHeaderBlock} column-header`}>
        <div className={styles.title}>{column.label}</div>
        <div className={styles.rightSide}>
          <IconButton color="primary">
            <Add />
          </IconButton>
        </div>
      </div>

      <Container
        style={{
          height: "calc(100vh - 200px)",
          overflow: "auto",
          borderRadius: "6px",
        }}
        groupName="subtask"
        getChildPayload={(i) => computedData[i]}
        onDrop={onDrop}
        dropPlaceholder={{ className: "drag-row-drop-preview" }}
      >
        {computedData.map((el) => (
          <Draggable key={el.guid}>
            <div className={styles.card}>
              {tableColumns.map((tableColumn) => (
                <BoardCardRowGenerator
                  key={tableColumn.id}
                  tableColumn={tableColumn}
                  el={el}
                />
              ))}
            </div>
          </Draggable>
        ))}
      </Container>
    </div>
  )
}

export default BoardColumn
