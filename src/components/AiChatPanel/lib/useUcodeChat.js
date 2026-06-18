import { useCallback, useEffect, useReducer, useRef } from "react";
import ucodeChatService from "@/services/ucodeChat/ucodeChatService";
import { streamUcodeMessage } from "./streamUcodeMessage";

let _uid = 0;
const uid = () => `local-${Date.now()}-${++_uid}`;

const emptyRun = () => ({
  active: true,
  provider: null,
  steps: [],
  error: null,
  summary: null,
  duration: null,
});

/** Fold one SSE event into the live run object (returns a new run). */
function applyEvent(run, event) {
  const { type, message, value, icon, data } = event;
  const next = { ...run, steps: [...run.steps] };

  switch (type) {
    case "provider":
      next.provider = data || null;
      return next;

    case "table_done": {
      // Promote the matching "started" table row instead of appending a duplicate.
      const slug = data?.table;
      for (let i = next.steps.length - 1; i >= 0; i--) {
        const s = next.steps[i];
        if (s.action === "table" && s.table === slug && s.status === "started") {
          next.steps[i] = {
            ...s,
            status: data?.status || "done",
            message: message || s.message,
            value: value || s.value,
            data,
          };
          return next;
        }
      }
      next.steps.push(makeStep(event));
      return next;
    }

    case "warning":
      next.steps.push(makeStep({ ...event, _status: "failed" }));
      return next;

    case "error":
      next.error = message || "Что-то пошло не так";
      next.active = false;
      return next;

    case "done":
      next.summary = data?.summary || null;
      next.duration = data?.duration_sec ?? null;
      next.finalContent =
        data?.message?.content || message || "Готово!";
      next.active = false;
      return next;

    case "progress":
    case "table_start":
    default: {
      // A "brain" progress event (no data) is the AI's reasoning line.
      if (type === "progress" && !data) {
        next.steps.push({
          id: uid(),
          kind: "reasoning",
          icon: icon || "brain",
          message,
        });
        return next;
      }
      next.steps.push(makeStep(event));
      return next;
    }
  }
}

function makeStep(event) {
  const { icon, message, value, data, _status } = event;
  return {
    id: uid(),
    kind: "step",
    icon,
    message,
    value,
    action: data?.action,
    status: _status || data?.status,
    table: data?.table,
    reason: data?.reason,
    data,
  };
}

const initialState = {
  chatId: null,
  messages: [],
  run: null, // live assistant turn, or null
  sending: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CHAT":
      return { ...state, chatId: action.chatId };

    case "LOAD_MESSAGES":
      return { ...state, messages: action.messages, run: null };

    case "RESET":
      return { ...initialState };

    case "SEND_START":
      return {
        ...state,
        sending: true,
        messages: [
          ...state.messages,
          { id: uid(), role: "user", content: action.content },
        ],
        run: emptyRun(),
      };

    case "EVENT":
      if (!state.run) return state;
      return { ...state, run: applyEvent(state.run, action.event) };

    case "FINALIZE": {
      // Fold the finished run into a persisted assistant message.
      const run = state.run;
      if (!run) return { ...state, sending: false };
      const assistant = {
        id: uid(),
        role: "assistant",
        content: run.finalContent || (run.error ? null : ""),
        steps: run.steps,
        summary: run.summary,
        duration: run.duration,
        provider: run.provider,
        error: run.error || action.error || null,
      };
      return {
        ...state,
        sending: false,
        run: null,
        messages: [...state.messages, assistant],
      };
    }

    default:
      return state;
  }
}

export function useUcodeChat() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const abortRef = useRef(null);

  // Stop reading the stream on unmount (the build keeps running server-side).
  useEffect(() => () => abortRef.current?.abort(), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    dispatch({ type: "RESET" });
  }, []);

  const send = useCallback(
    async (text) => {
      const content = text?.trim();
      if (!content || state.sending) return;

      dispatch({ type: "SEND_START", content });

      try {
        // Lazily create a chat on the first message.
        let chatId = state.chatId;
        if (!chatId) {
          const chat = await ucodeChatService.createChat({
            title: content.slice(0, 60),
          });
          chatId = chat?.id || chat?.chat_id;
          dispatch({ type: "SET_CHAT", chatId });
        }
        if (!chatId) throw new Error("Не удалось создать чат");

        const controller = new AbortController();
        abortRef.current = controller;

        await streamUcodeMessage({
          chatId,
          content,
          signal: controller.signal,
          onEvent: (event) => dispatch({ type: "EVENT", event }),
        });

        dispatch({ type: "FINALIZE" });
      } catch (err) {
        if (err?.name === "AbortError") return; // unmounted / cancelled
        dispatch({
          type: "FINALIZE",
          error: err?.message || "Ошибка соединения",
        });
      } finally {
        abortRef.current = null;
      }
    },
    [state.chatId, state.sending],
  );

  const loadChat = useCallback(async (chatId) => {
    abortRef.current?.abort();
    try {
      const messages = await ucodeChatService.getMessages(chatId);
      dispatch({
        type: "LOAD_MESSAGES",
        messages: Array.isArray(messages) ? messages : messages?.messages || [],
      });
      dispatch({ type: "SET_CHAT", chatId });
    } catch {
      dispatch({ type: "SET_CHAT", chatId });
    }
  }, []);

  return {
    chatId: state.chatId,
    messages: state.messages,
    run: state.run,
    sending: state.sending,
    send,
    reset,
    loadChat,
  };
}

export default useUcodeChat;
