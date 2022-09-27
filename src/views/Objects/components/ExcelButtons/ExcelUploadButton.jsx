import { useState } from 'react'
import { Upload } from "@mui/icons-material"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import { Dialog } from '@mui/material';
import ExcelUploadModal from './ExcelUploadModal';


const ExcelUploadButton = ({fieldsMap}) => {
  const [open, setOpen] = useState(false)
  const handleClick = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
    <RectangleIconButton color="white" onClick={() => handleClick()}>
      <Upload />
    </RectangleIconButton>
    
      <Dialog
         open={open} onClose={handleClose}  >
        <ExcelUploadModal fieldsMap={fieldsMap} handleClose={handleClose} />
      </Dialog>
    </>
  )
}

export default ExcelUploadButton
