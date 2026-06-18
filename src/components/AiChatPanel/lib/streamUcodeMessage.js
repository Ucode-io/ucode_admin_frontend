import { buildStreamHeaders, buildStreamUrl } from "@/services/ucodeChat/ucodeChatService";

/**
 * Open the u-code builder SSE stream and dispatch each parsed event.
 *
 * `EventSource` can't POST a body, so we use fetch + a ReadableStream reader and
 * split frames on the blank-line delimiter ("\n\n"), per the SSE protocol doc.
 *
 * @param {object}   params
 * @param {string}   params.chatId
 * @param {string}   params.content       user message text
 * @param {(e:object)=>void} params.onEvent  called for every SSEEvent
 * @param {AbortSignal} [params.signal]    abort to stop reading (build keeps running server-side)
 * @returns {Promise<void>} resolves when the stream ends (done/error/closed)
 */
export async function streamUcodeMessage({ chatId, content, onEvent, signal }) {
  const res = await fetch(buildStreamUrl(chatId), {
    method: "POST",
    headers: buildStreamHeaders(),
    body: JSON.stringify({ content }),
    signal,
  });

  if (!res.ok || !res.body) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      detail = "";
    }
    throw new Error(detail || `Stream request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    let streaming = true;
    while (streaming) {
      const { value, done } = await reader.read();
      if (done) {
        streaming = false;
        break;
      }
      buffer += decoder.decode(value, { stream: true });

      let idx;
      // Events are separated by a blank line ("\n\n").
      while ((idx = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);

        for (const line of frame.split("\n")) {
          if (line.startsWith(":")) continue; // keepalive comment — ignore
          if (!line.startsWith("data:")) continue;
          const raw = line.slice(5).trim();
          if (!raw) continue;
          try {
            onEvent(JSON.parse(raw));
          } catch {
            // ignore malformed frame, keep reading
          }
        }
      }
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      /* noop */
    }
  }
}
