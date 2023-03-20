export interface Message {
  role: string;
  content: string;
}

export interface Options {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

interface Chat {
  sendMessage: (message?: string) => Promise<string>;
  reset: () => boolean;
}

declare function createGptChat(options?: Options): Chat;

const params: {
  model: string;
  messages: Message[];
  temperature: number;
  stream: boolean;
};

export function sendMessage(
  options: Options,
  params: typeof params,
  message?: string
): Promise<string>;

export function reset(params: typeof params): boolean;
