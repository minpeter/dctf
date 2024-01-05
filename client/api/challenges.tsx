"use client";

import { request, handleResponse } from "./util";

export const getChallenges = async () => {
  const resp = await request("GET", "/challs");

  if (resp.kind === "badNotStarted") {
    return {
      notStarted: true,
    };
  }

  return handleResponse({ resp, valid: ["goodChallenges"] });
};

export const getSolves = ({
  challId,
  limit,
  offset,
}: {
  challId: string;
  limit?: number;
  offset?: number;
}) => {
  return request("GET", `/challs/${encodeURIComponent(challId)}/solves`, {
    limit,
    offset,
  });
};

export const submitFlag = async (id: string, flag: string) => {
  if (flag === undefined || flag.length === 0) {
    return Promise.resolve({
      error: "Flag can't be empty",
    });
  }

  const resp = await request(
    "POST",
    `/challs/${encodeURIComponent(id)}/submit`,
    {
      flag,
    }
  );

  return handleResponse({ resp, valid: ["goodFlag"] });
};

export const startInstance = async (id: string) => {
  const resp = await request("GET", `/challs/${encodeURIComponent(id)}/start`);

  return handleResponse({ resp, valid: ["goodStartInstance"] });
};

export const stopInstance = async (id: string) => {
  const resp = await request("GET", `/challs/${encodeURIComponent(id)}/stop`);

  return handleResponse({ resp, valid: ["goodStopInstance"] });
};
