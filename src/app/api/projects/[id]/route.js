import { NextResponse } from "next/server";

import { connectMongoose } from "@/lib/db/mongoose";
import { ProjectModel } from "@/lib/db/models/project";

function formatProject(doc) {
  const { _id, ...rest } = doc.toObject({ versionKey: false });
  return { id: _id.toString(), ...rest };
}

async function getProjectOr404(id) {
  await connectMongoose();
  const project = await ProjectModel.findById(id);

  if (!project) {
    return null;
  }

  return project;
}

export async function GET(_request, { params }) {
  try {
    const project = await getProjectOr404(params.id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ data: formatProject(project) }, { status: 200 });
  } catch (error) {
    console.error("[projects/:id.GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const payload = await request.json();
    const name = payload?.name?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 },
      );
    }

    await connectMongoose();

    const updated = await ProjectModel.findByIdAndUpdate(
      params.id,
      { name },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ data: formatProject(updated) }, { status: 200 });
  } catch (error) {
    console.error("[projects/:id.PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectMongoose();

    const result = await ProjectModel.findByIdAndDelete(params.id);

    if (!result) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[projects/:id.DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
