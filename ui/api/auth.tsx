"use client";

import { request } from "@/api/util";
import { useRouter } from "next/navigation";

export function SetLoginState() {
  localStorage.login_state = true;
  const router = useRouter();
  router.push("/challs");
}

export function Relog() {
  localStorage.removeItem("login_state");
  localStorage.removeItem("auth_token");
  const router = useRouter();
  router.push("/login");
}

export async function Logout() {
  localStorage.removeItem("login_state");
  localStorage.removeItem("auth_token");
  window.location.href = "/";
}

export async function CheckLogin() {
  const resp = await request("POST", "/auth/check", {});

  if (resp.kind === "goodUserCheck") {
    return { error: null };
  } else {
    return { error: "Unknown error" };
  }
}

export async function GithubLogin() {
  const resp = await request("POST", "/auth/login/github", {});

  if (resp.kind === "goodGithubUrl") {
    return { error: null, url: resp.data.url };
  }

  return { error: "Unknown error" };
}

export async function GithubCallback({
  code,
  state,
}: {
  code: string;
  state: string;
}) {
  const resp = await request("POST", "/auth/callback/github", {
    code,
    state,
  });

  console.log(resp);

  if (resp.kind == "goodAuth") {
    return { error: null, authToken: resp.data.authToken };
  } else {
    return { error: "Unknown error", authToken: null };
  }
}
