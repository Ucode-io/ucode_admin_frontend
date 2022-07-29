import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useLocation, useParams } from "react-router-dom"
import PageFallback from "../../components/PageFallback"
import constructorObjectService from "../../services/constructorObjectService"
import constructorSectionService from "../../services/constructorSectionService"
import { sortByOrder } from "../../utils/sortByOrder"
import MainInfo from "./MainInfo"
import constructorRelationService from "../../services/constructorRelationService"
import RelationSection from "./RelationSection"
import styles from "./style.module.scss"
import Footer from "../../components/Footer"
import useTabRouter from "../../hooks/useTabRouter"
import PrimaryButton from "../../components/Buttons/PrimaryButton"
import { Save } from "@mui/icons-material"
import SecondaryButton from "../../components/Buttons/SecondaryButton"
import { useQueryClient } from "react-query"
import { sortSections } from "../../utils/sectionsOrderNumber"

const ObjectsFormPage = () => {
  const { tableSlug, id } = useParams()
  const { pathname, state = {} } = useLocation()
  const { removeTab, navigateToForm } = useTabRouter()
  const queryClient = useQueryClient()

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
          fields: section.fields?.sort(sortByOrder) ?? [],
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

      setSections(sortSections(sections))

      setTableRelations(
        relations
          .filter(
            (relation) =>
              relation.type === "Many2Many" ||
              relation.type === "Recursive" ||
              (relation.type === "Many2One" &&
                relation.table_to?.slug === tableSlug) ||
              (relation.type === "One2Many" &&
                relation.table_from?.slug === tableSlug)
          )
          .map((relation) => ({
            ...relation,
            relatedTable:
              relation.table_from?.slug === tableSlug
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

      const [{ sections = [] }, { relations = [] }] = await Promise.all([
        getSections,
        getRelations,
      ])

      setSections(sortSections(sections))

      setTableRelations(
        relations
          .filter(
            (relation) =>
              relation.type === "Many2Many" ||
              relation.type === "Recursive" ||
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
      .then(() => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug])
        removeTab(pathname)
      })
      .catch(() => setBtnLoader(false))
  }

  const create = (data) => {
    setBtnLoader(true)

    constructorObjectService
      .create(tableSlug, { data })
      .then((res) => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug])
        removeTab(pathname)
        // if (!state) navigateToForm(tableSlug, "EDIT", res.data?.data)
        if(tableRelations?.length) navigateToForm(tableSlug, "EDIT", res.data?.data)
      })
      .catch(() => setBtnLoader(false))
  }

  const onSubmit = (data) => {
    if (id) update(data)
    else create(data)
  }

  const { handleSubmit, control, reset } = useForm({
    defaultValues: state,
  })

  if (loader) return <PageFallback />

  return (
    <div className={styles.formPage}>
      <div className={styles.formArea}>
        <MainInfo control={control} computedSections={computedSections} />

        <div className={styles.secondaryCardSide}>
          {tableRelations?.map((relation) => (
            <RelationSection
              key={relation.id}
              relation={relation}
              control={control}
            />
          ))}
        </div>
      </div>

      <Footer
        extra={
          <>
            <SecondaryButton onClick={() => removeTab(pathname)} color="error">
              Закрыть
            </SecondaryButton>
            <PrimaryButton loader={btnLoader} onClick={handleSubmit(onSubmit)}>
              <Save /> Сохранить
            </PrimaryButton>
          </>
        }
      />
    </div>
  )
}

export default ObjectsFormPage
