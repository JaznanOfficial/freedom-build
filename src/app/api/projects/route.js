import { NextResponse } from "next/server";
import { ProjectModel } from "@/lib/db/models/project";
import { connectMongoose } from "@/lib/db/mongoose";

function formatProject(doc) {
  const { _id, __v, ...rest } = doc.toObject({ versionKey: false });
  return { id: _id.toString(), ...rest };
}

export async function GET() {
  try {
    await connectMongoose();
    const projects = await ProjectModel.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        data: projects.map(formatProject),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[projects.GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const name = payload?.name?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    await connectMongoose();

    const project = await ProjectModel.create({ name });

    return NextResponse.json({ data: formatProject(project) }, { status: 201 });
  } catch (error) {
    console.error("[projects.POST]", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
