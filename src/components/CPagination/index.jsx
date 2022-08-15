import { Pagination } from "@mui/material"


const CPagination = ({ setCurrentPage = () => {}, paginationExtraButton, ...props }) => {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '15px' }} >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} >
        <Pagination color="primary" onChange={(e, val) => setCurrentPage(val)}  { ...props } />
        {paginationExtraButton}
      </div>
    </div>
  )
}

export default CPagination
