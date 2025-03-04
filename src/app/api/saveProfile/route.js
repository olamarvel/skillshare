// app/api/saveProfile/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Profile from "@/models/Profile";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await request.json();
  const { email, teach, learn, twitterHandle, img, name,Tid } = data;
  
  await dbConnect();
  try {
    let profile = await Profile.findOne({ email });
    if (profile) {
      // Update the existing profile
      profile.teach = teach;
      profile.learn = learn;
      profile.twitterHandle = twitterHandle;
      profile.img = img;
      profile.name = name;
      profile.Tid = Tid
      await profile.save();
    } else {
      // Create a new profile
      profile = await Profile.create({ email, teach, learn, twitterHandle, img, name,Tid });
    }
    return NextResponse.json({ success: true, profile }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  await dbConnect();
  const profile = await Profile.findOne({ email: session.user.email });
  return !profile
    ? NextResponse.json({ error: "Profile not found" }, { status: 404 })
    : NextResponse.json(profile, { status: 200 });
}
