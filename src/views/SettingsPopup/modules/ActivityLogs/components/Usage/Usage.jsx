import { Fragment, useState } from "react";
import { Box, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Flex,
  Switch,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
} from "@chakra-ui/react";
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
import styles from "../../styles.module.scss";

const GROUPS = [
  { key: "route", label: "Request" },
  { key: "actor", label: "Sender" },
  { key: "collection", label: "Table" },
  { key: "time", label: "Time" },
];

// Маршрут приходит шаблоном (/v2/items/:collection), таблица — отдельным полем.
const routeLabel = (row) =>
  `${row.method} ${row.collection ? row.route.replace(":collection", row.collection) : row.route}`;

// actor_name заполнен только у ключей. У Bearer его нет — показываем id
// пользователя, резолвить имя на каждый запрос слишком дорого для бэка.
const senderLabel = (row) =>
  row.actor_name || row.actor_id || "Not identified";

// Ведро приходит без таймзоны, но оно в UTC — иначе браузер прочитает его
// как локальное время и сдвинет график.
const timeLabel = (bucket) => {
  if (!bucket) return "";
  const date = new Date(`${bucket.replace(" ", "T")}Z`);
  if (Number.isNaN(date.getTime())) return bucket;
  return date.toLocaleString([], {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const FILTER_LABELS = {
  route: "Request",
  collection: "Table",
  actor_id: "Sender",
  auth_type: "Auth",
  method: "Method",
};

// Те же подписи, что в разрезе Sender: bearer — человек, api_key — интеграция.
const AUTH_LABELS = { bearer: "User", api_key: "API key" };

// Бэк отдаёт маршрут по строке на тип авторизации — человеку это одна строка.
// Складываем в одну, а разбивку по авторизации прячем в аккордеон.
const groupRoutes = (top) => {
  const groups = new Map();

  for (const row of top) {
    const key = `${row.source} ${routeLabel(row)}`;
    const group = groups.get(key);
    if (group) {
      group.count += row.count;
      group.percent = Math.round((group.percent + row.percent) * 100) / 100;
      group.parts.push(row);
    } else {
      groups.set(key, { ...row, key, parts: [row] });
    }
  }

  return [...groups.values()].sort((a, b) => b.count - a.count);
};

export const Usage = () => {
  const [clientOnly, setClientOnly] = useState(false);
  const [groupBy, setGroupBy] = useState("route");
  const [filters, setFilters] = useState({});
  // Подписи для чипов: в фильтр уходит id, а показать надо имя.
  const [filterLabels, setFilterLabels] = useState({});
  const [opened, setOpened] = useState({});

  const params = {
    group_by: groupBy,
    ...filters,
    ...(clientOnly ? { source: "client" } : {}),
    // Для временного ряда бэк сам ставит потолок в месяц 15-минутных точек.
    ...(groupBy === "time" ? {} : { limit: 10 }),
  };

  // Чаще минуты обновлять нет смысла: до базы цифры доезжают раз в 10 минут,
  // а каждый запрос сюда сам расходует лимит.
  const { data, isLoading } = useApiUsageBreakdownQuery({
    params,
    queryParams: { staleTime: 60000 },
  });

  const rows =
    groupBy === "route" ? groupRoutes(data?.top ?? []) : (data?.top ?? []);
  const hasFilters = Object.keys(filters).length > 0;

  const percentUsed =
    data && !data.unlimited && data.limit
      ? Math.min(100, (data.used / data.limit) * 100)
      : null;

  // Пустые значения не кладём: у админских маршрутов нет коллекции, и такой
  // фильтр дал бы чип без подписи, ничего при этом не сужая.
  const addFilter = (next, labels, nextGroup) => {
    const filled = Object.fromEntries(
      Object.entries(next).filter(([, value]) => value),
    );
    setFilters((prev) => ({ ...prev, ...filled }));
    setFilterLabels((prev) => ({ ...prev, ...labels }));
    setGroupBy(nextGroup);
  };

  const removeFilter = (key) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const resetAll = () => {
    setFilters({});
    setFilterLabels({});
    setGroupBy("route");
  };

  // Клик по строке сужает выборку и переключает на следующий разрез.
  // Время — последний уровень, дальше раскрывать нечего.
  const drillDown = (row) => {
    if (groupBy === "route") {
      addFilter(
        { route: row.route, method: row.method, collection: row.collection },
        { route: routeLabel(row) },
        "actor",
      );
    } else if (groupBy === "collection") {
      addFilter(
        { collection: row.collection },
        { collection: row.collection || "—" },
        "actor",
      );
    } else if (groupBy === "actor") {
      addFilter(
        { actor_id: row.actor_id, auth_type: row.auth_type },
        { actor_id: senderLabel(row), auth_type: row.auth_type },
        "time",
      );
    }
  };

  const isDrillable = groupBy !== "time";
  const columnsCount = groupBy === "route" ? 4 : 3;

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

      <Flex align="center" gap="12px" mb="8px" wrap="wrap">
        <Flex
          className={styles.react_tab}
          p="4px"
          bg="#f9fafb"
          borderRadius="8px"
          h="32px"
          border="1px solid #EAECF0"
        >
          {GROUPS.map((group) => (
            <Box
              key={group.key}
              onClick={() => setGroupBy(group.key)}
              className={`${groupBy === group.key ? styles.reactTabIteActive : styles.reactTabItem} ${styles.userTab}`}
              sx={{ fontSize: "12px", cursor: "pointer" }}
            >
              {group.label}
            </Box>
          ))}
        </Flex>

        <Flex align="center" gap="8px">
          <Switch
            size="sm"
            isChecked={clientOnly}
            onChange={(event) => setClientOnly(event.target.checked)}
          />
          <Text fontSize="12px" color="#475467">
            Client API only
          </Text>
        </Flex>
      </Flex>

      {hasFilters && (
        <Flex align="center" gap="6px" mb="8px" wrap="wrap">
          {Object.keys(filters).map((key) => (
            <Tag key={key} size="sm" borderRadius="6px" bg="#EFF8FF">
              <TagLabel fontSize="11px" color="#175CD3">
                {FILTER_LABELS[key] ?? key}: {filterLabels[key] ?? filters[key]}
              </TagLabel>
              <TagCloseButton onClick={() => removeFilter(key)} />
            </Tag>
          ))}
          <Text
            fontSize="11px"
            color="#475467"
            cursor="pointer"
            textDecoration="underline"
            onClick={resetAll}
          >
            Reset
          </Text>
        </Flex>
      )}

      {/* Под фильтром доли считаются от отобранного, а не от месячного расхода —
          бэк присылает percent уже по этому правилу, здесь только поясняем. */}
      {hasFilters && data && (
        <Text fontSize="11px" color="#475467" mb="6px">
          {numberWithSpaces(data.matched)} of {numberWithSpaces(data.used)}{" "}
          requests match the current filter
        </Text>
      )}

      <TableCard cardStyles={{ padding: "1px", height: "100%" }}>
        <CTable
          loader={false}
          removableHeight={false}
          disablePagination
          wrapperStyle={{ height: "100%" }}
        >
          <CTableHead>
            {groupBy === "route" && (
              <>
                <CTableCell className={cls.tableHeadCell} width={90}>
                  Source
                </CTableCell>
                <CTableCell className={cls.tableHeadCell}>Request</CTableCell>
              </>
            )}
            {groupBy === "actor" && (
              <>
                <CTableCell className={cls.tableHeadCell} width={90}>
                  Auth
                </CTableCell>
                <CTableCell className={cls.tableHeadCell}>Sender</CTableCell>
              </>
            )}
            {groupBy === "collection" && (
              <CTableCell className={cls.tableHeadCell}>Table</CTableCell>
            )}
            {groupBy === "time" && (
              <CTableCell className={cls.tableHeadCell}>Time</CTableCell>
            )}
            <CTableCell className={cls.tableHeadCell} width={110}>
              Requests
            </CTableCell>
            <CTableCell className={cls.tableHeadCell} width={80}>
              Share
            </CTableCell>
          </CTableHead>
          <CTableBody
            loader={isLoading}
            columnsCount={columnsCount}
            dataLength={rows.length}
            style={{ height: "100%" }}
          >
            {isLoading ? (
              <TableDataSkeleton
                colLength={columnsCount}
                rowLength={10}
                height={33}
              />
            ) : (
              <>
                {rows.map((row, index) => {
                  const open = Boolean(opened[row.key]);

                  return (
                    <Fragment
                      key={`${groupBy}-${row.actor_id || ""}-${row.bucket || ""}-${routeLabel(row)}-${index}`}
                    >
                      <CTableRow
                        className={cls.row}
                        onClick={isDrillable ? () => drillDown(row) : undefined}
                        style={isDrillable ? { cursor: "pointer" } : undefined}
                      >
                        {groupBy === "route" && (
                          <>
                            <CTableCell className={cls.tBodyCell}>
                              <Box display="flex" alignItems="center" gap="4px">
                                {/* Стрелка раскрывает разбивку по авторизации;
                                    клик по остальной строке — drill-down. */}
                                <Box
                                  display="flex"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setOpened((state) => ({
                                      ...state,
                                      [row.key]: !open,
                                    }));
                                  }}
                                >
                                  {open ? (
                                    <KeyboardArrowDownIcon
                                      sx={{ fontSize: 16 }}
                                    />
                                  ) : (
                                    <KeyboardArrowRightIcon
                                      sx={{ fontSize: 16 }}
                                    />
                                  )}
                                </Box>
                                {row.source === "admin" ? "Admin" : "Client"}
                              </Box>
                            </CTableCell>
                            <CTableCell className={cls.tBodyCell}>
                              {routeLabel(row)}
                            </CTableCell>
                          </>
                        )}
                        {groupBy === "actor" && (
                          <>
                            <CTableCell className={cls.tBodyCell}>
                              {AUTH_LABELS[row.auth_type] || "—"}
                            </CTableCell>
                            <CTableCell className={cls.tBodyCell}>
                              {senderLabel(row)}
                            </CTableCell>
                          </>
                        )}
                        {groupBy === "collection" && (
                          <CTableCell className={cls.tBodyCell}>
                            {row.collection || "—"}
                          </CTableCell>
                        )}
                        {groupBy === "time" && (
                          <CTableCell className={cls.tBodyCell}>
                            {timeLabel(row.bucket)}
                          </CTableCell>
                        )}
                        <CTableCell className={cls.tBodyCell}>
                          {numberWithSpaces(row.count)}
                        </CTableCell>
                        <CTableCell className={cls.tBodyCell}>
                          {row.percent}%
                        </CTableCell>
                      </CTableRow>

                      {/* Та же цифра, разложенная по типу авторизации. */}
                      {groupBy === "route" &&
                        open &&
                        row.parts.map((part, partIndex) => (
                          <CTableRow key={partIndex} className={cls.row}>
                            <CTableCell className={cls.tBodyCell} />
                            <CTableCell
                              className={cls.tBodyCell}
                              style={{ color: "#475467", fontSize: "12px" }}
                            >
                              {AUTH_LABELS[part.auth_type] || "—"}
                            </CTableCell>
                            <CTableCell
                              className={cls.tBodyCell}
                              style={{ color: "#475467", fontSize: "12px" }}
                            >
                              {numberWithSpaces(part.count)}
                            </CTableCell>
                            <CTableCell
                              className={cls.tBodyCell}
                              style={{ color: "#475467", fontSize: "12px" }}
                            >
                              {part.percent}%
                            </CTableCell>
                          </CTableRow>
                        ))}
                    </Fragment>
                  );
                })}
                {/* «Прочее» — хвост за пределами top и трафик до выката
                    разбивки. Раскрывать его нечем, поэтому не кликабельно. */}
                {data?.other > 0 && (
                  <CTableRow className={cls.row}>
                    <CTableCell className={cls.tBodyCell}>Other</CTableCell>
                    {groupBy === "route" && (
                      <CTableCell className={cls.tBodyCell} />
                    )}
                    {groupBy === "actor" && (
                      <CTableCell className={cls.tBodyCell} />
                    )}
                    <CTableCell className={cls.tBodyCell}>
                      {numberWithSpaces(data.other)}
                    </CTableCell>
                    <CTableCell className={cls.tBodyCell} />
                  </CTableRow>
                )}
              </>
            )}
            <EmptyDataComponent
              columnsCount={columnsCount}
              isVisible={!isLoading && !rows.length}
            />
          </CTableBody>
        </CTable>
      </TableCard>
    </Box>
  );
};
