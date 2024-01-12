"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { GithubCallback } from "@/api/auth";
import { Button } from "@/components/ui/button";

export default function Page() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");

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

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">
        {error ? "internal server error" : "Logging in..."}
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
