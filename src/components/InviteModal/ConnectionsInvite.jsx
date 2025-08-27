import React from "react";
import connectionServiceV2 from "../../services/auth/connectionService";
import {useQuery} from "react-query";
import {useSelector} from "react-redux";
import {Box} from "@mui/material";
import InviteDynamicFields from "./InviteDynamicFields";
import {store} from "../../store";

function ConnectionsInvite({client_type_id, mainForm}) {
  const userInfo = useSelector((state) => state?.auth?.userInfo);
  const envId = useSelector((state) => state?.company?.environmentId);
  const {data: connections, isLoading} = useQuery(
    ["GET_CONNECTION_LIST", client_type_id?.guid],
    () => {
      return connectionServiceV2.getList(
        {client_type_id: client_type_id?.guid, "user-id": userInfo?.id},
        {
          "Environment-id": envId,
        }
      );
    },
    {
      cacheTime: 10,
      enabled: !!client_type_id?.guid,
    }
  );

  return (
    <>
      <Box>
        {connections?.data?.response?.map((connection, index) => (
          <Box>
            <InviteDynamicFields
              index={index}
              userId={userInfo?.id}
              options={connection?.options}
              connection={connection}
              watch={mainForm.watch}
              setValue={mainForm.setValue}
              control={mainForm?.control}
              client_type_id={client_type_id}
            />
          </Box>
        ))}
      </Box>
    </>
  );
}

export default ConnectionsInvite;
