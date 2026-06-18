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

/** First line of a chat title, trimmed to a readable length. */
const sessionTitle = (title) => {
  const firstLine = (title || "").split("\n")[0].trim();
  const text = firstLine || "Без названия";
  return text.length > 48 ? `${text.slice(0, 48)}…` : text;
};

/** "17 июн, 14:40" style timestamp from an ISO date. */
const formatSessionTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const AiChatPanel = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.aiChat.isOpen);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [input, setInput] = useState("");

  const {
    title,
    messages,
    run,
    sending,
    sessions,
    sessionsLoading,
    send,
    reset,
    loadChat,
    loadSessions,
  } = useUcodeChat();

  if (!isOpen) return null;

  const hasConversation = messages.length > 0 || !!run;

  const handleClose = () => dispatch(aiChatActions.closeAiChat());

  const toggleHistory = () => {
    setIsHistoryOpen((prev) => {
      const next = !prev;
      if (next) loadSessions();
      return next;
    });
  };

  const handleSelectSession = (chatId, chatTitle) => {
    setIsHistoryOpen(false);
    loadChat(chatId, chatTitle);
  };

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
        <div className={cls.title} title={title || "New conversation"}>
          <AutoAwesomeIcon fontSize="small" />
          <span className={cls.titleText}>
            {title ? sessionTitle(title) : "New conversation"}
          </span>
        </div>
        <div className={cls.headerActions}>
          <div className={cls.historyWrap}>
            <button
              className={`${cls.iconBtn} ${isHistoryOpen ? cls.iconBtnActive : ""}`}
              aria-label="history"
              onClick={toggleHistory}
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
                    {sessionsLoading ? (
                      <div className={cls.historyEmpty}>Загрузка…</div>
                    ) : sessions.length === 0 ? (
                      <div className={cls.historyEmpty}>Нет сессий</div>
                    ) : (
                      sessions.map((session) => (
                        <button
                          className={cls.historyItem}
                          key={session.id}
                          onClick={() =>
                            handleSelectSession(session.id, session.title)
                          }
                        >
                          <ChatBubbleOutlineIcon
                            fontSize="small"
                            className={cls.historyItemIcon}
                          />
                          <div className={cls.historyItemText}>
                            <span className={cls.historyItemTitle}>
                              {sessionTitle(session.title)}
                            </span>
                            <span className={cls.historyItemTime}>
                              {formatSessionTime(session.updated_at)}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
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
