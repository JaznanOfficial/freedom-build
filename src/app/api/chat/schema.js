import { z } from "zod";

// define a schema for the notifications
export const sceneSchema = z.object({
  scenes: z.array(
    z.object({
      scene_serial: z.number().int().min(),
      prompt: z.string().min(4),
      duration: z.enum([4, 6, 8]),
      aspect_ratio: z.enum(["16:9", "9:16"]).default("16:9"),
      resolution: z.enum(["720p", "1080p"]).default("720p"),
      status: z
        .enum(["pending", "processing", "completed", "failed"])
        .default("pending"),
      project_id: z.string().optional(),
    })
  ),
});
