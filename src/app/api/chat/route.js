import { streamObject } from "ai";
import { sceneSchema } from "./schema";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();
  const modelName = process.env.MODEL_NAME || "gpt-4o";

  const result = streamObject({
    model: modelName,
    schema: sceneSchema,
    prompt:
      "Generate video scenes (based on the user's duration, and devide that user's provided duration using 4/6/8, like if user said give me 15 seconds vide, then 15/4 = 3.75 scenes, 15/6 = 2.5 scenes, 15/8 = 1.875 scenes, but ceil that value to the nearest integer so that much will be the scenes ) for this context:" +
      messages,
  });

  return result.toTextStreamResponse();
}
