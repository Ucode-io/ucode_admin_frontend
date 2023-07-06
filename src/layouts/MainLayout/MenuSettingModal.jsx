import {
  Box,
  Card,
  Modal,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import styles from "./style.module.scss";
import { useState } from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  card: {
    width: 300,
  },
  radio: {
    padding: "30px",
  },
});

const MenuSettingModal = ({ closeModal }) => {
  const classes = useStyles();
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <Modal open className={styles.modal} onClose={closeModal}>
        <Card className={styles.menu}>
          <div className={styles.header}>
            <Typography variant="h4">Layout settings</Typography>
            <ClearIcon
              color="primary"
              onClick={closeModal}
              width="46px"
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <Box className={styles.block}>
            <Box className={styles.section}>
              <Box className={styles.card}>
                <Typography h="4" className={styles.text}>
                  Style
                </Typography>
                <Box className={classes.card}>
                  <RadioGroup
                    name="options"
                    value={value}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="option1"
                      control={<Radio />}
                      className={classes.radio}
                    >
                      test
                    </FormControlLabel>
                    <FormControlLabel value="option2" control={<Radio />} />
                  </RadioGroup>
                </Box>
              </Box>
            </Box>
            <Box className={styles.section}>Sidebar</Box>
          </Box>
        </Card>
      </Modal>
    </div>
  );
};

export default MenuSettingModal;
