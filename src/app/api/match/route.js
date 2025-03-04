// app/api/match/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Profile from "@/models/Profile";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import stringSimilarity from "string-similarity";

function parseSkills(skillString) {
  return skillString
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 0);
}

function calculateEnhancedMatchScore(userProfile, candidateProfile, pairThreshold = 0.5) {
  const userTeach = parseSkills(userProfile.teach);
  const userLearn = parseSkills(userProfile.learn);
  const candidateTeach = parseSkills(candidateProfile.teach);
  const candidateLearn = parseSkills(candidateProfile.learn);

  let totalScore = 0;
  let totalComparisons = 0;
  let matchCount = 0;

  // Compare each skill the user wants to learn with each skill the candidate can teach.
  userLearn.forEach(skill => {
    candidateTeach.forEach(candidateSkill => {
      const score = stringSimilarity.compareTwoStrings(skill, candidateSkill);
      totalScore += score;
      totalComparisons++;
      if (score >= pairThreshold) {
        matchCount++;
      }
    });
  });

  // Compare each skill the candidate wants to learn with each skill the user can teach.
  candidateLearn.forEach(skill => {
    userTeach.forEach(userSkill => {
      const score = stringSimilarity.compareTwoStrings(skill, userSkill);
      totalScore += score;
      totalComparisons++;
      if (score >= pairThreshold) {
        matchCount++;
      }
    });
  });

  const averageScore = totalComparisons > 0 ? totalScore / totalComparisons : 0;
  // Boost the average score by the number of matching pairs (adding 1 to avoid zero multiplication)
  const enhancedScore = averageScore * (1 + matchCount);
  return enhancedScore;
}

function getMatches(currentUser, profiles, threshold = 0.5) {
  return profiles
    .filter(profile => profile.email !== currentUser.email)
    .map(profile => {
      const score = calculateEnhancedMatchScore(currentUser, profile);
      return { ...profile.toObject(), matchScore: score };
    })
    .filter(match => match.matchScore >= threshold)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get("user");

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const currentUser = await Profile.findOne({ email: userEmail });
  if (!currentUser) {
    
    return NextResponse.json({ error: "Profile not found" }, { status: 500 });
  }

  const allProfiles = await Profile.find({});
  const matches = getMatches(currentUser, allProfiles, 0.4);
  return NextResponse.json({ matches }, { status: 200 });
}
