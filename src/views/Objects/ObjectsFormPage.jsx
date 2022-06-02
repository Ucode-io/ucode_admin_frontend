import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import SaveButton from "../../components/Buttons/SaveButton"
import Header from "../../components/Header"
import PageFallback from "../../components/PageFallback"
import constructorObjectService from "../../services/constructorObjectService"
import constructorSectionService from "../../services/constructorSectionService"
import { sortByOrder } from "../../utils/sortByOrder"
import MainInfo from "./MainInfo"
import constructorRelationService from "../../services/constructorRelationService"
import RelationSection from "./RelationSection"
import styles from "./style.module.scss"

const ObjectsFormPage = () => {
  const { tableSlug, id } = useParams()
  const navigate = useNavigate()

  const tablesList = useSelector((state) => state.constructorTable.list)

  const [loader, setLoader] = useState(true)
  const [btnLoader, setBtnLoader] = useState(false)

  const [sections, setSections] = useState([])
  const [tableRelations, setTableRelations] = useState([])

  const tableInfo = useMemo(() => {
    return tablesList.find((el) => el.slug === tableSlug)
  }, [tablesList, tableSlug])

  const computedSections = useMemo(() => {
    return (
      sections
        ?.map((section) => ({
          ...section,
          fields: section.fields?.sort(sortByOrder) ?? []
        }))
        .sort(sortByOrder) ?? []
    )
  }, [sections])

  const getAllData = async () => {
    const getSections = constructorSectionService.getList({
      table_slug: tableSlug,
    })

    const getFormData = constructorObjectService.getById(tableSlug, id)

    const getRelations = constructorRelationService.getList({
      table_slug: tableSlug,
    })

    try {
      const [{ sections = [] }, { data = {} }, { relations = [] }] =
        await Promise.all([getSections, getFormData, getRelations])

      setSections(sections)

      setTableRelations(
        relations
          .filter(
            (relation) =>
              relation.type === 'Many2Many' || 
              (relation.type === "Many2One" &&
                relation.table_to?.slug === tableSlug) ||
              (relation.type === "One2Many" &&
                relation.table_from?.slug === tableSlug)
          )
          .map((relation) => ({
            ...relation,
            relatedTable:
              relation.table_from.slug === tableSlug
                ? relation.table_to
                : relation.table_from,
          }))
      )

      reset(data.response ?? {})
    } finally {
      setLoader(false)
    }
  }

  const getFields = async () => {
    try {

      const getRelations = constructorRelationService.getList({
        table_slug: tableSlug,
      })

      const getSections = constructorSectionService.getList({
        table_slug: tableSlug,
      })

      const [ {sections = []}, { relations = [] } ] = await Promise.all([getSections, getRelations])

      setSections(sections)

      setTableRelations(
        relations
          .filter(
            (relation) =>
              relation.type === 'Many2Many' || 
              (relation.type === "Many2One" &&
                relation.table_to?.slug === tableSlug) ||
              (relation.type === "One2Many" &&
                relation.table_from?.slug === tableSlug)
          )
          .map((relation) => ({
            ...relation,
            relatedTable:
              relation.table_from.slug === tableSlug
                ? relation.table_to
                : relation.table_from,
          }))
      )
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
      .then((res) => navigate(`/object/${tableSlug}/${res.data?.data?.guid}`))
      .catch(() => setBtnLoader(false))
  }

  const onSubmit = (data) => {
    if (id) update(data)
    else create(data)
  }

  const { handleSubmit, control, reset, getValues } = useForm()

  if (loader) return <PageFallback />

  return (
    <div>
      <Header
        title={tableInfo.label}
        backButtonLink={-1}
        sticky
        subtitle={
          id
            ? tableInfo.subtitle_field_slug
              ? getValues(tableInfo.subtitle_field_slug)
              : "Edit"
            : "Create"
        }
        extra={
          <SaveButton loading={btnLoader} onClick={handleSubmit(onSubmit)} />
        }
      ></Header>

      <div className={styles.formArea}>
        <MainInfo control={control} computedSections={computedSections} />

        <div className={styles.secondaryCardSide}>
          {tableRelations?.map((relation) => (
            <RelationSection key={relation.id} relation={relation} control={control} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default ObjectsFormPage
