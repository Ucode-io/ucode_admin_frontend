import React, {useMemo} from "react";
import {useParams} from "react-router-dom";
import ActionButton from "../../views/Objects/components/CustomActionsButton/ActionButton";

function CustomTableEvents({
  customEvents = [],
  getAllData = () => {},
  control,
}) {
  const {tableSlug, id} = useParams();
  const computedCustomEvents = useMemo(() => {
    return customEvents?.filter((event) => event.action_type === "HTTP");
  }, [customEvents]);

  return (
    <>
      {computedCustomEvents?.map(
        (event) =>
          event?.action_permission &&
          event?.action_permission?.permission === true && (
            <ActionButton
              control={control}
              key={event.id}
              event={event}
              id={id}
              getAllData={getAllData}
            />
          )
      )}
    </>
  );
}

export default CustomTableEvents;
