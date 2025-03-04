// app/match/page.js
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import noImg from "@/Modules/noimg";

export default function MatchPage() {
  const { data: session, status } = useSession();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (session) {
      fetch(`/api/match?user=${session.user.email}`)
        .then((res) => res.text())
        .then((text) => {
          try {
            const data = JSON.parse(text);
            setMatches(data.matches);
          } catch (error) {
            console.error("Failed to parse JSON:", error, text);
          }
        })
        .catch((error) => console.error("Fetch error:", error));
    }
  }, [session]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in.</div>;
  
  return (
    <div
      style={{ maxWidth: "600px", margin: "auto" }}
      className="flex gap-4 flex-col px-4 max-h-[90%]"
    >
      <h1 className="heading">Your Skill Matches</h1>
      {matches?.length === 0 && (
        <p>No matches found. Please check back later.</p>
      )}
      {matches?.map((match, index) => (
        <div key={index} className="flex gap-4 items-center justify-center rounded shadow-lg p-4 mb-1">
          <Image width={50} height={50} src={match.img || noImg } alt={"A match with user:" + match.twitterHandle} className="rounded shadow "/>
          <p>
            <strong>{match.name}</strong>
            <br /> can teach: {match.teach} | Wants to learn: {match.learn}
          </p>
          {/* Redirect to X (Twitter) for communication */}
          <a
            // href={!match.Tid?`https://twitter.com/${match.twitterHandle}`:`https://twitter.com/messages/compose?recipient_id=${match.Tid}&text=Hello from SkillShare!`}
            href={`https://twitter.com/${match.twitterHandle}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-black text-white px-3 py-2 h-full rounded-lg shadow-sm"
          >
            Connect on X
          </a>
        </div>
      ))}
    </div>
  );
}
