import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import billingService from "../../../../services/billingService";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { showAlert } from "../../../../store/alert/alert.thunk";

export const useBillingProps = () => {

  const dispatch = useDispatch();
  const project = useSelector((state) => state?.company?.projectItem);
  const queryClient = useQueryClient();

  const [addBalance, setAddBalance] = useState(false);
  const [loading, setLoading] = useState(false);

  const {control, handleSubmit, watch, reset} = useForm();

  
  const handClickBalance = () => setAddBalance(true);
  const handCloseBalance = () => {
    reset({});
    setAddBalance(false);
  };
  
  const { data } = useQuery(
    ["GET_BILLING_DATA", project],
    () => {
      return billingService.getList(project?.fare_id);
    },
    {
      enabled: Boolean(project?.fare_id),
      onSuccess: (res) => res?.data,
    }
  );

  const {data: transactions, refetch} = useQuery(
    ["GET_TRANSACTION_LIST", project],
    () => {
      return billingService.getTransactionList();
    },
    {
      enabled: Boolean(project?.fare_id),
      select: (res) => res?.transactions ?? [],
    }
  );

  const onSubmit = (values) => {
    setLoading(true);
    const data = {
      project_card_id: watch("id"),
      amount: values?.amount,
    };

    billingService
      .receiptPay(data, {limit: 10})
      .then(() => {
        dispatch(showAlert("Transaction successfully created!", "success"));
        refetch();
        queryClient.refetchQueries(["PROJECT"]);
        handCloseBalance();
      })
      .finally(() => setLoading(false));
  };

  return {
    project,
    data,
    handClickBalance,
    addBalance,
    handCloseBalance,
    control,
    handleSubmit,
    watch,
    onSubmit,
    loading,
    reset,
  }
}
