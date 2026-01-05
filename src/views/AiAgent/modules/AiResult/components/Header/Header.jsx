
import clsx from "clsx";
import cls from "./styles.module.scss";

export const Header = ({ activeTab, onChange = () => {}, handleRunCode, tabs = [] }) => {

  return <header className={cls.header}>
    <nav className={cls.tabs}>
      <ul className={cls.tabsList}>
        {
          tabs.map((tab) => (
            <li className={cls.tabItem} key={tab.value}>
              <button
                className={clsx(cls.tab, { [cls.active]: activeTab === tab.value })}
                onClick={() => onChange(tab.value)}
              >
                {tab.label}
              </button>
            </li>
          ))
        }
      </ul>
    </nav>
    <div className={cls.actions}>
      <button className={cls.publishButton} onClick={handleRunCode}>
        Run
      </button>
    </div>
  </header>
}
