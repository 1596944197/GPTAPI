import dayjs from "dayjs";
import fetch from "node-fetch";
function renderInitMessage() {
  return [
    {
      role: "system",
      content: `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible.\nKnowledge cutoff: 2021-09-01\nCurrent date: ${dayjs().format(
        "YYYY-MM-DD"
      )}')}`,
    },
  ];
}

const params = {
  model: "",
  messages: renderInitMessage(),
  temperature: 0.7,
  stream: true,
};

export function createGptChat(options = {
  apiKey: '',
  baseUrl: '',
  model: "gpt-3.5-turbo",
}) {
  params.model = options.model || "gpt-3.5-turbo"

  const sendMessage = (message = '') => {
    return new Promise((resolve, reject) => {
      fetch(
        `${options.baseUrl || "https://api.openai.com"
        }/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${options.apiKey}`,
            "Content-Type": "application/json",
            origin: "chrome-extension://iaakpnchhognanibcahlpcplchdfmgma",
          },
          body: JSON.stringify(params),
        }
      )
        .then((res) => res.text())
        .then((m = '') => {
          const jsonData = m
            .split("\n")
            .filter((line) => line !== "" && line !== "data: [DONE]")
            .map((line) => line.replace("data: ", ""))
            .map((line) => JSON.parse(line));

          const AiText = jsonData
            .filter(({ choices: [{ finish_reason }] }) => !finish_reason)
            .map(({ choices: [{ delta }] }) => delta.content)
            .join("");
          params.messages.push({
            role: "assistant",
            content: AiText,
          });
          resolve(AiText)
        })
        .catch(
          (e) => reject(e),
          // @ts-ignore
          (params.messages = renderInitMessage())
        );
    })
  }

  const reset = () => {
    try {
      params.messages = renderInitMessage()
      return true
    } catch {
      return false
    }
  }

  return {
    sendMessage,
    reset
  }
}
