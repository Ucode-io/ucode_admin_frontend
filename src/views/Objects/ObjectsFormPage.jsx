import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useLocation, useParams } from "react-router-dom"
import PageFallback from "../../components/PageFallback"
import constructorObjectService from "../../services/constructorObjectService"
import constructorSectionService from "../../services/constructorSectionService"
import { sortByOrder } from "../../utils/sortByOrder"
import MainInfo from "./MainInfo"
import RelationSection from "./RelationSection"
import styles from "./style.module.scss"
import Footer from "../../components/Footer"
import useTabRouter from "../../hooks/useTabRouter"
import PrimaryButton from "../../components/Buttons/PrimaryButton"
import { Save } from "@mui/icons-material"
import SecondaryButton from "../../components/Buttons/SecondaryButton"
import { useQueryClient } from "react-query"
import { sortSections } from "../../utils/sectionsOrderNumber"
import constructorViewRelationService from "../../services/constructorViewRelationService"
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2"
import FiltersBlock from "../../components/FiltersBlock"
import DocumentGeneratorButton from "./components/DocumentGeneratorButton"

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

    const getRelations = constructorViewRelationService.getList({
      table_slug: tableSlug,
    })

    try {
      const [{ sections = [] }, { data = {} }, { relations = [] }] =
        await Promise.all([getSections, getFormData, getRelations])

      setSections(sortSections(sections))

      setTableRelations(relations?.sort(sortByOrder)?.map(el => el.relation ?? {}))
      // const relations =
      //   view_relations?.map((el) => ({
      //     ...el,
      //     ...el.relation,
      //   })) ?? {}

      // setTableRelations(
      //   relations
      //     .filter(
      //       (relation) =>
      //         relation.type === "Many2Many" ||
      //         relation.type === "Recursive" ||
      //         (relation.type === "Many2One" &&
      //           relation.table_to === tableSlug) ||
      //         (relation.type === "One2Many" &&
      //           relation.table_from === tableSlug)
      //     )
      //     .map((relation) => ({
      //       ...relation,
      //       relatedTable:
      //         relation.table_from === tableSlug
      //           ? relation.table_to
      //           : relation.table_from,
      //     }))
      //     .sort(sortByOrder)
      // )

      reset(data.response ?? {})
    } catch (error) {
      console.error(error)
    } finally {
      setLoader(false)
    }
  }

  const getFields = async () => {
    try {
      const getSections = constructorSectionService.getList({
        table_slug: tableSlug,
      })

      const getRelations = constructorViewRelationService.getList({
        table_slug: tableSlug,
      })

      const [{ sections = [] }, { view_relations = [] }] = await Promise.all([
        getSections,
        getRelations,
      ])

      const relations =
        view_relations?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? []

      setSections(sortSections(sections))

      setTableRelations(
        relations
          .filter(
            (relation) =>
              relation.type === "Many2Many" ||
              relation.type === "Recursive" ||
              (relation.type === "Many2One" &&
                relation.table_to === tableSlug) ||
              (relation.type === "One2Many" &&
                relation.table_from === tableSlug)
          )
          .map((relation) => ({
            ...relation,
            relatedTable:
              relation.table_from === tableSlug
                ? relation.table_to
                : relation.table_from,
          }))
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoader(false)
    }
  }

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
        if (tableRelations?.length)
          navigateToForm(tableSlug, "EDIT", res.data?.data)
      })
      .catch(() => setBtnLoader(false))
  }

  const onSubmit = (data) => {
    if (id) update(data)
    else create(data)
  }

  useEffect(() => {
    if (!tableInfo) return
    if (id) getAllData()
    else getFields()
  }, [id, tableInfo])

  const {
    handleSubmit,
    control,
    reset,
    setValue: setFormValue,
  } = useForm({
    defaultValues: state,
  })

  if (loader) return <PageFallback />

  return (
    <div className={styles.formPage}>
      <FiltersBlock
        extra={
          <DocumentGeneratorButton />
        }
      />

      <div className={styles.formArea}>
        <MainInfo
          control={control}
          computedSections={computedSections}
          setFormValue={setFormValue}
        />

        <div className={styles.secondaryCardSide}>
          <RelationSection relations={tableRelations} control={control}  />
        </div>
      </div>

      <Footer
        extra={
          <>
            <SecondaryButton onClick={() => removeTab(pathname)} color="error">
              Закрыть
            </SecondaryButton>
            <PermissionWrapperV2 tabelSlug={tableSlug} type="update">
              <PrimaryButton
                loader={btnLoader}
                onClick={handleSubmit(onSubmit)}
              >
                <Save /> Сохранить
              </PrimaryButton>
            </PermissionWrapperV2>
          </>
        }
      />
    </div>
  )
}

export default ObjectsFormPage
