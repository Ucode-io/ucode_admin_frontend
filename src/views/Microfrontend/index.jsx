import {useLocation, useParams} from "react-router-dom";
import {useMemo} from "react";
import MicrofrontendComponent from "../../components/MicrofrontendComponent";
import {useQuery} from "react-query";
import microfrontendService from "../../services/microfrontendService";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";

const Microfrontend = () => {
  const { microfrontendId } = useParams();
  const location = useLocation();

  const activationKey = useMemo(
    () => `${microfrontendId}:${location.key}:${Date.now()}`,
    [microfrontendId, location.key],
  );

  const {data, isLoading} = useQuery(
    ["GET_MICROFRONTEND_BY_ID", microfrontendId],
    () => {
      return microfrontendService.getById(microfrontendId);
    },
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const link = data?.url
    ? `https://${data?.url}/assets/remoteEntry.js`
    : undefined;

  if (isLoading) return <RingLoaderWithWrapper style={{height: "100vh"}} />;

  if (!link) return null;

  return (
    <MicrofrontendComponent
      key={`${link}:${activationKey}`}
      activationKey={activationKey}
      link={link}
    />
  );
};
export default Microfrontend;
