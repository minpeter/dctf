"use client";

import { useEffect } from "react";

export default function GithubCallback() {
  useEffect(() => {
    window.opener.postMessage(
      {
        kind: "githubCallback",
        code: new URLSearchParams(location.search).get("code"),
        state: new URLSearchParams(location.search).get("state"),
      },
      location.origin
    );
    window.close();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Logging in...</h1>
    </div>
  );
}
