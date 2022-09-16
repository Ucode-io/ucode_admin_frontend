import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import DataTable from "../../../../../components/DataTable";
import TableCard from "../../../../../components/TableCard";
import eventService from "../../../../../services/eventsService";
import ActionForm from "./ActionForm";

const Actions = () => {
  const { slug } = useParams()

  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const { data: events, isLoading } = useQuery(
    ['GET_EVENTS_LIST', slug],
    () => eventService.getList({ table_slug: 'string' }),
    {
      enabled: !!slug
    }
  )

  const columns = useMemo(
    () => [
      {
        id: 1,
        label: "when action",
        slug: "when.action",
      },
      {
        id: 2,
        label: "when app slug",
        slug: "when.app_slug",
      },
      {
        id: 3,
        label: "When table slug",
        slug: "when.table_slug",
      },
    ],
    []
  )

  return ( 
    <TableCard>
      <DataTable
        data={events?.events}
        removableHeight={false}
        tableSlug={'app'}
        columns={columns}
        disablePagination
        loader={isLoading}
        dataLength={1}
        onRowClick={id => handleOpen()}
      />
      <ActionForm isOpen={isOpen} handleClose={handleClose} />
    </TableCard>
    )
}
 
export default Actions