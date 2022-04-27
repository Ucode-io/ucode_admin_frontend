import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Tab, TabList, Tabs, TabPanel } from "react-tabs"
import SaveButton from "../../../../components/Buttons/SaveButton"
import Header from "../../../../components/Header"
import PageFallback from "../../../../components/PageFallback"
import { createConstructorTableAction, updateConstructorTableAction } from "../../../../store/contructorTable/contructorTable.thunk"
import MainInfo from "./MainInfo"

const ContructorTablesFormPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const constructorTables = useSelector((state) => state.contructorTable.list)
  const loader = useSelector((state) => state.contructorTable.loader)

  const [btnLoader, setBtnLoader] = useState(false)

  const selectedConstructorTable = useMemo(() => {
    return constructorTables.find((item) => item.id === id)
  }, [constructorTables, id])

  const { handleSubmit, control, setValue} = useForm({
    defaultValues: {
      show_in_menu: true,
      fields: [],
      label: "",
      description: "",
      slug: "",
      icon: "",
    },
  })

  const createConstructorTable = (data) => {
    setBtnLoader(true)

    dispatch(createConstructorTableAction(data))
      .unwrap()
      .then((res) => {
        navigate("/constructor/tables")
      })
      .catch(() => setBtnLoader(false))
  }

  const updateConstructorTable = (data) => {
    setBtnLoader(true)

    dispatch(updateConstructorTableAction(data))
      .unwrap()
      .then((res) => {
        navigate("/constructor/tables")
      })
      .catch(() => setBtnLoader(false))
  }

  const onSubmit = (data) => {
    if (id) updateConstructorTable(data)
    else createConstructorTable(data)
  }

  useEffect(() => {
    if(loader) return
    if (!id || !selectedConstructorTable) return 

    setValue("description", selectedConstructorTable?.description)
    setValue("slug", selectedConstructorTable?.slug)
    setValue("icon", selectedConstructorTable?.icon)
    setValue("label", selectedConstructorTable?.label)
    setValue("fields", selectedConstructorTable?.fields)
    setValue("show_in_menu", selectedConstructorTable?.show_in_menu)
    setValue("id", selectedConstructorTable?.id)

  }, [loader, id, selectedConstructorTable, setValue])

  if (loader) return <PageFallback />

  return (
    <div>
      <Tabs direction={"ltr"}>
        <Header
          title="Объекты"
          subtitle={id ? selectedConstructorTable?.label : "Добавить"}
          icon={selectedConstructorTable?.icon}
          backButtonLink={-1}
          extra={
            <SaveButton onClick={handleSubmit(onSubmit)} loading={btnLoader} />
          }
        >
          <TabList>
            <Tab>Details</Tab>
            <Tab>Layouts</Tab>
            <Tab>Fields</Tab>
          </TabList>
        </Header>

        <TabPanel>
          <MainInfo control={control} />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default ContructorTablesFormPage
