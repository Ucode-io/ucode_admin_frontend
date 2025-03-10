import { useQuery } from "react-query";
import billingService from "../../../../services/billingService";
import { useState } from "react";

export const useFaresProps = () => {

  const [tabIndex, setTabIndex] = useState(0);

  
  const {data: fares} = useQuery(
    ["GET_BILLING_DATA_FARES"],
    () => billingService.getFareList(),
    {onSuccess: (res) => res?.fares}
  );
  
  const {data: discounts} = useQuery(
    ["GET_DISCOUNTS"],
    () => billingService.getDiscounts(),
    {onSuccess: (res) => res?.discounts}
  );
  
  const activeTab = discounts?.discounts?.[tabIndex]

  return {
    discounts,
    tabIndex,
    setTabIndex,
    fares,
    activeTab,
  }
}
