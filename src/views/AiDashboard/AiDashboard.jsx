import RingLoaderWithWrapper from "@/components/Loaders/RingLoader/RingLoaderWithWrapper";
import MicrofrontendComponent from "@/components/MicrofrontendComponent";
import microfrontendService from "@/services/microfrontendService";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom"

export const AiDashboard = () => {

  const navigate = useNavigate();

  const handleBackClick = () => navigate(-1);

  const { id } = useParams();

  const {data, isLoading} = useQuery(
    ["GET_MICROFRONTEND_BY_ID", id],
    () => {
      return microfrontendService.getById(id);
    }
  );

  const link = data?.url
    ? `https://${data?.url}/assets/remoteEntry.js`
    : undefined;

  if (isLoading) return <RingLoaderWithWrapper style={{height: "100vh"}} />;


  return <div>
    <header>
      <button onClick={handleBackClick}>Ucode</button>
    </header>
    <div>
      <MicrofrontendComponent link={link} />
    </div>
  </div>
}
