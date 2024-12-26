import {useMemo} from "react";

function AggridDefaultComponents() {
  const defaultColDef = useMemo(
    () => ({
      width: 200,
      autoHeaderHeight: true,
      suppressServerSideFullWidthLoadingRow: true,
    }),
    []
  );

  const autoGroupColumnDef = useMemo(() => ({minWidth: 230}), []);
  const rowSelection = useMemo(() => ({mode: "multiRow"}), []);
  return {
    defaultColDef,
    autoGroupColumnDef,
    rowSelection,
  };
}

export default AggridDefaultComponents;
