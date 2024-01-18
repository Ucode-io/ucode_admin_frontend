import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";
import styles from "./styles.module.scss";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

export default function EnvironmentsTable({
  environments,
  setSelectedEnvironment,
  selectedEnvironment,
  handleClose,
  setSelectedMigrate,
  selectedMigrate,
  company,
}) {
  const handleChange = (event) => {
    setSelectedEnvironment(event.target.value);
    if (event.target.value === company.environmentId) {
      setSelectedMigrate("down");
    } else {
      setSelectedMigrate("miggrate");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div className={styles.header}>
        <Typography variant="h4">
          {selectedEnvironment ? "Select migration" : "Select environment"}
        </Typography>
        <ClearIcon
          color="primary"
          onClick={handleClose}
          width="46px"
          style={{
            cursor: "pointer",
          }}
        />
      </div>
      {selectedEnvironment && (
        <Button
          className={styles.button}
          onClick={() => setSelectedEnvironment(null)}
        >
          <ArrowBackRoundedIcon />
        </Button>
      )}
      <Box className={styles.projectradio}>
        <RadioGroup key={selectedEnvironment}>
          <Box className={styles.projectgroup}>
            {environments?.map((item) => (
              <FormControlLabel
                value={item?.id}
                control={<Radio />}
                label={<h4>{item?.name} {item?.id === company.environmentId ? "(Down)" : "(Up)"}</h4>}
                className={
                  environments === item.id ? styles.active : styles.inactive
                }
                onChange={handleChange}
              />
            ))}
          </Box>
        </RadioGroup>
      </Box>
    </div>
  );
}
