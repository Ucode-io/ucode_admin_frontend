import cls from "./styles.module.scss";
import MaterialUIProvider from "@/providers/MaterialUIProvider";
import { Button, Flex, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon, ChevronRightIcon } from "@chakra-ui/icons";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import { useHeaderProps } from "./useHeaderProps";
import { TableActions } from "../TableActions";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import { ScreenOptions } from "../ScreenOptions";
import { AiProjectsModal } from "@/components/AiProjectsModal";

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
          <AiProjectsModal>
            <Button
              h="30px"
              ml="auto"
              variant="outline"
              colorScheme="gray"
              borderColor="#D0D5DD"
              color="#344054"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap="8px"
              borderRadius="8px"
              fontSize="14px"
              fontWeight={500}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.8332 11.666L8.33321 9.16602M12.5085 2.91602V1.66602M15.7913 4.21657L16.6752 3.33268M15.7913 10.8327L16.6752 11.7166M9.17517 4.21657L8.29128 3.33268M17.0918 7.49935H18.3418M5.10935 17.3899L12.8071 9.69216C13.1371 9.36214 13.3021 9.19714 13.3639 9.00686C13.4183 8.83949 13.4183 8.6592 13.3639 8.49183C13.3021 8.30156 13.1371 8.13655 12.8071 7.80654L12.1927 7.19216C11.8627 6.86214 11.6977 6.69714 11.5074 6.63531C11.34 6.58093 11.1597 6.58093 10.9924 6.63531C10.8021 6.69714 10.6371 6.86214 10.3071 7.19216L2.60935 14.8899C2.27934 15.2199 2.11433 15.3849 2.0525 15.5752C1.99812 15.7425 1.99812 15.9228 2.0525 16.0902C2.11433 16.2805 2.27934 16.4455 2.60935 16.7755L3.22373 17.3899C3.55375 17.7199 3.71875 17.8849 3.90903 17.9467C4.0764 18.0011 4.25669 18.0011 4.42405 17.9467C4.61433 17.8849 4.77934 17.7199 5.10935 17.3899Z"
                  stroke="#475467"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </AiProjectsModal>
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