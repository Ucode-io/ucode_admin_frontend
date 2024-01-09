import React, {useEffect, useMemo} from "react";
import {useQuery} from "react-query";
import constructorObjectService from "../../services/constructorObjectService";
import get from "lodash.get";
import styles from "./style.module.scss";

function Many2neValue({field, value}) {
  // useEffect(() => {
  //   let val;

  //   if (Array.isArray(computedValue)) {
  //     val = computedValue[computedValue.length - 1];
  //   } else {
  //     val = computedValue;
  //   }

  //   if (!field?.attributes?.autofill || !val) {
  //     return;
  //   }

  //   field.attributes.autofill.forEach(({field_from, field_to, automatic}) => {
  //     const setName = name?.split(".");
  //     setName?.pop();
  //     setName?.push(field_to);

  //     if (automatic) {
  //       setTimeout(() => {
  //         setFormValue(setName.join("."), get(val, field_from));
  //       }, 1);
  //     }
  //   });
  // }, [computedValue, field]);

  return <div className={styles.container}>{value}</div>;
}

export default Many2neValue;
