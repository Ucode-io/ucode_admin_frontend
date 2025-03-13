import { useState } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import billingService from "../../../../services/billingService";
import { showAlert } from "../../../../store/alert/alert.thunk";

export const useAddCardComponent = ({
  watch,
  setVerifyCard = () => {},
}) => {
  const dispatch = useDispatch();
  const [selectedCard, setSelectedCard] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [otpVal, setOtpVal] = useState("");
  const [newCard, setNewCard] = useState();
  const [card, setCard] = useState(null);

  const {
    isLoading,
    data: cards,
    refetch,
  } = useQuery(
    ["GET_CARDS_LIST"],
    () => {
      return billingService.getCardList({
        limit: 10,
      });
    },
    {
      select: (res) => res?.project_cards ?? [],
    }
  );

  const handleCardSelect = (index, card) => {
    setSelectedCard(index);
    setCard(card);
  };

  const verifyCardNumber = () => {
    if (Boolean(watch("card_number")) && Boolean(watch("expire"))) {
      billingService
        .cardVerify({
          pan: watch("card_number"),
          expire: watch("expire"),
        })
        .then((res) => {
          setNewCard(res);
          setVerifyCard(true);
        });
    } else dispatch(showAlert("Enter card number", "error"));
  };

  const getOtpVal = (val) => {
    setOtpVal(val);
  };

  const confirmOtpFunc = () => {
    billingService
      .cardOtpVerify({
        code: otpVal,
        project_card_id: newCard?.project_card_id,
      })
      .then(() => {
        dispatch(showAlert("The Card is successfully added!", "success"));
        refetch();
        setOpenDialog(false);
      });
  };

  return {
    selectedCard,
    openDialog,
    setOpenDialog,
    card,
    isLoading,
    cards,
    handleCardSelect,
    verifyCardNumber,
    otpVal,
    getOtpVal,
    confirmOtpFunc,
  }
}
