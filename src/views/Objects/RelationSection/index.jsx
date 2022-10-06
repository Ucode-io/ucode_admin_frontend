import { Add, Clear, Edit, Save } from "@mui/icons-material"
import { Card } from "@mui/material"
import { useCallback, useMemo } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useMutation } from "react-query"
import { useParams } from "react-router-dom"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"

import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import SecondaryButton from "../../../components/Buttons/SecondaryButton"
import IconGenerator from "../../../components/IconPicker/IconGenerator"
import useTabRouter from "../../../hooks/useTabRouter"
import constructorObjectService from "../../../services/constructorObjectService"
import CustomActionsButton from "../components/CustomActionsButton"
import FilesSection from "../FilesSection"
import ManyToManyRelationCreateModal from "./ManyToManyRelationCreateModal"
import RelationTable from "./RelationTable"
import styles from "./style.module.scss"

const RelationSection = ({
  relations,
  tableSlug: tableSlugFromProps,
  id: idFromProps,
}) => {
  const filteredRelations = useMemo(() => {
    return relations?.filter((relation) => relation?.relatedTable)
  }, [relations])

  const { tableSlug: tableSlugFromParams, id: idFromParams } = useParams()

  const tableSlug = tableSlugFromProps ?? tableSlugFromParams
  const id = idFromProps ?? idFromParams

  const { navigateToForm } = useTabRouter()
  const [selectedManyToManyRelation, setSelectedManyToManyRelation] =
    useState(null)
  const [relationsCreateFormVisible, setRelationsCreateFormVisible] = useState(
    {}
  )
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [shouldGet, setShouldGet] = useState(false)
  const [selectedObjects, setSelectedObjects] = useState([])
  const [formVisible, setFormVisible] = useState(false)
  const [dataLength, setDataLength] = useState(0)

  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue: setFormValue,
  } = useForm({
    defaultValues: {
      [`${tableSlug}_id`]: id,
      multi: [],
    },
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: "multi",
  })

  const selectedRelation = filteredRelations[selectedTabIndex]

  useEffect(() => {
    setSelectedObjects([])
    setFormVisible(false)
  }, [selectedTabIndex])

  useEffect(() => {
    const result = {}

    filteredRelations?.forEach((relation) => (result[relation.id] = false))

    setRelationsCreateFormVisible(result)
  }, [filteredRelations])

  const setCreateFormVisible = (relationId, value) => {
    setRelationsCreateFormVisible((prev) => ({
      ...prev,
      [relationId]: value,
    }))
  }

  const navigateToCreatePage = () => {
    append({ patients_id: idFromParams ?? "" })
    setFormVisible(true)
    // const relation = filteredRelations[selectedTabIndex]
    // if (relation.type === "Many2Many") setSelectedManyToManyRelation(relation)
    // else {
    //   if (relation.is_editable) setCreateFormVisible(relation.id, true)
    //   else {
    //     const relatedTable =
    //       relation.table_to?.slug === tableSlug
    //         ? relation.table_from
    //         : relation.table_to

    //     navigateToForm(relatedTable.slug, "CREATE", null, {
    //       [`${tableSlug}_id`]: id,
    //     })
    //   }
    // }
  }

  const getValue = useCallback((item, key) => {
    return typeof item?.[key] === "object" ? item?.[key].value : item?.[key]
  }, [])

  const { mutate: updateMultipleObject } = useMutation(
    (values) =>
      constructorObjectService.updateMultipleObject(
        relations[selectedTabIndex]?.relatedTable,
        {
          data: {
            objects: values.multi.map((item) => ({
              ...item,
              guid: item?.guid ?? "",
              doctors_id_2: getValue(item, "doctors_id_2"),
              doctors_id_3: getValue(item, "doctors_id_3"),
              specialities_id: getValue(item, "specialities_id"),
            })),
          },
        }
      ),
    {
      onSuccess: () => {
        setShouldGet((p) => !p)
      },
    }
  )

  const onSubmit = (data) => {
    updateMultipleObject(data)
  }

  if (!filteredRelations?.length) return null

  return (
    <>
      {selectedManyToManyRelation && (
        <ManyToManyRelationCreateModal
          relation={selectedManyToManyRelation}
          closeModal={() => setSelectedManyToManyRelation(null)}
        />
      )}
      {filteredRelations.length ? (
        <Card className={styles.card}>
          <Tabs selectedIndex={selectedTabIndex} onSelect={setSelectedTabIndex}>
            <div className={styles.cardHeader}>
              <TabList className={styles.tabList}>
                {filteredRelations?.map((relation, index) => (
                  <Tab key={index}>
                    {/* {relation?.view_relation_type === "FILE" ? (
                      <>
                        <InsertDriveFile /> Файлы
                      </>
                    ) : ( */}
                    <div className="flex align-center gap-2 text-nowrap">
                      <IconGenerator icon={relation?.icon} /> {relation.title}
                    </div>
                    {/* )} */}
                  </Tab>
                ))}
              </TabList>

              {filteredRelations[selectedTabIndex]?.relatedTable !== "file" && (
                <div className="flex gap-2">
                  <SecondaryButton
                    onClick={navigateToCreatePage}
                    disabled={!id}
                  >
                    <Add /> Добавить
                  </SecondaryButton>
                  {formVisible ? (
                    <>
                      <RectangleIconButton
                        color="success"
                        size="small"
                        onClick={handleSubmit(onSubmit)}
                        // loader={loader}
                      >
                        <Save color="success" />
                      </RectangleIconButton>
                      <RectangleIconButton
                        color="error"
                        onClick={() => {
                          setFormVisible(false)
                          if (fields.length > dataLength) {
                            remove(
                              Array(fields.length - dataLength)
                                .fill("*")
                                .map((i, index) => fields.length - (index + 1))
                            )
                          }
                        }}
                      >
                        <Clear color="error" />
                      </RectangleIconButton>
                    </>
                  ) : (
                    <RectangleIconButton
                      color="success"
                      className="mr-1"
                      size="small"
                      onClick={() => setFormVisible(true)}
                    >
                      <Edit color="primary" />
                    </RectangleIconButton>
                  )}
                  <CustomActionsButton
                    tableSlug={selectedRelation?.relatedTable}
                    selectedObjects={selectedObjects}
                    setSelectedObjects={setSelectedObjects}
                  />
                </div>
              )}
            </div>

            {filteredRelations?.map((relation) => (
              <TabPanel key={relation.id}>
                {relation?.relatedTable === "file" ? (
                  <FilesSection
                    relation={relation}
                    key={relation.id}
                    createFormVisible={relationsCreateFormVisible}
                    setCreateFormVisible={setCreateFormVisible}
                  />
                ) : (
                  <RelationTable
                    setDataLength={setDataLength}
                    shouldGet={shouldGet}
                    remove={remove}
                    reset={reset}
                    watch={watch}
                    control={control}
                    setFormValue={setFormValue}
                    fields={fields}
                    setFormVisible={setFormVisible}
                    formVisible={formVisible}
                    key={relation.id}
                    relation={relation}
                    createFormVisible={relationsCreateFormVisible}
                    setCreateFormVisible={setCreateFormVisible}
                    selectedObjects={selectedObjects}
                    setSelectedObjects={setSelectedObjects}
                    tableSlug={tableSlug}
                    id={id}
                  />
                )}
              </TabPanel>
            ))}
          </Tabs>
        </Card>
      ) : null}
    </>
  )
}

export default RelationSection
