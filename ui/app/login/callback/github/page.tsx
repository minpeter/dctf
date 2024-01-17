"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { GitHubLogoIcon, ReloadIcon } from "@radix-ui/react-icons";

import { GithubCallback } from "@/api/auth";
import { Button } from "@/components/ui/button";

export default function Page() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const githubError = searchParams.get("error");
  const githubErrorDescription = searchParams.get("error_description");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const action = async (code: string, state: string) => {
      const { error, authToken } = await GithubCallback({
        code,
        state,
      });

      if (error !== null) {
        setError(error);
        return;
      }
      setError(null);

      localStorage.auth_token = authToken;
      localStorage.login_state = true;

      window.location.href = "/challs";
    };

    if (code && state) {
      action(code, state);
    }
  }, [code, state]);

  useEffect(() => {
    if (githubError) {
      setError(githubErrorDescription);
    }
  }, [githubError, githubErrorDescription]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">
        {error ? (
          githubError ? (
            "Github login failed"
          ) : (
            "internal server error"
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <GitHubLogoIcon className="w-8 h-8 animate-spin" />
            <span>Logging in...</span>
          </div>
        )}
      </h1>

      {error && <p className="text-gray-400">{error}</p>}

      {error && (
        <Button onClick={() => (window.location.href = "/login")}>
          Go back
        </Button>
      )}
    </div>
  );
}
