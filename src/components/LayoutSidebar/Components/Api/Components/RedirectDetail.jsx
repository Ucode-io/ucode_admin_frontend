import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { useState } from "react";
import styles from "../style.module.scss";
import FormCard from "../../../../FormCard";
import FRow from "../../../../FormElements/FRow";
import HFTextField from "../../../../FormElements/HFTextField";
import { useForm } from "react-hook-form";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
    // borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    borderRadius: 0,
    boxShadow: "none",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "#fff",
  flexDirection: "row-reverse",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: "15px",
  boxShadow: "none",
}));

const RedirectDetail = ({ apiControl, watch }) => {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  console.log("watch", watch());

  const mainForm = useForm({
    defaultValues: {
      defaultFrom: watch("base_url"),
      from: watch("additional_url"),
      defaultTo: "/",
    },
  });
  console.log("object", `${watch("base_url")} ${watch("additional_url")}`);
  return (
    <Box>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>Redirect</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FRow
            label={"From"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="defaultFrom"
              control={mainForm.control}
              fullWidth
              required
              disabled={true}
              style={{
                width: "70%",
              }}
            />
            <HFTextField
              disabledHelperText
              name="from"
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
          <FRow
            label={"To"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="defaultTo"
              control={mainForm.control}
              fullWidth
              required
              disabled={true}
              style={{
                width: "40%",
              }}
            />
            <HFTextField
              disabledHelperText
              name="to"
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default RedirectDetail;
