import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import billingService from "@/services/billingService";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { showAlert } from "@/store/alert/alert.thunk";
import { useProjectListQuery } from "@/services/companyService";
import { store } from "@/store";
import { companyActions } from "@/store/company/company.slice";
import useSearchParams from "@/hooks/useSearchParams";

export const useBillingProps = () => {
  const dispatch = useDispatch();
  const project = useSelector((state) => state?.company?.projectItem);
  const company = store.getState().company;
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();

  const [addBalance, setAddBalance] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, watch, reset } = useForm();

  const handClickBalance = () => setAddBalance(true);
  const handCloseBalance = () => {
    reset({});
    setAddBalance(false);
  };

  const { isLoading: projectLoading } = useProjectListQuery({
    params: {
      company_id: company.companyId,
    },
    queryParams: {
      enabled: Boolean(company.companyId),
      onSuccess: (res) => {
        dispatch(companyActions.setProjects(res.projects));
        dispatch(companyActions.setProjectItem(res.projects[0]));
        dispatch(companyActions.setProjectId(res.projects[0].project_id));
      },
    },
  });

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

  const { data: transactions, refetch } = useQuery(
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
      .receiptPay(data, { limit: 10 })
      .then(() => {
        dispatch(showAlert("Transaction successfully created!", "success"));
        refetch();
        queryClient.refetchQueries(["PROJECT"]);
        handCloseBalance();
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (searchParams.get("stripeRedirect") === "true") {
      setAddBalance(true);
    }
  }, [searchParams]);

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
    dispatch,
  };
};
