"use client";

import { useEffect } from "react";

import { CheckLogin, SetLoginState } from "@/api/auth";

export default function Page() {
  useEffect(() => {
    CheckLogin().then((resp) => {
      if (resp.error) {
        window.location.href = "/login";
      } else {
        SetLoginState();
        window.location.href = "/challs";
      }
    });
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">logging in...</h1>
    </div>
  );
}
