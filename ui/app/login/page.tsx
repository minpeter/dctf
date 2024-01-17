"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  GitHubLogoIcon,
  DiscordLogoIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useCallback, useState } from "react";
import { GithubLogin } from "@/api/auth";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [wait, setWait] = useState(false);

  const onGithubLogin = useCallback(async () => {
    setWait(true);
    const resp = await GithubLogin();
    if (resp.error) {
      toast.error(resp.error);
      return;
    } else {
      router.push(resp.url);
    }
  }, [router]);

  return (
    <Card className="flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold mb-2">Login to Telos</h1>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Email</Label>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full flex items-center gap-1.5">
                <Input
                  type="email"
                  id="email"
                  placeholder="Email - coming soon"
                  disabled
                />

                <Button type="submit" disabled>
                  submit
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-700 text-white">
              <p>Coming soon!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center space-x-2 w-full">
        <hr className="flex-grow border-zinc-200 dark:border-zinc-700" />
        <span className="text-zinc-400 dark:text-zinc-300 text-sm">or</span>
        <hr className="flex-grow border-zinc-200 dark:border-zinc-700" />
      </div>

      <div className="flex flex-col items-center gap-1.5 w-full">
        <Button onClick={onGithubLogin} disabled={wait} className="w-full">
          {wait ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            <>
              <GitHubLogoIcon className="mr-2 h-4 w-4" /> Login with GitHub
            </>
          )}
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button disabled className="w-full">
                  <DiscordLogoIcon className="mr-2 h-4 w-4" />
                  Discord - coming soon
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-700 text-white">
              <p>Coming soon!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <p className="text-xs text-center w-full">
        *Your first login triggers automatic membership registration.
      </p>
    </Card>
  );
}
