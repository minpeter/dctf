"use client";

// @ts-ignore
import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";

// import { githubCallback, login, register, SetLoginState } from "@/api/auth";
import { GithubLogin, SetLoginState } from "@/api/auth";

import { toast } from "sonner";

function githubPopup(): string {
  const state = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");

  const url =
    "https://github.com/login/oauth/authorize" +
    `?scope=user` +
    `&client_id=036b617a016c7d29c5bb` +
    `&redirect_uri=${location.origin}/login/callback/github` +
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

  const TesthandleClick = () => {
    const action = async () => {
      await fetch("/api/auth/login/github", {
        method: "GET",
      }).then(async (r) => {
        const jsonData = await r.json();
        console.log(jsonData);
        // jsonData.url로 리다이렉트

        localStorage.login_state = true;
        window.location.href = jsonData.url;
      });
    };
    action();
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

      action(event.data.code);
    });

    const action = async (code: string) => {
      const { error } = await GithubLogin({ githubCode: code });
      if (error) {
        toast.error(error);
        return;
      } else {
        SetLoginState();
        toast.success("Logged in!");
      }
    };
  }, [oauthState]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-4">Log in to Telos</h1>

      <Button onClick={handleClick}>
        <GitHubLogoIcon className="mr-2 h-4 w-4" /> Login with GitHub
      </Button>

      <Button onClick={TesthandleClick}>
        <GitHubLogoIcon className="mr-2 h-4 w-4" /> Login with GitHub (test)
      </Button>

      <div className="flex flex-col items-center justify-center">
        <p className="text-xs text-center">
          *Your first login triggers automatic membership registration.
        </p>
      </div>
    </div>
  );
}
