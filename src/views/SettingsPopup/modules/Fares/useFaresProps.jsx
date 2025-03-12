import { useQuery } from "react-query";
import billingService from "../../../../services/billingService";
import { useState } from "react";

export const useFaresProps = () => {

  const [tabIndex, setTabIndex] = useState(0);
  const [faresArr, setFaresArr] = useState([]);

  const getBiggestArr = (arr) => {
    let result = arr?.[0]?.fare_item_prices || [];

    arr?.forEach((item) => {
      if (item?.fare_item_prices?.length < result?.length) {
        result = item?.fare_item_prices;
      }
    });

    return result;
  };

  const { data: fares } = useQuery(
    ["GET_BILLING_DATA_FARES"],
    () => billingService.getFareList(),
    {
      onSuccess: (res) => {
        if (res?.fares?.length) {
          const bigArr = getBiggestArr(res?.fares);
          setFaresArr(
            bigArr?.map((item) => ({
              id: item?.fare_item?.id,
              name: item?.fare_item?.name,
            }))
          );
        }
        return res?.fares;
      },
    }
  );

  const { data: discounts } = useQuery(
    ["GET_DISCOUNTS"],
    () => billingService.getDiscounts(),
    { onSuccess: (res) => res?.discounts }
  );

  const activeTab = discounts?.discounts?.[tabIndex];

  return {
    discounts,
    tabIndex,
    setTabIndex,
    fares,
    faresArr,
    activeTab,
  };
}
