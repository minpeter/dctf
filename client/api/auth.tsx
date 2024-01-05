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

export async function githubCallback({ githubCode }: { githubCode: string }) {
  const resp = await request("POST", "/auth/callback/github", {
    githubCode,
  });

  if (resp.kind !== "goodGithubToken") {
    return { error: resp.message };
  } else {
    return { error: null };
  }
}

export async function login() {
  const resp = await request("POST", "/auth/login");

  if (resp.kind === "goodLogin") {
    return { error: null, registerRequired: false };
  } else if (resp.kind === "badUnknownUser") {
    return { error: null, registerRequired: true };
  } else {
    return { error: "Unknown error", registerRequired: false };
  }
}

export const register = async () => {
  const resp = await request("POST", "/auth/register");
  switch (resp.kind) {
    case "goodRegister":
      return { error: null };
    case "badAlreadyRegistered":
      return { error: resp.message };
    default:
      return { error: "Unknown error" };
  }
};
