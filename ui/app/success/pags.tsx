"use client";

import { useEffect } from "react";

import { CheckLogin, SetLoginState } from "@/api/auth";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    CheckLogin().then((resp) => {
      if (resp.error) {
        router.push("/login");
      } else {
        SetLoginState();
        router.push("/challs");
      }
    });
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">logging in...</h1>
    </div>
  );
}
