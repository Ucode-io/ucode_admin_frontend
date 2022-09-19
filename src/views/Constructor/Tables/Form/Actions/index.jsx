import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import DataTable from "../../../../../components/DataTable";
import TableCard from "../../../../../components/TableCard";
import eventService from "../../../../../services/eventsService";
import ActionForm from "./ActionForm";

const Actions = ({ eventLabel }) => {
  const { slug } = useParams();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const { data: events, isLoading } = useQuery(
    ["GET_EVENTS_LIST", slug],
    () => eventService.getList({ table_slug: "string" }),
    {
      enabled: !!slug,
    }
  );

  const columns = [
    {
      id: 1,
      label: "Событие",
      slug: "when.action",
    },
  ];

  return (
    <TableCard>
      <DataTable
        data={events?.events}
        removableHeight={false}
        tableSlug={"app"}
        columns={columns}
        disablePagination
        loader={isLoading}
        dataLength={1}
        onRowClick={(id) => handleOpen()}
      />
      <ActionForm
        eventLabel={eventLabel}
        isOpen={isOpen}
        handleClose={handleClose}
      />
    </TableCard>
  );
};

export default Actions;
