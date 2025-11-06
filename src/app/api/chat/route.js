import {
  Experimental_Agent as Agent,
  convertToModelMessages,
  validateUIMessages,
} from "ai";

export const maxDuration = 30;
const modelName = process.env.MODEL_NAME || "gpt-4o";

const chatAgent = new Agent({
  model: modelName,
  system:
    "You are Jaznan, a helpful assistant built by FreedomBuild who can generate video scenes.don't talk too much, and don't give too long answer, go straight to the point.",
  tools: {},
});

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const messages = Array.isArray(body?.messages) ? body.messages : [];

  if (messages.length === 0) {
    return new Response("No messages provided", { status: 400 });
  }

  const validated = await validateUIMessages({ messages });

  if (validated.length === 0) {
    return new Response("Invalid messages", { status: 400 });
  }

  const modelMessages = convertToModelMessages(validated);

  const stream = await chatAgent.stream({ messages: modelMessages });

  return stream.toUIMessageStreamResponse();
}
