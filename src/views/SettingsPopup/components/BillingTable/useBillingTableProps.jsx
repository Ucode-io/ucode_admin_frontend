import { useQuery } from "react-query";
import billingService from "../../../../services/billingService";
import { useSelector } from "react-redux";

export const useBillingTableProps = () => {

  const project = useSelector((state) => state?.company?.projectItem);

  const {data: transactions, isLoading} = useQuery(
    ["GET_TRANSACTION_LIST", project],
    () => {
      return billingService.getTransactionList();
    },
    {
      enabled: Boolean(project?.fare_id),
      select: (res) => res?.transactions ?? [],
    }
  );

  return {
    transactions,
    project,
    isLoading,
  }
}
