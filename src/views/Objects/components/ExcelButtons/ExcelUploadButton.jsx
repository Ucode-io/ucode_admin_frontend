import { useState } from 'react'
import { Upload } from "@mui/icons-material"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import { Dialog } from '@mui/material';
import styles from './style.module.scss'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { CloseIcon, UploadIcon, PointerIcon } from '../../../../assets/icons/icon.jsx'
import CSelect from '../../../../components/CSelect'


const ExcelUploadButton = ({fieldsMap}) => {
  const [open, setOpen] = useState(false)
  const handleClick = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const fields = Object.values(fieldsMap)
  return (
    <>
    <RectangleIconButton color="white" onClick={() => handleClick()}>
      <Upload />
    </RectangleIconButton>
    
      <Dialog
         open={open} onClose={handleClose}>
        <div className={styles.dialog_content}>
          <div className={styles.dialog_tabs_header}>
            <Tabs className={styles.tabs_head}>
              <TabList className={styles.tabs_list}>
                <Tab className={styles.tabs_item}><span>Загрузить файл</span></Tab>
                <Tab className={styles.tabs_item}><span>Подтверждения</span></Tab>
                  <button onClick={handleClose} className={styles.tabs_close}><CloseIcon/></button>
              </TabList>
              
                <TabPanel >
                  <div className={styles.dialog_upload}>
                      <div className={styles.dialog_upload_section}>
                      <UploadIcon/>
                      <p>Drag and drop files here</p>
                      <button>Browse</button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel >
                      <div className={styles.tabs_select}>
                          <div className={styles.upload_select}>
                            <div className={styles.upload_select_item}>
                              <h2>Экспорт загаловка столбца</h2>
                              <h2 className={styles.excel_title}>Excel заголовка столбца</h2>
                            </div>
                           <div className={styles.select_body_content}>
                           {fields?.map((item, index) => (
                            <div key={index} className={styles.select_body_layer}>
                            <div className={styles.select_body}>
                                 <div className={styles.select_body_item}>
                                   <input type="text" value={item?.label} placeholder='*ФИО' disabled className={styles.input_control}/>
                                   <div className={styles.select_pointer}><PointerIcon/></div>
                                   <div className={styles.select_options}>
                                     <CSelect disabledHelperText={true} width={'264px'}/>
                                    </div>
                                 </div>
                             </div>
                             </div>
                             ))}
                           </div>
                            <div className={styles.control_btns}>
                               <button className={styles.control_clear}>Сбросить</button>
                               <button className={styles.control_upload}>Загрузить</button>
                             </div>
                          </div>
                      </div>
                    </TabPanel>
            </Tabs>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default ExcelUploadButton
