import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, convertToModelMessages } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

export async function POST(req) {
  const { messages } = await req.json();
  const modelName = process.env.MODEL_NAME;
  if (!modelName) {
    return new Response("MODEL_NAME env var is not set", { status: 500 });
  }
  const chatModel = openrouter.chat(modelName);

  const result = await streamText({
    model: chatModel,
    messages: convertToModelMessages(messages || []),
  });
  return result.toUIMessageStreamResponse();
}
