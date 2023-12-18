import {Outlet} from "react-router-dom";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import MicrofrontendComponent from "../../components/MicrofrontendComponent";
import {loginAction} from "../../store/auth/auth.thunk";

const LoginMicrofrontend = ({microfrontendUrl, isLoading}) => {
  const microfrontendLink = microfrontendUrl
    ? `https://${microfrontendUrl}/assets/remoteEntry.js`
    : undefined;

  if (isLoading) return <RingLoaderWithWrapper style={{height: "100vh"}} />;

  return (
    <>
      <MicrofrontendComponent
        loginAction={(authData) => dispatch(loginAction(authData))}
        key={microfrontendLink}
        link={microfrontendLink}
      />
      <Outlet />
    </>
  );
};

export default LoginMicrofrontend;
