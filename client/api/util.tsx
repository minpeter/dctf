"use client";

export function relog() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

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

  const headers: { [key: string]: string } = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`/api${endpoint}${qs}`, {
    method,
    headers,
    body: body && JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.kind === "badToken") return relog();

      return resp;
    })
    .catch((err) => {
      console.debug(err);
    });
};
