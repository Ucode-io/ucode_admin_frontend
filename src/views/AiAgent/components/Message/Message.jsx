import clsx from "clsx"
import cls from "./styles.module.scss"
import { AiIcon } from "@/mock/icons";
import { useMessageProps } from "./useMessageProps";

export const Message = ({ from="user", text }) => {

  const {chatIcon} = useMessageProps();

  return <div className={clsx(cls.message, cls[from])}>
    <div className={cls.messageWrapper}>
      <div className={cls.messageIcon}>
        {
          from === "ai" ? <span className={cls.aiIcon}>
            <AiIcon />
          </span> : <span className={cls.icon}>{chatIcon}</span>
        }
      </div>
      <div className={cls.messageContent} dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  </div>
}
