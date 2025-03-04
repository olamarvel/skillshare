// app/profile/page.js
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [teach, setTeach] = useState("");
  const [learn, setLearn] = useState("");
  // console.log(session)
  useEffect(function () {
    const setfromProfile = async () => {
      const res = await fetch("/api/saveProfile", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) return;
      const profile = await res.json();
      setLearn(profile?.learn);
      setTeach(profile?.teach);
    };
    setfromProfile();
  }, []);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in.</div>;
  const saveProfile = async () => {
    const res = await fetch("/api/saveProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        img: session.user.image,
        email: session.user.email,
        teach,
        learn,
        twitterHandle: session.user.username, 
        name:session.user.name,
        Tid: session.user.twitterId 
      }),
    });
    if (res.ok) {
      router.push("/match");
    } else {
      alert("Error saving profile.");
    }
  };

  return (
    <div
      style={{ maxWidth: "600px", margin: "auto" }}
      className="flex gap-4 flex-col"
    >
      <h1 className="heading">Set Up Your Skill Profile</h1>
      <div>
        <input
          placeholder="Skills you can teach (comma-separated)"
          value={teach}
          onChange={(e) => setTeach(e.target.value)}
        />
      </div>
      <div>
        <input
          placeholder="Skills you want to learn (comma-separated)"
          value={learn}
          onChange={(e) => setLearn(e.target.value)}
        />
      </div>
      <button onClick={saveProfile} className="button">
        Save Profile
      </button>
    </div>
  );
}
