import { Fragment, useState } from "react";
import { Box, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
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

const AUTH_LABELS = { bearer: "User", api_key: "API key" };

// actor_name заполнен только у ключей; у Bearer показываем короткий id —
// резолвить имя на каждый запрос слишком дорого для бэка.
const senderLabel = (row) => {
  const name =
    row.actor_name || (row.actor_id ? `${row.actor_id.slice(0, 8)}…` : "");
  const auth = AUTH_LABELS[row.auth_type];
  if (auth && name) return `${auth} · ${name}`;
  return auth || name || "Not identified";
};

// Бэк отдаёт маршрут по строке на тип авторизации — человеку это одна строка.
const groupRoutes = (top) => {
  const groups = new Map();

  for (const row of top) {
    const key = `${row.source} ${routeLabel(row)}`;
    const group = groups.get(key);
    if (group) {
      group.count += row.count;
      group.percent = Math.round((group.percent + row.percent) * 100) / 100;
    } else {
      groups.set(key, { ...row, key });
    }
  }

  return [...groups.values()].sort((a, b) => b.count - a.count);
};

const subCell = { color: "#475467", fontSize: "12px" };

// Кто вызывал раскрытый маршрут. Свой компонент — свой запрос: он уходит
// только при раскрытии строки и кэшируется react-query.
const RouteSenders = ({ row, clientOnly }) => {
  const { data, isLoading } = useApiUsageBreakdownQuery({
    params: {
      group_by: "actor",
      route: row.route,
      method: row.method,
      ...(row.collection ? { collection: row.collection } : {}),
      ...(clientOnly ? { source: "client" } : {}),
      limit: 10,
    },
    queryParams: { staleTime: 60000 },
  });

  const senders = data?.top ?? [];

  return (
    <>
      {isLoading && (
        <CTableRow className={cls.row}>
          <CTableCell className={cls.tBodyCell} />
          <CTableCell className={cls.tBodyCell} style={subCell}>
            Loading…
          </CTableCell>
          <CTableCell className={cls.tBodyCell} />
          <CTableCell className={cls.tBodyCell} />
        </CTableRow>
      )}
      {senders.map((sender, index) => (
        <CTableRow key={index} className={cls.row}>
          <CTableCell className={cls.tBodyCell} />
          <CTableCell className={cls.tBodyCell} style={subCell}>
            {senderLabel(sender)}
          </CTableCell>
          <CTableCell className={cls.tBodyCell} style={subCell}>
            {numberWithSpaces(sender.count)}
          </CTableCell>
          {/* Доля — от запросов этого маршрута, а не от всего месяца. */}
          <CTableCell className={cls.tBodyCell} style={subCell}>
            {sender.percent}%
          </CTableCell>
        </CTableRow>
      ))}
    </>
  );
};

export const Usage = () => {
  const [clientOnly, setClientOnly] = useState(false);
  const [opened, setOpened] = useState({});

  // Чаще минуты обновлять нет смысла: до базы цифры доезжают раз в 10 минут,
  // а каждый запрос сюда сам расходует лимит.
  const { data, isLoading } = useApiUsageBreakdownQuery({
    params: {
      group_by: "route",
      limit: 10,
      ...(clientOnly ? { source: "client" } : {}),
    },
    queryParams: { staleTime: 60000 },
  });

  const rows = groupRoutes(data?.top ?? []);

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
            <CTableCell className={cls.tableHeadCell} width={110}>
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
                {rows.map((row) => {
                  const open = Boolean(opened[row.key]);

                  return (
                    <Fragment key={row.key}>
                      <CTableRow
                        className={cls.row}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setOpened((state) => ({ ...state, [row.key]: !open }))
                        }
                      >
                        <CTableCell className={cls.tBodyCell}>
                          <Box display="flex" alignItems="center" gap="4px">
                            {open ? (
                              <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                            ) : (
                              <KeyboardArrowRightIcon sx={{ fontSize: 16 }} />
                            )}
                            {row.source === "admin" ? "Admin" : "Client"}
                          </Box>
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

                      {open && <RouteSenders row={row} clientOnly={clientOnly} />}
                    </Fragment>
                  );
                })}
                {/* «Прочее» — хвост за пределами top и трафик до выката
                    разбивки. Маршрута у него нет — раскрывать нечего. */}
                {data?.other > 0 && (
                  <CTableRow className={cls.row}>
                    <CTableCell className={cls.tBodyCell}>Other</CTableCell>
                    <CTableCell className={cls.tBodyCell} />
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
