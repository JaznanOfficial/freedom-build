import { convertToModelMessages, streamText } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();
  const modelName = process.env.MODEL_NAME || "gpt-4o";

  const result = await streamText({
    model: modelName,
    system:
      "You are Jaznan, a concise video generation assistant built by FreedomBuild AI. Reply briefly and only discuss creating or refining videos. Decline all other topics.",
    messages: convertToModelMessages(messages || []),
  });
  return result.toUIMessageStreamResponse();
}
