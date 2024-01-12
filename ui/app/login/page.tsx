"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useEffect, useState } from "react";
import { GithubLogin, SetLoginState } from "@/api/auth";
import { toast } from "sonner";

export default function Page() {
  const onGithubLogin = async () => {
    const resp = await GithubLogin();

    if (resp.error) {
      toast.error(resp.error);
      return;
    } else {
      console.log(resp.url);

      window.location.href = resp.url;

      // var popup = window.open(
      //   resp.url,
      //   "Github oauth login",
      //   "width=700px,height=800px"
      // );

      // if (popup) {
      //   popup.focus();
      // }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-4">Log in to Telos</h1>

      <Button onClick={onGithubLogin}>
        <GitHubLogoIcon className="mr-2 h-4 w-4" /> Login with GitHub
      </Button>

      <div className="flex flex-col items-center justify-center">
        <p className="text-xs text-center">
          *Your first login triggers automatic membership registration.
        </p>
      </div>
    </div>
  );
}
