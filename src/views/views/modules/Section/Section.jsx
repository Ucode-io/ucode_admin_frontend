import cls from "./styles.module.scss";
import { Box, CircularProgress } from "@chakra-ui/react"
import { lazy, Suspense } from "react"
import { useSectionProps } from "./useSectionProps"

const DrawerFormDetailPage = lazy(
  () => import("../../components/DrawerDetailPage/DrawerFormDetailPage")
);

export const Section = () => {

  const { 
    view,
    selectedTabIndex,
    layoutData,
    layout,
    rootForm,
    onSectionSubmit,
    selectedRow,
    fieldsMap,
    projectInfo,
    updateLayout,
    handleMouseDown,
  } = useSectionProps()

  return <Box px={10}>
  <form onSubmit={rootForm.handleSubmit(onSectionSubmit)}>
    <Suspense
      fallback={
        <div className={cls.fallback} >
          <CircularProgress />
        </div>
      }
    >
      <DrawerFormDetailPage
        view={view}
        rootForm={rootForm}
        layout={layout}
        selectedTab={layout?.tabs?.[0]}
        selectedTabIndex={selectedTabIndex}
        data={layoutData}
        selectedRow={selectedRow}
        fieldsMap={fieldsMap}
        projectInfo={projectInfo}
        updateLayout={updateLayout}
        handleMouseDown={handleMouseDown}
      />
    </Suspense>
  </form>
</Box>
}