import { streamObject } from "ai";
import { sceneSchema } from "./schema";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  const body = await req.json();
  let promptInput;
  let historyEntries = [];

  if (typeof body === "string") {
    promptInput = body;
  } else if (typeof body === "object" && body !== null) {
    promptInput = body.prompt;
    if (Array.isArray(body.history)) {
      historyEntries = body.history;
    }
  }

  const trimmedPrompt = typeof promptInput === "string" ? promptInput.trim() : "";
  if (!trimmedPrompt) {
    return new Response("Prompt is required", { status: 400 });
  }

  const historyText = historyEntries.length > 0 ? `\n\nConversation history:\n${historyEntries.join("\n")}` : "";
  const guidance = `You are designing a set of video scenes for a marketing video. Strictly follow these rules:
- The user will implicitly or explicitly request a total video duration. Respect their target.
- Scene durations must be numbers, each exactly 4, 6, or 8 (seconds). Never output decimals or strings with units.
- When you determine how many scenes to produce, divide the requested duration by each candidate duration (4, 6, or 8) and use the ceiling function to get an integer number of scenes. Pick the option whose total duration (count × duration) is closest to or just above the requested duration. You may mix 4/6/8 second scenes, but every scene must still use one of those three durations.
- Ensure the sum of all scene durations is at least the requested duration and as tight as possible while obeying the ceiling rule.
- Return JSON matching the provided schema.`;
  const finalPrompt = `${guidance}\n\nUser request: ${trimmedPrompt}${historyText}`;

  const modelName = process.env.MODEL_NAME || "gpt-4o";

  const result = streamObject({
    model: modelName,
    schema: sceneSchema,
    prompt: finalPrompt,
  });

  return result.toTextStreamResponse();
}
