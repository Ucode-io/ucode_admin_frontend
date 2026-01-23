
import clsx from "clsx";
import cls from "./styles.module.scss";

import { useNavigate } from "react-router-dom";


import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import mcpService from "@/services/mcp/mcp.service";

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
        {/* <ArrowBackIcon htmlColor={activeTab === "code" ? "#fff" : "#222"} /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="20"
          height="20"
          x="0"
          y="0"
          viewBox="0 0 24 24"
          enableBackground="new 0 0 512 512"
          xmlSpace="preserve"
          className=""
        >
          <g>
            <path
              d="M22 11H4.414l5.293-5.293a1 1 0 1 0-1.414-1.414l-7 7a1 1 0 0 0 0 1.414l7 7a1 1 0 0 0 1.414-1.414L4.414 13H22a1 1 0 0 0 0-2z"
              fill={activeTab === "code" ? "#fff" : "#222"}
              opacity="1"
              data-original="#000000"
              className=""
            ></path>
          </g>
        </svg>
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
                <span className={cls.label}>{tab.label}</span>
                {tab.icon}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className={cls.actions}>
        <button className={cls.publishButton} onClick={handlePublish}>
          <AutoAwesomeIcon />
          <span>Publish</span>
        </button>
      </div>
    </header>
  );
};
