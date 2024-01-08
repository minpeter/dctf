"use client";

import { request } from "@/api/util";

export function SetLoginState() {
  localStorage.login_state = true;
  window.location.href = "/challs";
}

export function relog() {
  localStorage.removeItem("login_state");
  window.location.href = "/login";
}

export async function Logout() {
  const resp = await request("POST", "/auth/logout", {});

  if (resp.kind === "goodLogout") {
    localStorage.removeItem("login_state");
    window.location.href = "/";
  }

  return resp;
}

export async function GithubLogin({ githubCode }: { githubCode: string }) {
  const resp = await request("POST", "/auth/callback/github", {
    githubCode,
  });

  if (resp.kind === "goodLogin") {
    return { error: null };
  } else {
    return { error: "Unknown error" };
  }
}
