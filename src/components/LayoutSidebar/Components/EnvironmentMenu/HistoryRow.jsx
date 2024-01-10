import { Checkbox, TableCell, TableRow } from "@mui/material";
import React, { useMemo } from "react";
import { struct } from "pb-util";
import { useTranslation } from "react-i18next";

export default function HistoryRow({ history, index, handleSelectVersion, selectedVersions }) {
  const { i18n } = useTranslation();
  const decodedCurrentAttributes = struct.decode(history?.current?.attributes ?? {});
  const decodedPreviousAttributes = struct.decode(history?.previus?.attributes ?? {});
  const multiLanguageLabel = `label_${i18n.language}`;

  const label = useMemo(() => {
    if (history?.action_type === "CREATE" || history?.action_type === "BULKWRITE") {
      switch (history?.action_source) {
        case "RELATION":
          return history?.current?.table_from?.label + " ==> " + history?.current?.table_to?.label;
        default:
          return decodedCurrentAttributes[multiLanguageLabel] ?? history.current?.label;
      }
    } else if (history?.action_type === "UPDATE") {
      switch (history?.action_source) {
        case "RELATION":
          return history?.current?.table_from?.label + " ==> " + history?.current?.table_to?.label;
        default:
          return decodedCurrentAttributes[multiLanguageLabel] ?? decodedCurrentAttributes.label;
      }
    } else if (history?.action_type === "DELETE") {
      switch (history?.action_source) {
        case "RELATION":
          return decodedPreviousAttributes[multiLanguageLabel] ?? decodedPreviousAttributes.label;
        default:
          return decodedPreviousAttributes[multiLanguageLabel] ?? decodedPreviousAttributes.label;
      }
    }
  }, [history, i18n.language]);

  return (
    <TableRow key={history.id}>
      <TableCell align="center" component="th" scope="row" sx={{ padding: "16px 24px 16px 16px !important" }}>
        <Checkbox onChange={(e) => handleSelectVersion(e, index)} checked={selectedVersions.find((version) => version.id === history.id) ? true : false} />
      </TableCell>

      <TableCell align="left" sx={{ padding: "16px 24px 16px 16px !important" }}>
        {history.action_type}
      </TableCell>
      <TableCell align="left" sx={{ padding: "16px 24px 16px 16px !important" }}>
        {history.action_source}
      </TableCell>
      <TableCell align="left" sx={{ padding: "16px 24px 16px 16px !important" }}>
        {label}
      </TableCell>
    </TableRow>
  );
}
