import {
  Experimental_Agent as Agent,
  convertToModelMessages,
  tool,
  validateUIMessages,
} from "ai";
import { z } from "zod";
import { POST as generateScenesRoute } from "@/app/api/scenes/route";

export const maxDuration = 30;
const modelName = process.env.MODEL_NAME || "gpt-4o";
const MIN_SCENE_PROMPT_LENGTH = 4;

const generateScenesTool = tool({
  description: "Generate structured video scenes using the existing scene generation route.",
  inputSchema: z.object({
    prompt: z
      .string()
      .min(MIN_SCENE_PROMPT_LENGTH, "Prompt must be at least 4 characters long."),
  }),
  execute: async ({ prompt }) => {
    const request = new Request("http://localhost/api/scenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const response = await generateScenesRoute(request);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Scene generation failed");
    }

    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch {
      return { scenes: text };
    }
  },
});

const chatAgent = new Agent({
  model: modelName,
  system:
    "You are Jaznan, a helpful assistant built by FreedomBuild who can generate video scenes.don't talk too much, and don't give too long answer, go straight to the point. When the user asks you to create or update video scenes, call the generateScenes tool with their instructions.",
  tools: {
    generateScenes: generateScenesTool,
  },
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
