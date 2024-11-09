import React, {useState} from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import {Box, Button, Dialog} from "@mui/material";
import {useForm} from "react-hook-form";
import HFDatePicker from "../../components/FormElements/HFDatePicker";
import HFSelect from "../../components/FormElements/HFSelect";
import HFNumberField from "../../components/FormElements/HFNumberField";
import FRow from "../../components/FormElements/FRow";
import DatePicker from "react-multi-date-picker";
import {useParams} from "react-router-dom";
import axios from "axios";
import request from "../../utils/request";
import {useDispatch} from "react-redux";
import {showAlert} from "../../store/alert/alert.thunk";
import {
  format,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from "date-fns";

function DividentWayll() {
  const [open, setOpen] = useState(false);
  const {id} = useParams();
  const dispatch = useDispatch();

  const {control, watch, handleSubmit} = useForm();

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const mockData = [
    {
      label: "1 Месяц",
      value: 1,
    },
    {
      label: "3 Месяц",
      value: 3,
    },
    {
      label: "6 Месяц",
      value: 6,
    },
    {
      label: "1 Год",
      value: 12,
    },
  ];

  const onSubmit = (values) => {
    let date = new Date(values?.end_date);
    date = setHours(date, 0);
    date = setMinutes(date, 0);
    date = setSeconds(date, 0);
    date = setMilliseconds(date, 0);

    const formattedDate = format(date, "dd.MM.yyyy HH:mm");

    const data = {
      ...values,
      end_date: formattedDate,
      project_id: id,
    };

    request
      .post("/invoke_function/wayll-calculate-profit", {data})
      .then((res) => {
        dispatch(showAlert("Success", "success"));
        handleClose();
      })
      .catch((err) => {
        dispatch(showAlert(err, "error"));
      });
  };
  return (
    <>
      <PrimaryButton
        onClick={() => {
          handleClick();
        }}>
        Дивиденды
      </PrimaryButton>

      <Dialog
        open={open}
        PaperProps={{style: {overflow: "visible"}}}
        onClose={handleClose}>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              width: "450px",
              height: "350px",
              display: "flex",
              // alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "column",
              overflow: "visible",
            }}>
            <Box
              sx={{
                height: "40px",
                width: "100%",
                borderBottom: "1px solid #eee",
              }}></Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "0 15px",
              }}>
              <FRow label="Дата">
                <HFDatePicker
                  width={"100%"}
                  mask={"99.99.9999"}
                  name={"end_date"}
                  control={control}
                  sectionModal={true}
                />
              </FRow>
              <FRow label="Период">
                <HFSelect
                  name={"duration"}
                  control={control}
                  options={mockData}
                />
              </FRow>

              <FRow label="Сумма">
                <HFNumberField name="dividend" control={control} />
              </FRow>
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 15px",
                borderTop: "1px solid #eee",
              }}>
              <Button type="button" color="error" variant="outlined">
                Отменить
              </Button>
              <Button type="submit" variant="contained">
                Готово
              </Button>
            </Box>
          </Box>
        </form>
      </Dialog>
    </>
  );
}

export default DividentWayll;
