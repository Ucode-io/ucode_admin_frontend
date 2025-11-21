import cls from "./styles.module.scss";
import MaterialUIProvider from "@/providers/MaterialUIProvider";
import { Flex, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon, ChevronRightIcon } from "@chakra-ui/icons";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import { useHeaderProps } from "./useHeaderProps";
import { TableActions } from "../TableActions";
import { AIButton } from "../AIButton";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import { ScreenOptions } from "../ScreenOptions";

export const Header = ({ tableName, data }) => {
  const {
    navigate,
    tableSlug,
    tableLan,
    isRelationView,
    handleCloseDrawer,
    handleSpaceDashboardClick,
    viewsList,
    handleBreadCrumb,
  } = useHeaderProps({ data });

  return (
    <div className={cls.header}>
      {isRelationView && (
        <IconButton
          aria-label="back"
          icon={<ArrowBackIcon fontSize={20} color="#344054" />}
          variant="ghost"
          colorScheme="gray"
          onClick={() => {
            handleCloseDrawer();
          }}
          size="sm"
        />
      )}

      {isRelationView && (
        <MaterialUIProvider>
          <div className={cls.screenOptions}>
            <ScreenOptions />
            <div
              onClick={handleSpaceDashboardClick}
              className={cls.screenOption}
            >
              <SpaceDashboardIcon />
            </div>
          </div>
        </MaterialUIProvider>
      )}

      <IconButton
        aria-label="home"
        icon={<img src="/img/home.svg" alt="home" />}
        variant="ghost"
        colorScheme="gray"
        onClick={() => navigate("/")}
        ml="8px"
        size="sm"
      />
      {viewsList?.length && isRelationView ? (
        viewsList?.map((item, index) => (
          <>
            <Flex
              py="4px"
              px="8px"
              bg="#EAECF0"
              borderRadius={6}
              color="#344054"
              cursor={"pointer"}
              fontWeight={500}
              alignItems="center"
              columnGap="8px"
              onClick={() => {
                handleBreadCrumb(item, index);
              }}
            >
              <Flex
                w="16px"
                h="16px"
                bg="#EE46BC"
                borderRadius={4}
                columnGap={8}
                color="#fff"
                fontWeight={500}
                fontSize={11}
                justifyContent="center"
                alignItems="center"
              >
                {item?.label?.[0]}
              </Flex>
              {item?.label}
            </Flex>
            {index !== viewsList?.length - 1 && (
              <ChevronRightIcon fontSize={20} color="#344054" />
            )}
          </>
        ))
      ) : (
        <div className={cls.tableName}>
          <div className={cls.tableNameChar}>{tableName?.[0]}</div>
          {tableName}
        </div>
      )}

      {!isRelationView && (
        <Flex position="absolute" right="16px" gap="8px">
          <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
            <TableActions tableSlug={tableSlug} tableLan={tableLan} />
          </PermissionWrapperV2>
          <AIButton />
        </Flex>
      )}

      {/* <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
<Button
  h="30px"
  ml="auto"
  onClick={navigateToSettingsPage}
  variant="outline"
  colorScheme="gray"
  borderColor="#D0D5DD"
  color="#344054"
  leftIcon={<Image src="/img/settings.svg" alt="settings" />}
  borderRadius="8px"
>
  {generateLangaugeText(
    tableLan,
    i18n?.language,
    "Table Settings"
  ) || "Table Settings"}
</Button>
</PermissionWrapperV2> */}
    </div>
  );
};