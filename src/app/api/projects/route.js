import { NextResponse } from "next/server";
import { ProjectModel } from "@/lib/db/models/project";
import { connectMongoose } from "@/lib/db/mongoose";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;
const MIN_PAGE_SIZE = 1;
const MIN_PAGE = 1;

function formatProject(doc) {
  const { _id, ...rest } = doc.toObject({ versionKey: false });
  return { id: _id.toString(), ...rest };
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const limitParam = Number.parseInt(url.searchParams.get("limit") ?? "", 2);
    const pageParam = Number.parseInt(url.searchParams.get("page") ?? "", 10);

    const limit = Number.isNaN(limitParam)
      ? DEFAULT_PAGE_SIZE
      : Math.min(Math.max(limitParam, MIN_PAGE_SIZE), MAX_PAGE_SIZE);
    const page = Number.isNaN(pageParam)
      ? MIN_PAGE
      : Math.max(pageParam, MIN_PAGE);
    const skip = (page - 1) * limit;

    await connectMongoose();

    const [projects, total] = await Promise.all([
      ProjectModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProjectModel.countDocuments(),
    ]);

    const hasMore = page * limit < total;

    return NextResponse.json(
      {
        data: projects.map(formatProject),
        meta: {
          page,
          pageSize: limit,
          total,
          hasMore,
          nextPage: hasMore ? page + 1 : null,
        },
      },
      { status: 200 }
    );
  } catch (_error) {
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
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
