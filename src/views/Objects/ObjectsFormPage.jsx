import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import SaveButton from "../../components/Buttons/SaveButton"
import FormCard from "./components/FormCard"
import FormElementGenerator from "../../components/FormElementGenerator"
import Header from "../../components/Header"
import PageFallback from "../../components/PageFallback"
import constructorFieldService from "../../services/constructorFieldService"
import constructorObjectService from "../../services/constructorObjectService"
import constructorSectionService from "../../services/constructorSectionService"
import { listToMap } from "../../utils/listToMap"
import styles from "./style.module.scss"
import { sortByOrder } from "../../utils/sortByOrder"

const ObjectsFormPage = () => {
  const { tableSlug, id } = useParams()
  const navigate = useNavigate()

  const tablesList = useSelector((state) => state.constructorTable.list)

  const [loader, setLoader] = useState(true)
  const [btnLoader, setBtnLoader] = useState(false)

  const [sections, setSections] = useState([])
  const [fields, setFields] = useState([])

  const tableInfo = useMemo(() => {
    return tablesList.find((el) => el.slug === tableSlug)
  }, [tablesList, tableSlug])

  const fieldsMap = useMemo(() => {
    return listToMap(fields)
  }, [fields])

  const computedSections = useMemo(() => {
    return sections?.map(section => ({
      ...section,
      column1: section.fields?.filter(field => field.column !== 2).sort(sortByOrder) ?? [],
      column2: section.fields?.filter(field => field.column === 2).sort(sortByOrder) ?? [],
    })).sort(sortByOrder) ?? []
  }, [sections])


  const getAllData = async () => {
    const getFields = constructorFieldService.getList({
      table_id: tableInfo.id,
    })
    const getSections = constructorSectionService.getList({
      table_id: tableInfo.id,
    })
    const getFormData = constructorObjectService.getById(tableSlug, id)

    try {
      const [{ fields = [] }, { sections = [] }, { data = {} }] =
        await Promise.all([getFields, getSections, getFormData])

      setFields(fields)
      setSections(sections)
      reset(data.response ?? {})
    } finally {
      setLoader(false)
    }
  }

  const getFields = async () => {
    const getFields = constructorFieldService.getList({
      table_id: tableInfo.id,
    })
    const getSections = constructorSectionService.getList({
      table_id: tableInfo.id,
    })

    try {
      const [{ fields = [] }, { sections = [] }] = await Promise.all([
        getFields,
        getSections,
      ])

      setFields(fields)
      setSections(sections)
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    if (!tableInfo) return
    if (id) getAllData()
    else getFields()
  }, [id, tableInfo])


  const update = (data) => {
    setBtnLoader(true)

    constructorObjectService
      .update(tableSlug, { data })
      .then(() => navigate(-1))
      .catch(() => setBtnLoader(false))
  }

  const create = (data) => {
    setBtnLoader(true)

    constructorObjectService
      .create(tableSlug, { data })
      .then(() => navigate(-1))
      .catch(() => setBtnLoader(false))
  }

  const onSubmit = (data) => {
    if (id) update(data)
    else create(data)
  }

  const { handleSubmit, control, reset } = useForm()

  if (loader) return <PageFallback />

  return (
    <div>
      <Header
        title={tableInfo.label}
        backButtonLink={-1}
        sticky
        subtitle={id ? "Edit" : "Create"}
        extra={<SaveButton loading={btnLoader} onClick={handleSubmit(onSubmit)} />}
      />

      <div className={styles.formArea}>
        <div className={styles.mainCardSide}>
          {computedSections.map((section) => (
            <FormCard
              key={section.id}
              title={section.label}
              className={styles.formCard}
            >
              <div className={styles.formColumn}>
              {section.column1?.map((field) => (
                <FormElementGenerator
                  key={field.id}
                  field={fieldsMap[field.id]}
                  control={control}
                />
              ))}
              </div>
              <div className={styles.formColumn}>
              {section.column2?.map((field) => (
                <FormElementGenerator
                  key={field.id}
                  field={fieldsMap[field.id]}
                  control={control}
                />
              ))}
              </div>
            </FormCard>
          ))}
        </div>

        <div className={styles.secondaryCardSide}></div>

      </div>
    </div>
  )
}

export default ObjectsFormPage
