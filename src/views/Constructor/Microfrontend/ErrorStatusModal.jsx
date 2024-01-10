import { Box, CircularProgress, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import httpsRequestV2 from '../../../utils/httpsRequestV2';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: '#000',
  border: '0',
  boxShadow: 24,
  p: 1,
  borderRadius: "10px",
  outline: 'none',
  zIndex: 1000,
  height: "80vh",
  overflow: "scroll"
};

export default function ErrorStatusModal({ setOpenModal, element }) {
  const [modalLoading, setModalLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    setModalLoading(true)
    httpsRequestV2.post("/pipeline/log", {
      repo_id: element?.repo_id
    })
      .then(res => {
        setData(res)
      })
      .finally(() => {
        setModalLoading(false)
      })
  }, [element])

  return (
    <Modal
      open={true}
      onClose={() => setOpenModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {
          modalLoading ? (<Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: "100%",
            height: "100%"
          }}>
            <CircularProgress />
          </Box>) : <Box sx={{
            width: "100%",
            height: "100%",
            overflow: "auto"
          }}>
            <pre style={{ whiteSpace: 'pre-wrap', color: "#FFF" }}>
              {data?.log ?? "No data!"}
            </pre>
          </Box>
        }

      </Box>
    </Modal>

  )
}
