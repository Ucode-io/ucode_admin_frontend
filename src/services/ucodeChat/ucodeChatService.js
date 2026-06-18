import request, { baseURL } from "@/utils/request";
import { store } from "@/store";

/**
 * Service for the u-code AI "builder" chat.
 *
 * Plain CRUD goes through the shared axios `request` instance (v1, auto-unwrapped,
 * auth/headers injected by interceptors). The streaming message endpoint can't use
 * axios — SSE needs a raw `fetch` + ReadableStream — so it builds headers manually
 * from the same redux store the interceptors read.
 */
const ucodeChatService = {
  // POST /v1/ai-chat — create a chat to hold the conversation.
  createChat: (data) => request.post("/ai-chat", data),

  // GET /v1/ai-chat/list — list previous chats (history).
  getChats: (params) => request.get("/ai-chat/list", { params }),

  // GET /v1/ai-chat/messages/:chatId — load a chat's message history.
  getMessages: (chatId) => request.get(`/ai-chat/messages/${chatId}`),

  // DELETE /v1/ai-chat/:chatId
  deleteChat: (chatId) => request.delete(`/ai-chat/${chatId}`),
};

/** Build the headers a raw fetch needs (mirrors request.js interceptor). */
export const buildStreamHeaders = () => {
  const { auth, company } = store.getState();
  const headers = {
    "Content-Type": "application/json",
  };
  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
    headers["environment-id"] = company?.environmentId ?? "";
    headers["resource-id"] = auth?.resourceId ?? "";
  }
  return headers;
};

/** Full URL for the streaming ucode-messages endpoint. */
export const buildStreamUrl = (chatId) => {
  const { company } = store.getState();
  const projectId = company?.projectId ?? "";
  return `${baseURL}/ai-chat/ucode-messages/${chatId}?stream=true&project-id=${projectId}`;
};

export default ucodeChatService;
