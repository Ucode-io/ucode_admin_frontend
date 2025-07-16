import {useParams} from "react-router-dom";
import MicrofrontendComponent from "../../components/MicrofrontendComponent";
import {useQuery} from "react-query";
import microfrontendService from "../../services/microfrontendService";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";

const Microfrontend = () => {
  const {microfrontendId} = useParams();
  const test = useParams();

  console.log("testtttttt", test);

  const {data, isLoading} = useQuery(
    ["GET_MICROFRONTEND_BY_ID", microfrontendId],
    () => {
      return microfrontendService.getById(microfrontendId);
    }
  );
  console.log("datadata", data);
  const link = data?.url
    ? `https://${data?.url}/assets/remoteEntry.js`
    : undefined;

  if (isLoading) return <RingLoaderWithWrapper style={{height: "100vh"}} />;

  if (!link) return null;

  return <MicrofrontendComponent key={link} link={link} />;
};
export default Microfrontend;
