import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Button,
} from "@mui/material";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import ThemeCard from "./ThemeCard";
import { Left } from "../../assets/icons/icon";
import {
  useMenuTemplateDeleteMutation,
  useMenuTemplateListQuery,
} from "../../services/menuTemplateService";
import { useQueryClient } from "react-query";
import RingLoader from "../Loaders/RingLoader";

const MenuSettingTheme = ({
  setModalType,
  setSelectedTemplate,
  check,
  setCheck,
}) => {
  const queryClient = useQueryClient();
  const [template, setTemplate] = useState("");
  console.log("template", template);

  const handleTemplateChange = (event) => {
    setTemplate(event.target.value);
  };
  const { mutate: deleteCustomError, isLoading: deleteLoading } =
    useMenuTemplateDeleteMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["MENU_TEMPLATE"]);
      },
    });

  const deleteTemplate = (id) => {
    deleteCustomError(id);
  };
  const { data: templates, isLoading } = useMenuTemplateListQuery({});
  useEffect(() => {
    if (check) {
      setTemplate(check);
      setCheck(false);
    }
  }, []);
  return (
    <>
      <div className={styles.header}>
        <Typography
          variant="h4"
          onClick={() => {
            setModalType("SETTING");
          }}
        >
          <Left /> Layout settings
        </Typography>
      </div>
      <div className={styles.block}>
        {isLoading ? (
          <RingLoader />
        ) : (
          <Box className={styles.radio}>
            <RadioGroup
              name="type"
              value={template}
              onChange={handleTemplateChange}
            >
              <Box className={styles.group}>
                {templates?.menu_templates?.map((item) => (
                  <FormControlLabel
                    value={item?.id}
                    defaultChecked={
                      item?.id === "7545c040-c56a-423e-b764-7205157d79fb"
                    }
                    checked={
                      item?.id === "7545c040-c56a-423e-b764-7205157d79fb"
                    }
                    key={item?.id}
                    control={<Radio />}
                    label={
                      <ThemeCard item={item} deleteTemplate={deleteTemplate} />
                    }
                    onClick={() => {
                      setSelectedTemplate(item);
                    }}
                    className={
                      template === item?.id ? styles.active : styles.inactive
                    }
                  />
                ))}
              </Box>
            </RadioGroup>
          </Box>
        )}
      </div>
      <div className={styles.footer}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalType("SETTING")}
        >
          Apply
        </Button>
        <Button
          color="primary"
          style={{
            background: "#2D6CE51A",
          }}
          onClick={() => setModalType("MENUFORM")}
        >
          Create
        </Button>
      </div>
    </>
  );
};

export default MenuSettingTheme;
