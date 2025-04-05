import {Outlet} from "react-router-dom";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import MicrofrontendComponent from "../../components/MicrofrontendComponent";
import {loginAction} from "../../store/auth/auth.thunk";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";

const LoginMicrofrontend = ({microfrontendUrl, isLoading}) => {
  const microfrontendLink = microfrontendUrl
    ? `https://${microfrontendUrl}/assets/remoteEntry.js`
    : undefined;

  if (isLoading) return <RingLoaderWithWrapper style={{height: "100vh"}} />;
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  return (
    <>
      <MicrofrontendComponent
        loginAction={(authData) => dispatch(loginAction(authData))}
        key={microfrontendLink}
        link={microfrontendLink}
        t={t}
        i18n={i18n}
      />
      <Outlet />
    </>
  );
};

export default LoginMicrofrontend;
