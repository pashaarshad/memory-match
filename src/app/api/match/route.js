import { readdir } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { matchFaceFromDataset } from "@/lib/face/match-face";

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function listDatasetImages() {
  const datasetPath = path.join(process.cwd(), "public", "dataset");
  const allFiles = await readdir(datasetPath);

  return allFiles
    .filter((name) => ALLOWED_EXT.has(path.extname(name).toLowerCase()))
    .map((name) => ({
      fileName: name,
      absolutePath: path.join(datasetPath, name),
      publicPath: `/dataset/${name}`,
    }));
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const selfie = formData.get("selfie");

    if (!selfie || typeof selfie === "string") {
      return NextResponse.json(
        { error: "Please upload a selfie image." },
        { status: 400 },
      );
    }

    const dataset = await listDatasetImages();
    const matches = await matchFaceFromDataset(selfie, dataset);

    return NextResponse.json({
      message: "Matching completed.",
      totalDatasetImages: dataset.length,
      matches,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server failed to match faces." },
      { status: 500 },
    );
  }
}
