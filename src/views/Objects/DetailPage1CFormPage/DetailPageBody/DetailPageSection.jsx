import React, {useState, useEffect} from "react";
import styles from "./style.module.scss";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import {useTranslation} from "react-i18next";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Form1CElementGenerator from "../Form1CElementGenerator";

function DetailPageSection({item, control}) {
  const {i18n} = useTranslation();
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    if (item?.sections) {
      setExpanded(new Array(item.sections.length).fill(true));
    }
  }, [item]);

  const handleChange = (index) => (event, isExpanded) => {
    setExpanded((prev) => {
      const newExpanded = [...prev];
      newExpanded[index] = isExpanded;
      return newExpanded;
    });
  };

  return (
    <div className={styles.tabSections} id="detailPage">
      {item?.sections?.map((section, index) => {
        const fieldCount = section?.attributes?.field_count || 1;
        const fields = section?.fields || [];
        return (
          <Accordion
            key={index}
            expanded={expanded[index] || false}
            onChange={handleChange(index)}>
            <AccordionSummary
              sx={{
                padding: "0 24px 0 20px",
                borderBottom: "1px solid #EAECF0",
                borderTop: "1px solid #EAECF0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}>
              <Typography
                sx={{
                  fontWeight: "500",
                  color: "#101828",
                  fontSize: "16px",
                }}>
                {section?.attributes?.[`label_${i18n?.language}`] ||
                  "No Section Name!"}
              </Typography>
              <Box
                sx={{
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                {expanded?.[index] ? (
                  <KeyboardArrowDownIcon sx={{fontSize: "20px"}} />
                ) : (
                  <ArrowForwardIosIcon sx={{fontSize: "12px"}} />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                display: "grid",
                gridTemplateColumns: `repeat(${fieldCount}, 1fr)`,
                gap: "18px",
                padding: "24px",
              }}>
              {fields.map((field, idx) => (
                <Box
                  key={field.id}
                  sx={{
                    gridColumn:
                      idx % fieldCount === 0 && idx === fields.length - 1
                        ? `span ${fieldCount}`
                        : "auto",
                  }}>
                  <Form1CElementGenerator control={control} field={field} />
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}

export default DetailPageSection;
