import { Skeleton } from "@mui/material"
import { CTableCell, CTableRow } from "../CTable";

export const TableDataSkeleton = ({
  rowLength = 12,
  colLength = 10,
  height = 22,
}) => {
  return (
    <>
      {Array.from({ length: rowLength }).map(() => (
        <CTableRow>
          {Array.from({ length: colLength })?.map(() => {
            return (
              <CTableCell>
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  height={height}
                  width="100%"
                />
              </CTableCell>
            );
          })}
        </CTableRow>
      ))}
    </>
  );
};
