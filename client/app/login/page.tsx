"use client";

// @ts-ignore
import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";

import { githubCallback, login, SetAuthToken } from "@/api/auth";

function githubPopup(): string {
  const state = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");

  const url =
    "https://github.com/login/oauth/authorize" +
    `?scope=user` +
    `&client_id=036b617a016c7d29c5bb` +
    `&redirect_uri=${location.origin}/integrations/github/callback` +
    `&state=${state}`;
  const title = "GitHub Login";
  const w = 600;
  const h = 500;

  const systemZoom = window.innerWidth / window.screen.availWidth;
  const left = (window.innerWidth - w) / 2 / systemZoom + window.screenLeft;
  const top = (window.innerHeight - h) / 2 / systemZoom + window.screenTop;
  const popup = window.open(
    url,
    title,
    [
      "scrollbars",
      "resizable",
      `width=${w / systemZoom}`,
      `height=${h / systemZoom}`,
      `top=${top}`,
      `left=${left}`,
    ].join(",")
  );

  if (!popup) {
    throw new Error("Failed to open popup");
  } else {
    popup.focus();
  }

  return state;
}

export default function Page() {
  const [oauthState, setOauthState] = useState("");
  const handleClick = () => {
    setOauthState(githubPopup());
  };

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.origin !== location.origin) {
        return;
      }
      if (event.data.kind !== "githubCallback") {
        return;
      }
      if (oauthState === null || event.data.state !== oauthState) {
        return;
      }

      const action = async () => {
        const {
          kind,
          message,
          data,
        }: {
          kind: "goodGithubToken";
          message: string;
          data: { githubToken: string; githubId: string };
        } = await githubCallback({ githubCode: event.data.code });

        if (kind !== "goodGithubToken") {
          console.error(message);
          return;
        }

        // 버튼 비활성화 시점
        const loginRes = await login({ githubToken: data.githubToken });
        if (loginRes.authToken) {
          SetAuthToken({ authToken: loginRes.authToken });
        }
        if (loginRes && loginRes.badUnknownUser) {
          console.error("login failed", loginRes.badUnknownUser);
        }
      };

      action();
    });
  }, [oauthState]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-4">Log in to Telos</h1>

      <Button onClick={handleClick}>
        <GitHubLogoIcon className="mr-2 h-4 w-4" /> Login with GitHub
      </Button>

      <div className="flex flex-col items-center justify-center">
        <p className="text-xs text-center">
          *Your first login triggers automatic membership registration.
        </p>
      </div>
    </div>
  );
}
