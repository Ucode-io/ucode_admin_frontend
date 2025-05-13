import {Box} from "@mui/material";
import {useFaresProps} from "./useFaresProps";
import cls from "./styles.module.scss";
import {Button} from "../../components/Button";
import {Flex} from "@chakra-ui/react";
import {FaresTable} from "./components/FaresTable";
import {BillingFares} from "./components/BillingFares";

export const Fares = () => {
  const {discounts, tabIndex, setTabIndex, fares, faresArr, activeTab} =
    useFaresProps();

  return (
    <Box>
      <Box>
        {discounts?.discounts?.map((el, index) => (
          <Button
            className={cls.btn}
            key={index}
            onClick={() => setTabIndex(index)}
            primary={tabIndex === index}>
            {el?.months} {el?.months === 1 ? "Month" : "Months"}
          </Button>
        ))}
      </Box>
      <Flex columnGap="12px" mt="10px" justifyContent="center">
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
      <Box mt={2}>
        <FaresTable headData={faresArr} columns={fares?.fares} />
      </Box>
    </Box>
  );
};
