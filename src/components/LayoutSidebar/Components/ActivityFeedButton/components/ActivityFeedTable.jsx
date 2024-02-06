import { Delete, Edit } from "@mui/icons-material";
import TableCard from "../../../../TableCard";
import { CTable, CTableBody, CTableCell, CTableHead, CTableRow } from "../../../../CTable";
import RectangleIconButton from "../../../../Buttons/RectangleIconButton";


const ActivityFeedTable = ({ openDrawer, histories }) => {
    return (
        <>
            <TableCard type={"withoutPadding"}>
                <CTable loader={false} disablePagination removableHeight={false} >
                    <CTableHead>
                        <CTableCell width={10}>№</CTableCell>
                        <CTableCell>Action</CTableCell>
                        <CTableCell>Collection</CTableCell>
                        <CTableCell>Action On</CTableCell>
                        <CTableCell>Action By</CTableCell>
                        <CTableCell width={60}></CTableCell>
                    </CTableHead>
                    <CTableBody loader={false} columnsCount={6}>
                        {histories?.map((element, index) => (
                            <CTableRow key={element.id}>
                                <CTableCell>{index + 1}</CTableCell>
                                <CTableCell>{element?.action_type}</CTableCell>
                                <CTableCell>{element?.table_slug}</CTableCell>
                                <CTableCell>{element?.date}</CTableCell>
                                <CTableCell>{element?.user}</CTableCell>
                                <CTableCell>
                                    <div className="flex">
                                        <RectangleIconButton color="success" className="mr-1" size="small" onClick={() => {
                                            openDrawer(element?.id)
                                        }}>
                                            <Edit color="success" />
                                        </RectangleIconButton>
                                        <RectangleIconButton color="error" >
                                            <Delete color="error" />
                                        </RectangleIconButton>
                                    </div>
                                </CTableCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </TableCard >
        </>
    );
};

export default ActivityFeedTable;
