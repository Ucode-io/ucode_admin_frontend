import { Checkbox, TableCell, TableRow } from "@mui/material";
import React, { useMemo } from "react";
import { struct } from "pb-util";
import { useTranslation } from "react-i18next";

export default function HistoryRow({ history, index, handleSelectVersion, selectedVersions }) {
  const { i18n } = useTranslation();

  const label = useMemo(() => {
    return struct.decode(history.current.attributes ?? {})?.[`label_${i18n.language}`];
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
