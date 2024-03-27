import React from "react";
import FRow from "../../../../../../components/FormElements/FRow";

import HFSelect from "../../../../../../components/FormElements/HFSelect";
import HFTextField from "../../../../../../components/FormElements/HFTextField";

function RandomTextAttributes({control}) {
  const options = [
    {
      id: 1,
      label: "JSON",
      value: "json",
    },
    {
      id: 2,
      label: "Programming Language",
      value: "program",
    },
    {
      id: 3,
      label: "Text",
      value: "text",
    },
  ];
  return (
    <>
      <div className="p-2">
        <FRow label="Prefix">
          <HFTextField name="attributes.prefix" control={control} fullWidth />
        </FRow>
        <FRow label="Limit">
          <HFTextField name="attributes.limit" control={control} fullWidth />
        </FRow>
      </div>
    </>
  );
}

export default RandomTextAttributes;
