import mongoose from "mongoose";

const videoSceneSchema = new mongoose.Schema(
  {
    project_id: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    scene_serial: {
      type: Number,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },
    video_url: {
      type: String,
      default: null,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    aspect_ratio: {
      type: String,
      required: true,
      trim: true,
    },
    reference_image: {
      type: String,
      default: null,
      trim: true,
    },
    last_image: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

videoSceneSchema.index({ project_id: 1, scene_serial: 1 }, { unique: true });

export const VideoSceneModel =
  mongoose.models.VideoScene || mongoose.model("VideoScene", videoSceneSchema);

export async function createScene(data) {
  const scene = await VideoSceneModel.create(data);
  return scene.toObject();
}

export async function listScenes(filter = {}) {
  const scenes = await VideoSceneModel.find(filter).sort({ scene_serial: 1 }).lean();
  return scenes;
}

export async function updateScene(id, updates) {
  const scene = await VideoSceneModel.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).lean();
  return scene;
}
