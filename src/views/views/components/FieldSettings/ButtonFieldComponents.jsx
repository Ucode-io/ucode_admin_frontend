import React from "react";
import HFSelect from "@/components/FormElements/HFSelect";
import styles from "./style.module.scss";
import FRow from "@/components/FormElements/FRow";
import HFIconPicker from "@/components/FormElements/HFIconPicker";
import {useQuery} from "react-query";
import constructorFunctionService from "@/services/constructorFunctionService";
import listToOptions from "@/utils/listToOptions";

function ButtonFieldComponents({control}) {
  const {data: functions = []} = useQuery(
    ["GET_FUNCTIONS_LIST"],
    () => {
      return constructorFunctionService.getListV2({});
    },
    {
      onError: (err) => {
        console.log("ERR =>", err);
      },
      select: (res) => {
        return listToOptions(res.functions, "name", "id");
      },
    }
  );

  return (
    <>
      <FRow label="Icons" classname={styles.custom_label}>
        <HFIconPicker
          required={true}
          control={control}
          name="attributes.icon"
        />
      </FRow>
      <FRow label="Functions" classname={styles.custom_label}>
        <HFSelect
          required={true}
          options={functions}
          control={control}
          name="attributes.function"
        />
      </FRow>
    </>
  );
}

export default ButtonFieldComponents;
