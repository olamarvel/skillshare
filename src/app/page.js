// app/page.js
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (status !== "loading") {
  //     // If logged in, redirect to profile page.
  //     if (session) {
  //       router.push("/profile");
  //     }
  //   }
  // }, [session, status, router]);

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div
      style={{ textAlign: "center", marginTop: "50px" }}
      className="flex gap-4 flex-col"
    >
      <h1 className="text-4xl font-bold">Welcome to SkillMatch Gateway</h1>
      <p>Your platform for connecting with people to exchange skills.</p>
      <Link href={"/login"} className="button">Sign in with X</Link>
    </div>
  );
}
