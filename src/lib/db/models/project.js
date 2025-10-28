import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ProjectModel =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
