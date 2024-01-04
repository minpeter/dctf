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
    case "badUnknownUser":
      return {
        badUnknownUser: true,
      };
    default:
      return {
        badUnknownUser: resp.error,
      };
  }
}

export const register = async ({
  // email,
  // name,
  githubToken,
}: // recaptchaCode,
{
  // email: string;
  // name: string;
  githubToken: string;
  // recaptchaCode: string;
}) => {
  const resp = await request("POST", "/auth/register", {
    // email,
    // name,
    githubToken,
    // recaptchaCode,
  });
  switch (resp.kind) {
    case "goodRegister":
      SetAuthToken({ authToken: resp.data.authToken });

    case "goodVerifySent":
      return {
        verifySent: true,
      };
    case "badEmail":
    case "badKnownEmail":
    case "badCompetitionNotAllowed":
      return {
        errors: {
          email: resp.message,
        },
      };
    case "badKnownName":
      return {
        errors: {
          name: resp.message,
        },
        data: resp.data,
      };
    case "badName":
      return {
        errors: {
          name: resp.message,
        },
      };
  }
};
