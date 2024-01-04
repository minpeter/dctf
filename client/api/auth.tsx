"use client";

import { request } from "@/api/util";

export function SetAuthToken({ authToken }: { authToken: string }) {
  localStorage.token = authToken;
  window.location.href = "/challs";
}

export function Logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

export async function githubCallback({ githubCode }: { githubCode: string }) {
  return await request("POST", "/integrations/github/callback", {
    githubCode,
  });
}

export async function login({ githubToken }: { githubToken: string }) {
  const resp = await request("POST", "/auth/login", {
    githubToken: githubToken,
  });

  switch (resp.kind) {
    case "goodLogin":
      return {
        authToken: resp.data.authToken,
      };
    default:
      return {
        badUnknownUser: resp.error,
      };
  }
}
