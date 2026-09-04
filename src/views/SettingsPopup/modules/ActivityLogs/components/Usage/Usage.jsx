import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Flex, Switch, Text } from "@chakra-ui/react";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "@/components/CTable";
import EmptyDataComponent from "@/components/EmptyDataComponent";
import TableCard from "@/components/TableCard";
import { TableDataSkeleton } from "@/components/TableDataSkeleton";
import { ContentTitle } from "../../../../components/ContentTitle";
import { numberWithSpaces } from "@/utils/formatNumbers";
import { useApiUsageBreakdownQuery } from "@/services/pricingService";
import cls from "../../styles/styles.module.scss";

// Маршрут приходит шаблоном (/v2/items/:collection), таблица — отдельным полем.
const routeLabel = (row) =>
  `${row.method} ${row.collection ? row.route.replace(":collection", row.collection) : row.route}`;

export const Usage = () => {
  const [clientOnly, setClientOnly] = useState(false);

  // Чаще минуты обновлять нет смысла: до базы цифры доезжают раз в 10 минут,
  // а каждый запрос сюда сам расходует лимит.
  const { data, isLoading } = useApiUsageBreakdownQuery({
    params: { limit: 10 },
    queryParams: { staleTime: 60000 },
  });

  const top = data?.top ?? [];
  // source у ручки нет — админский трафик (работа в билдере) фильтруем на фронте.
  const rows = clientOnly ? top.filter((row) => row.source === "client") : top;

  const percentUsed =
    data && !data.unlimited && data.limit
      ? Math.min(100, (data.used / data.limit) * 100)
      : null;

  return (
    <Box marginTop="20px" height="100%">
      <ContentTitle
        subtitle={
          data
            ? data.unlimited
              ? `${numberWithSpaces(data.used)} requests, no limit`
              : `${numberWithSpaces(data.used)} of ${numberWithSpaces(data.limit)} requests this month`
            : ""
        }
      >
        <Box height="28.8px">Usage</Box>
      </ContentTitle>

      {data?.blocked && (
        <Typography sx={{ color: "#D92D20", fontSize: "13px", mb: 1 }}>
          Monthly API limit exceeded — the client API is responding with 402
        </Typography>
      )}
      {!data?.blocked && percentUsed > 80 && (
        <Typography sx={{ color: "#B54708", fontSize: "13px", mb: 1 }}>
          {Math.round(percentUsed)}% of the monthly API limit is used
        </Typography>
      )}

      <Flex align="center" gap="8px" mb="8px">
        <Switch
          size="sm"
          isChecked={clientOnly}
          onChange={(event) => setClientOnly(event.target.checked)}
        />
        <Text fontSize="12px" color="#475467">
          Client API only
        </Text>
      </Flex>

      <TableCard cardStyles={{ padding: "1px", height: "100%" }}>
        <CTable
          loader={false}
          removableHeight={false}
          disablePagination
          wrapperStyle={{ height: "100%" }}
        >
          <CTableHead>
            <CTableCell className={cls.tableHeadCell} width={90}>
              Source
            </CTableCell>
            <CTableCell className={cls.tableHeadCell}>Request</CTableCell>
            <CTableCell className={cls.tableHeadCell} width={110}>
              Requests
            </CTableCell>
            <CTableCell className={cls.tableHeadCell} width={80}>
              Share
            </CTableCell>
          </CTableHead>
          <CTableBody
            loader={isLoading}
            columnsCount={4}
            dataLength={rows.length}
            style={{ height: "100%" }}
          >
            {isLoading ? (
              <TableDataSkeleton colLength={4} rowLength={10} height={33} />
            ) : (
              <>
                {rows.map((row) => (
                  <CTableRow
                    className={cls.row}
                    key={`${row.source}-${routeLabel(row)}`}
                  >
                    <CTableCell className={cls.tBodyCell}>
                      {row.source === "admin" ? "Builder" : "Client"}
                    </CTableCell>
                    <CTableCell className={cls.tBodyCell}>
                      {routeLabel(row)}
                    </CTableCell>
                    <CTableCell className={cls.tBodyCell}>
                      {numberWithSpaces(row.count)}
                    </CTableCell>
                    <CTableCell className={cls.tBodyCell}>
                      {row.percent}%
                    </CTableCell>
                  </CTableRow>
                ))}
                {/* «Прочее» — хвост за пределами top и трафик до выката
                    разбивки. Источника у него нет, в клиентском срезе не показываем. */}
                {!clientOnly && data?.other > 0 && (
                  <CTableRow className={cls.row}>
                    <CTableCell className={cls.tBodyCell} />
                    <CTableCell className={cls.tBodyCell}>Other</CTableCell>
                    <CTableCell className={cls.tBodyCell}>
                      {numberWithSpaces(data.other)}
                    </CTableCell>
                    <CTableCell className={cls.tBodyCell} />
                  </CTableRow>
                )}
              </>
            )}
            <EmptyDataComponent
              columnsCount={4}
              isVisible={!isLoading && !rows.length}
            />
          </CTableBody>
        </CTable>
      </TableCard>
    </Box>
  );
};
