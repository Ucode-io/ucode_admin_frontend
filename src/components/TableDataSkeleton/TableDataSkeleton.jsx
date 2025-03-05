import { Skeleton } from "@mui/material"
import { CTableCell, CTableRow } from "../CTable";

export const TableDataSkeleton = ({ colLength = 10 }) => {
  return (
    <>
      {Array.from({ length: 12 }).map(() => (
        <CTableRow>
          {Array.from({ length: colLength })?.map(() => {
            return (
              <CTableCell>
                <Skeleton variant="rounded" height={22} width="100%" />
              </CTableCell>
            );
          })}
        </CTableRow>
      ))}
    </>
  );
};
