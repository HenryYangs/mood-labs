import { getRecommendation } from "@/lib/recommend";
import { moodOptions, type Mood } from "@/types/mood";
import { NextResponse } from "next/server";

type RecommendRequestBody = {
  mood?: string;
};

function isMood(input: string): input is Mood {
  return moodOptions.includes(input as Mood);
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as RecommendRequestBody;
  const moodInput = body.mood;

  if (!moodInput || !isMood(moodInput)) {
    return NextResponse.json({ error: "Invalid mood" }, { status: 400 });
  }

  const data = getRecommendation(moodInput);
  return NextResponse.json(data, { status: 200 });
}
