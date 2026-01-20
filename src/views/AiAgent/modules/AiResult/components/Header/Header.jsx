
import clsx from "clsx";
import cls from "./styles.module.scss";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import mcpService from "@/views/AiAgent/service/mcp.service";

export const Header = ({
  activeTab,
  onChange = () => {},
  tabs = [],
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handlePublish = () => {
    mcpService.publishFrontend();
  }

  return (
    <header className={clsx(cls.header, { [cls.dark]: activeTab === "code" })}>
      <button className={cls.backButton} onClick={handleBack}>
        <ArrowBackIcon htmlColor={activeTab === "code" ? "#fff" : "#222"} />
      </button>
      <nav className={cls.tabs}>
        <ul className={cls.tabsList}>
          {tabs.map((tab) => (
            <li className={cls.tabItem} key={tab.value}>
              <button
                className={clsx(cls.tab, {
                  [cls.active]: activeTab === tab.value,
                })}
                onClick={() => onChange(tab.value)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className={cls.actions}>
        <button className={cls.publishButton} onClick={handlePublish}>
          Publish
        </button>
      </div>
    </header>
  );
};
