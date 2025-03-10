import { Box } from "@mui/material"
import { useFaresProps } from "./useFaresProps"
import cls from './styles.module.scss'
import { Button } from "../../components/Button"
import { BillingFares } from "../../components/BillingFares"
import { Flex } from "@chakra-ui/react"

export const Fares = () => {

  const { 
    discounts,
    tabIndex,
    setTabIndex,
    fares,
    activeTab,
  } = useFaresProps()

  return <Box>
    <Box>
      {
        discounts?.discounts?.map((el, index) => (
          <Button
            className={cls.btn}
            key={index}
            onClick={() => setTabIndex(index)}
            primary={tabIndex === index}
          >
            {el?.months} {el?.months === 1 ? "Month" : "Months"}
          </Button>
        ))
      }
    </Box>
    <Flex columnGap="12px" mt="86px">
      {fares?.fares?.map((plan, index) => (
        <BillingFares
          element={activeTab}
          discounts={discounts?.discounts}
          key={index}
          plan={plan}
          tabIndex={tabIndex}
        />
      ))}
    </Flex>
  </Box>
}
