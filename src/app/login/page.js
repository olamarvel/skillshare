// app/login/page.js
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div>Loading...</div>;
  if (session) setTimeout(() => {
    router.push("/profile")
  }, 5000);
  return (
    <div
      style={{ textAlign: "center", marginTop: "50px" }}
      className="flex gap-4 flex-col"
    >
      <h1 className="text-4xl font-bold">Welcome to SkillMatch Gateway</h1>
      {!session ? (
        <button onClick={() => signIn("twitter")} className="button">
          Sign in with X
        </button>
      ) : (
        <>
          <p>Signed in as {session.user.email}</p>
          <button onClick={() => signOut()} className="button">
            Sign out
          </button>
          <p className="text-black/50 text-sm italic"> you would be redirected in 5 seconds</p>
        </>
      )}
    </div>
  );
}
