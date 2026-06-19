import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddIcon,
  CloseIcon,
  RepeatClockIcon,
  ArrowUpIcon,
  LinkIcon,
  HamburgerIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import { Sparkles, Maximize2, Minimize2 } from "lucide-react";
import { ChatIcon, TableIcon, SearchIcon } from "@/utils/constants/icons";

import { aiChatActions } from "@/store/aiChat/aiChat.slice";
import { useUcodeChat } from "./lib/useUcodeChat";
import { Conversation } from "./components/Conversation";
import cls from "./styles.module.scss";

const SUGGESTIONS = [
  {
    icon: <TableIcon width="18" height="18" color="#667085" />,
    title: "Создать таблицу",
    subtitle: "Помоги начать",
    prompt: "Создай таблицу товаров с названием, ценой и категорией",
  },
  {
    icon: <LinkIcon boxSize="18px" />,
    title: "Построить связь",
    subtitle: "Проведи по шагам",
    prompt: "Свяжи таблицы order_item и product связью многие-к-одному",
  },
  {
    icon: <HamburgerIcon boxSize="18px" />,
    title: "Раздел меню",
    subtitle: "Создать раздел каталога",
    prompt: "Создай раздел меню «Каталог» и помести в него таблицу product",
  },
  {
    icon: <PlusSquareIcon boxSize="18px" />,
    title: "Добавить записи",
    subtitle: "Заполнить данными",
    prompt: "Добавь 5 тестовых записей в таблицу product",
  },
  {
    icon: <SearchIcon width="18" height="18" color="#667085" />,
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
  const expanded = useSelector((state) => state.aiChat.expanded);

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
    <div className={`${cls.panel} ${expanded ? cls.panelExpanded : ""}`}>
      <div className={cls.header}>
        <div className={cls.title} title={title || "New conversation"}>
          <Sparkles size={16} />
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
              <RepeatClockIcon boxSize="16px" />
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
                          <span className={cls.historyItemIcon}>
                            <ChatIcon width="16" height="16" />
                          </span>
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
            <AddIcon boxSize="15px" />
          </button>
          <button
            className={cls.iconBtn}
            aria-label={expanded ? "collapse" : "full screen"}
            onClick={() => dispatch(aiChatActions.toggleAiChatExpand())}
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            className={cls.iconBtn}
            aria-label="close"
            onClick={handleClose}
          >
            <CloseIcon boxSize="13px" />
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
                <ArrowUpIcon boxSize="18px" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChatPanel;
