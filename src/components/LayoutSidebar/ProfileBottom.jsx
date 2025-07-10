import {
  Box,
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import {useEffect, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {languagesActions} from "../../store/globalLanguages/globalLanguages.slice";
import authService from "../../services/auth/authService";
import {generateLangaugeText} from "../../utils/generateLanguageText";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import LogoutIcon from "@mui/icons-material/Logout";
import {Logout} from "@mui/icons-material";
import {Modal} from "@mui/material";
import {menuAccordionActions} from "../../store/menus/menus.slice";
import {authActions} from "../../store/auth/auth.slice";
import {companyActions} from "../../store/company/company.slice";
import {store} from "../../store";

const ProfileBottom = ({projectInfo, menuLanguages}) => {
  const dispatch = useDispatch();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const projectId = useSelector((state) => state.company.projectId);
  const accessToken = useSelector((state) => state.auth?.token);

  const popoverRef = useRef();
  const {i18n} = useTranslation();
  const defaultLanguage = useSelector(
    (state) => state.languages.defaultLanguage
  );

  const [isOpenModal, setIsOpenModal] = useState(false);

  const onCloseModal = () => setIsOpenModal(false);
  const onOpenModal = () => setIsOpenModal(true);

  useOutsideClick({
    ref: popoverRef,
    handler: () => onClose(),
  });

  const languages = useMemo(() => {
    return projectInfo?.language?.map((lang) => ({
      title: lang?.name,
      slug: lang?.short_name,
    }));
  }, [projectInfo]);

  const getDefaultLanguage = () => {
    const isLanguageExist = languages?.some(
      (item) => defaultLanguage === item?.slug
    );

    if (languages?.length) {
      if (languages?.length === 1) {
        dispatch(languagesActions.setDefaultLanguage(languages?.[0]?.slug));
        localStorage.setItem("defaultLanguage", languages?.[0]?.slug);
        i18n.changeLanguage(languages?.[0]?.slug);
      } else if (languages?.length > 1) {
        if (!defaultLanguage) {
          dispatch(languagesActions.setDefaultLanguage(languages?.[0]?.slug));
          localStorage.setItem("defaultLanguage", languages?.[0]?.slug);
          i18n.changeLanguage(languages?.[0]?.slug);
        } else if (defaultLanguage && isLanguageExist) {
          dispatch(languagesActions.setDefaultLanguage(defaultLanguage));
          localStorage.setItem("defaultLanguage", defaultLanguage);
          i18n.changeLanguage(defaultLanguage);
        } else {
          dispatch(languagesActions.setDefaultLanguage(languages?.[0]?.slug));
          localStorage.setItem("defaultLanguage", languages?.[0]?.slug);
          i18n.changeLanguage(languages?.[0]?.slug);
        }
      }
    }
  };

  useEffect(() => {
    getDefaultLanguage();
  }, [languages?.length]);

  const logoutClickHandler = () => {
    authService.sendAccessToken({access_token: accessToken}).then((res) => {
      indexedDB.deleteDatabase("SearchTextDB");
      indexedDB.deleteDatabase("ChartDB");
      dispatch(menuAccordionActions.toggleMenuChilds({}));
      store.dispatch(authActions.logout());
      dispatch(companyActions.setCompanies([]));
    });
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    dispatch(languagesActions.setDefaultLanguage(lang));
    localStorage.setItem("defaultLanguage", lang);
    onClose();
  };

  useEffect(() => {
    if (projectInfo?.project_id) {
      dispatch(languagesActions.setLanguagesItems(languages));
    }
  }, [languages, projectInfo?.project_id, dispatch]);

  return (
    <Box p={8} ref={popoverRef}>
      <Popover
        isOpen={isOpen}
        onClose={onClose}
        placement="right-start"
        closeOnBlur={false}>
        <PopoverTrigger>
          <Box
            sx={{
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              paddingLeft: "8px",
              height: "32px",
              cursor: "pointer",
              color: "#475467",
            }}
            _hover={{background: "#eeee"}}
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}>
            <GTranslateIcon style={{color: "#475467"}} />
            <span>
              {" "}
              {generateLangaugeText(
                menuLanguages,
                i18n?.language,
                "Languages"
              ) || "Languages"}
            </span>
          </Box>
        </PopoverTrigger>

        <PopoverContent w="250px">
          <Box
            minH={50}
            maxH={250}
            bg={"white"}
            p={4}
            borderRadius={5}
            boxShadow="0 0 5px rgba(145, 158, 171, 0.3)">
            <PopoverBody>
              {languages?.map((item) => (
                <Box
                  key={item.slug}
                  p={4}
                  borderRadius="6px"
                  cursor="pointer"
                  color={item.slug === defaultLanguage ? "#000" : "#333"}
                  bg={item.slug === defaultLanguage ? "#E5E5E5" : "white"}
                  _hover={{bg: "#F0F0F0"}}
                  onClick={() => changeLanguage(item.slug)}>
                  {item.title}
                </Box>
              ))}
            </PopoverBody>
          </Box>
        </PopoverContent>
      </Popover>

      <Box
        sx={{
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingLeft: "8px",
          height: "32px",
          cursor: "pointer",
          color: "#475467",
        }}
        _hover={{background: "#eeee"}}
        onClick={onOpenModal}>
        <Logout style={{color: "#475467"}} />
        <span>
          {generateLangaugeText(menuLanguages, i18n?.language, "Log out") ||
            "Log out"}
        </span>
      </Box>

      <Modal open={isOpenModal} onClose={onCloseModal}>
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            borderRadius: "12px",
            outline: "none",
            width: 400,
            padding: "20px",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <LogoutIcon style={{width: "48", height: "28px"}} />
          </Box>

          <Box fontWeight={700} fontSize={"18px"}>
            {generateLangaugeText(
              menuLanguages,
              i18n?.language,
              "Log out of your account"
            ) || "Log out of your account"}
          </Box>

          <Box mt={5} fontWeight={400} fontSize={"12px"}>
            {generateLangaugeText(
              menuLanguages,
              i18n?.language,
              "You will need to log back in to access your workspace."
            )}
          </Box>

          <Box mt={20} display="flex" flexDirection="column" gap={1}>
            <Button
              cursor={"pointer"}
              borderRadius={8}
              border="none"
              fontSize={14}
              fullWidth
              bg={"#a63431"}
              color="#fff"
              _hover={{bg: "#a63400"}}
              style={{height: "40px"}}
              onClick={logoutClickHandler}>
              {generateLangaugeText(menuLanguages, i18n?.language, "Logout") ||
                "Logout"}
            </Button>
            <Button
              mt={5}
              cursor={"pointer"}
              borderRadius={8}
              fontSize={14}
              fullWidth
              bg={"#fff"}
              _hover={{bg: "#eee"}}
              border="2px solid #eee"
              style={{height: "40px"}}
              onClick={onCloseModal}>
              {generateLangaugeText(menuLanguages, i18n?.language, "Cancel") ||
                "Cancel"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfileBottom;
