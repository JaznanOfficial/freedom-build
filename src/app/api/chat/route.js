import { convertToModelMessages, streamText } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();
  const modelName = process.env.MODEL_NAME || "gpt-4o";

  const result = await streamText({
    model: modelName,
    system:
      "You are a helpful assistant. you're name is Jaznan. you've built by FreedomBuild AI. don't talk too much. give the straight answers.",
    messages: convertToModelMessages(messages || []),
  });
  return result.toUIMessageStreamResponse();
}
