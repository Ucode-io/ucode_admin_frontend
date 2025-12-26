import { useSelector } from "react-redux";

export const useMessageProps = () => {

  const {userInfo} = useSelector((state) => state.auth);

  const chatIcon = userInfo?.login?.[0];

  return {
    chatIcon,
  }
}