"use client";

import { Relog } from "@/api/auth";

export const handleResponse = ({
  resp,
  valid,
  resolveDataMessage,
}: {
  resp: any;
  valid: Array<string>;
  resolveDataMessage?: boolean;
}) => {
  if (valid.includes(resp.kind)) {
    if (resolveDataMessage) {
      return {
        data: resp.message,
      };
    }
    return {
      data: resp.data,
    };
  }
  return {
    error: resp.message,
  };
};

export const request = (
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  endpoint: string,
  data?: any
) => {
  let body = null;
  let qs = "";
  if (method === "GET" && data) {
    // encode data into the querystring
    // eslint-disable-next-line prefer-template
    qs = Object.keys(data)
      .filter((k) => data[k] !== undefined)
      .map((k) => `${k}=${encodeURIComponent(data[k])}`)
      .join("&");
    qs = `?${qs}`;
  } else {
    body = data;
  }

  const headers: { [key: string]: string } = {};

  if (localStorage.auth_token) {
    headers.Authorization = `Bearer ${localStorage.auth_token}`;
  }

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`/api${endpoint}${qs}`, {
    method,
    headers,
    body: body && JSON.stringify(body),
  })
    .then((resp) => {
      if (resp.status === 401) {
        return Relog();
      }

      if (resp.status != 200) {
        console.error(resp);
        return { kind: "unknownError", data: null, message: "Unknown error" };
      }

      return resp.json();
    })
    .then((resp) => {
      // resp에 kind가 없으면 서버에서 오류가 난 것
      if (!resp.kind || resp.kind == undefined) {
        console.error(resp);
        return { kind: "unknownError", data: null, message: "Unknown error" };
      }
      if (resp.kind === "badToken") return Relog();

      return resp;
    })
    .catch((err) => {
      console.debug(err);
    });
};
