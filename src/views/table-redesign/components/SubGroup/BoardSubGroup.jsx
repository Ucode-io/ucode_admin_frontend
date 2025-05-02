import clsx from "clsx";
import cls from "./styles.module.scss"
import CheckIcon from '@mui/icons-material/Check';
import { ChevronLeftIcon } from "@chakra-ui/icons"
import { Box, Button, Switch } from "@chakra-ui/react"
import { useBoardSubGroupProps } from "./useBoardSubGroupProps";
import { getColumnIcon } from "../../icons";

export const SubGroup = ({ onBackClick, title, view, fieldsMap, viewUpdateMutation }) => {
  const { handleUpdateSubGroup } = useBoardSubGroupProps({ viewUpdateMutation, view, fieldsMap })

  return <div>
    <Box mb="10px">
      <Button
        leftIcon={<ChevronLeftIcon fontSize={22} />}
        colorScheme="gray"
        variant="ghost"
        w="fit-content"
        onClick={onBackClick}>
        <Box color="#475467" fontSize={14} fontWeight={600}>
          {title}
        </Box>
      </Button>
      {/* <div
        onClick={() => handleUpdateSubGroup("none")}
        className={clsx(cls.label, {[cls.selected]: !view?.attributes?.sub_group_by_id})}
      >
        <span className={cls.text}>None</span>
        <span className={cls.icon}>
          <CheckIcon color="inherit" />
        </span>
      </div> */}
      <div className={cls.labels}>
        {
          view?.columns?.map(item => {
            // return fieldsMap[item] ? <div 
            //   className={clsx(cls.label, {[cls.selected]: view?.attributes?.sub_group_by_id === item})}
            //   key={item}
            //   onClick={() => handleUpdateSubGroup(item)}
            // >
            //   {console.log(fieldsMap[item]?.attributes)}
            //     <span className={cls.text}>{fieldsMap[item]?.attributes?.field_permission?.label}</span>
            //     <span className={cls.icon}>
            //       <CheckIcon color="inherit" />
            //     </span>
            // </div> : null
            return <div>
              <div className={cls.label}>
              <span className={cls.text}>
                {item?.type && getColumnIcon({ item })}
                {fieldsMap[item]?.attributes?.field_permission?.label}
              </span>
              <Switch
                ml="auto"
                checked={view?.attributes?.sub_group_by_id === item}
                onChange={(ev) => handleUpdateSubGroup(item, ev.target.checked)}
                // disabled={view?.group_fields?.length === 1}
                isChecked={view?.attributes?.sub_group_by_id === item}
              />
              </div>
            </div>
            
          })
        }
      </div>
    </Box>
  </div>
}
