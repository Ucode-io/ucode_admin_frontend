import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HistoryIcon from "@mui/icons-material/History";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";

import { aiChatActions } from "@/store/aiChat/aiChat.slice";
import { useUcodeChat } from "./lib/useUcodeChat";
import { Conversation } from "./components/Conversation";
import cls from "./styles.module.scss";

const SUGGESTIONS = [
  {
    icon: <RocketLaunchOutlinedIcon fontSize="small" />,
    title: "Создать таблицу",
    subtitle: "Помоги начать",
    prompt: "Создай таблицу товаров с названием, ценой и категорией",
  },
  {
    icon: <SyncAltIcon fontSize="small" />,
    title: "Построить связь",
    subtitle: "Проведи по шагам",
    prompt: "Свяжи таблицы order_item и product связью многие-к-одному",
  },
  {
    icon: <Inventory2OutlinedIcon fontSize="small" />,
    title: "Раздел меню",
    subtitle: "Создать раздел каталога",
    prompt: "Создай раздел меню «Каталог» и помести в него таблицу product",
  },
  {
    icon: <BadgeOutlinedIcon fontSize="small" />,
    title: "Добавить записи",
    subtitle: "Заполнить данными",
    prompt: "Добавь 5 тестовых записей в таблицу product",
  },
  {
    icon: <StorageOutlinedIcon fontSize="small" />,
    title: "Прочитать схему",
    subtitle: "Показать структуру проекта",
    prompt: "Прочитай и опиши текущую схему проекта",
  },
];

const SESSIONS = [
  { id: 1, title: "Create users table", time: "Today, 14:32" },
  { id: 2, title: "Build orders relation", time: "Today, 11:08" },
  { id: 3, title: "Function for invoices", time: "Yesterday, 18:45" },
  { id: 4, title: "Find my project ID", time: "Jun 16, 09:20" },
  { id: 5, title: "Connect Postgres source", time: "Jun 15, 16:02" },
];

export const AiChatPanel = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.aiChat.isOpen);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [input, setInput] = useState("");

  const { messages, run, sending, send, reset } = useUcodeChat();

  if (!isOpen) return null;

  const hasConversation = messages.length > 0 || !!run;

  const handleClose = () => dispatch(aiChatActions.closeAiChat());

  const handleSend = () => {
    const text = input.trim();
    if (!text || sending) return;
    send(text);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (prompt) => {
    if (sending) return;
    send(prompt);
  };

  const handleNewChat = () => {
    reset();
    setInput("");
  };

  return (
    <div className={cls.panel}>
      <div className={cls.header}>
        <div className={cls.title}>
          <AutoAwesomeIcon fontSize="small" />
          New conversation
        </div>
        <div className={cls.headerActions}>
          <div className={cls.historyWrap}>
            <button
              className={`${cls.iconBtn} ${isHistoryOpen ? cls.iconBtnActive : ""}`}
              aria-label="history"
              onClick={() => setIsHistoryOpen((prev) => !prev)}
            >
              <HistoryIcon fontSize="small" />
            </button>
            {isHistoryOpen && (
              <>
                <div
                  className={cls.historyOverlay}
                  onClick={() => setIsHistoryOpen(false)}
                />
                <div className={cls.historyMenu}>
                  <div className={cls.historyMenuTitle}>Sessions</div>
                  <div className={cls.historyList}>
                    {SESSIONS.map((session) => (
                      <button
                        className={cls.historyItem}
                        key={session.id}
                        onClick={() => setIsHistoryOpen(false)}
                      >
                        <ChatBubbleOutlineIcon
                          fontSize="small"
                          className={cls.historyItemIcon}
                        />
                        <div className={cls.historyItemText}>
                          <span className={cls.historyItemTitle}>
                            {session.title}
                          </span>
                          <span className={cls.historyItemTime}>
                            {session.time}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <button
            className={cls.iconBtn}
            aria-label="new chat"
            onClick={handleNewChat}
          >
            <AddIcon fontSize="small" />
          </button>
          <button
            className={cls.iconBtn}
            aria-label="close"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>
      </div>

      <div className={cls.body}>
        {hasConversation ? (
          <Conversation messages={messages} run={run} sending={sending} />
        ) : (
          <>
            <div className={cls.greeting}>
              <div className={cls.greetingTitle}>Good afternoon.</div>
              <div className={cls.greetingSubtitle}>
                What are we doing today?
              </div>
            </div>

            <div className={cls.suggestions}>
              {SUGGESTIONS.map((item, idx) => (
                <button
                  type="button"
                  className={cls.suggestion}
                  key={idx}
                  onClick={() => handleSuggestion(item.prompt)}
                >
                  <div className={cls.suggestionIcon}>{item.icon}</div>
                  <div className={cls.suggestionText}>
                    <span className={cls.suggestionTitle}>{item.title}</span>
                    <span className={cls.suggestionSubtitle}>
                      {item.subtitle}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className={cls.footer}>
        <div className={cls.inputBox}>
          <textarea
            className={cls.input}
            placeholder="What can we help you with?"
            aria-label="Message the AI agent"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
          />
          <div className={cls.inputActions}>
            <div className={cls.rightActions}>
              <button
                className={cls.sendBtn}
                aria-label="send"
                onClick={handleSend}
                disabled={sending || !input.trim()}
              >
                <ArrowUpwardIcon fontSize="small" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChatPanel;
