"use client";

import { request, handleResponse } from "./util";

export const getChallenges = async () => {
  const resp = await request("GET", "/admin/challs");

  if (resp.kind === "goodChallenges") {
    return { error: null, data: resp.data };
  }

  return { error: "Unknown error" };
};

export const updateChallenge = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
  return (
    await request("PUT", `/admin/challs/${encodeURIComponent(id)}`, { data })
  ).data;
};

export async function createChallenge({ data }: { data: any }) {
  const resp = await request("POST", "/admin/challs", { data });

  if (resp.kind === "goodChallengeCreate") {
    return { error: null, data: resp.data };
  }

  return { error: "Unknown error" };
}

export const deleteChallenge = async ({ id }: { id: string }) => {
  return (await request("DELETE", `/admin/challs/${encodeURIComponent(id)}`))
    .data;
};

export const uploadFiles = async ({ files }: { files: File[] }) => {
  const resp = await request("POST", "/admin/upload", {
    files,
  });

  return handleResponse({ resp, valid: ["goodFilesUpload"] });
};

export async function checkAdmin(): Promise<boolean> {
  const resp = await request("GET", "/admin/check");

  if (resp.kind === "goodAdminCheck") {
    return true;
  } else {
    return false;
  }
}
