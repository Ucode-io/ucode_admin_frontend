import { Delete } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Tab, TabList, Tabs, TabPanel } from "react-tabs"
import CancelButton from "../../../../components/Buttons/CancelButton"
import SaveButton from "../../../../components/Buttons/SaveButton"
import FRow from "../../../../components/FormElements/FRow"
import HFSelect from "../../../../components/FormElements/HFSelect"
import HFTextField from "../../../../components/FormElements/HFTextField"
import constructorViewService from "../../../../services/constructorViewService"
import { viewTypes } from "../../../../utils/constants/viewTypes"
import CalendarSettings from "./CalendarSettings"
import ColumnsTab from "./ColumnsTab"
import GroupsTab from "./GroupsTab"
import QuickFiltersTab from "./QuicFiltersTab"
import styles from "./style.module.scss"

const ViewForm = ({ initialValues, closeForm, refetchViews, closeModal, setIsChanged }) => {
  const { tableSlug } = useParams()
  const columns = useSelector(
    (state) => state.tableColumn.list[tableSlug] ?? []
  )

  const [btnLoader, setBtnLoader] = useState(false)
  const [deleteBtnLoader, setDeleteBtnLoader] = useState(false)

  const computedViewTypes = viewTypes?.map((el) => ({ value: el, label: el }))

  const form = useForm()

  const type = form.watch("type")

  useEffect(() => {
    form.reset(getInitialValues(initialValues, tableSlug, columns))
  }, [initialValues, tableSlug, form, columns])

  const onSubmit = (values) => {
    setBtnLoader(true)

    if (initialValues === "NEW") {
      constructorViewService
        .create(values)
        .then(() => {
          closeForm()
          refetchViews()
          setIsChanged(true)
        })
        .finally(() => setBtnLoader(false))
    } else {
      constructorViewService
        .update(values)
        .then(() => {
          closeForm()
          refetchViews()
          setIsChanged(true)
        })
        .finally(() => setBtnLoader(false))
    }
  }

  const deleteView = () => {
    setDeleteBtnLoader(true)
    constructorViewService
      .delete(initialValues.id)
      .then(() => {
        closeForm()
        refetchViews()
      })
      .catch(() => setDeleteBtnLoader(false))
  }

  return (
    <div className={styles.formSection}>
      <div className={styles.viewForm}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>Main info</div>
          </div>

          <div className={styles.sectionBody}>
            <div className={styles.formRow}>
              <FRow label="Название">
                <HFTextField control={form.control} name="name" fullWidth />
              </FRow>
              <FRow label="Тип">
                <HFSelect
                  options={computedViewTypes}
                  control={form.control}
                  name="type"
                  fullWidth
                />
              </FRow>
            </div>
          </div>
        </div>

        {type === "CALENDAR" && (
          <CalendarSettings form={form} columns={columns} />
        )}

        <Tabs>
          <div className={styles.section}>
            <TabList>
              <Tab>Quick filters</Tab>
              <Tab>Columns</Tab>
              <Tab>Group by</Tab>
            </TabList>
            <TabPanel>
              <QuickFiltersTab columns={columns} form={form} />
            </TabPanel>
            <TabPanel>
              <ColumnsTab columns={columns} form={form} />
            </TabPanel>
            <TabPanel>
              <GroupsTab columns={columns} form={form} />
            </TabPanel>
          </div>
        </Tabs>
      </div>

      <div className={styles.formFooter}>
        {initialValues !== "NEW" && (
          <CancelButton
            loading={deleteBtnLoader}
            onClick={deleteView}
            title={"Delete"}
            icon={<Delete />}
          />
        )}
        <CancelButton onClick={closeForm} />
        <SaveButton onClick={form.handleSubmit(onSubmit)} loading={btnLoader} />
      </div>
    </div>
  )
}

const getInitialValues = (initialValues, tableSlug, columns) => {
  if (initialValues === "NEW")
    return {
      type: "CALENDAR",
      users: [],
      name: "",
      main_field: "",
      disable_dates: {
        day_slug: "",
        table_slug: "",
        time_from_slug: "",
        time_to_slug: "",
      },
      columns: columns?.map(el => el.id) ?? [],
      quick_filters: [],
      group_fields: [],
      table_slug: tableSlug,
    }

  return {
    type: initialValues?.type ?? "TABLE",
    users: initialValues?.users ?? [],
    name: initialValues?.name ?? "",
    main_field: initialValues?.main_field ?? "",
    disable_dates: {
      day_slug: initialValues?.disable_dates?.day_slug ?? "",
      table_slug: initialValues?.disable_dates?.table_slug ?? "",
      time_from_slug: initialValues?.disable_dates?.time_from_slug ?? "",
      time_to_slug: initialValues?.disable_dates?.time_to_slug ?? "",
    },
    columns: initialValues?.columns ?? [],
    quick_filters: initialValues?.quick_filters ?? [],
    group_fields: initialValues?.group_fields ?? [],
    table_slug: tableSlug,
    id: initialValues?.id,
    calendar_from_slug: initialValues?.calendar_from_slug ?? "",
    calendar_to_slug: initialValues?.calendar_to_slug ?? "",
  }
}

export default ViewForm
